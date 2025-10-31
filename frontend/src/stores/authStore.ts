import { create } from 'zustand'
import axios from 'axios'

interface User {
  id: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setAuth: (user: User, token: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  login: async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password })
    const { user, token } = response.data
    
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    set({ user, token })
  },
  
  logout: () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null })
  },
  
  setAuth: (user: User, token: string) => {
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    set({ user, token })
  }
}))

// Configurar axios con token si existe
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

