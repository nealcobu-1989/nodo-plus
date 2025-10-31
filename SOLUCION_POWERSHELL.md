# Solución: Error de Política de Ejecución de PowerShell

Si ves el error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system
```

## Solución Rápida (Recomendada)

**Opción 1: Usar el script .bat**
Ejecuta `INICIAR_SERVIDORES.bat` - Este script usa `cmd` en lugar de PowerShell y debería funcionar sin problemas.

**Opción 2: Cambiar la política de ejecución de PowerShell**

Abre PowerShell como **Administrador** y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego responde `Y` cuando te pregunte.

**Opción 3: Ejecutar directamente con cmd**

En lugar de usar PowerShell, abre **Command Prompt (cmd)** y ejecuta:

```cmd
cd backend
npm run dev
```

En otra ventana de cmd:
```cmd
cd frontend
npm run dev
```

## Verificar que funciona

1. Backend: Abre http://localhost:3001/api/health en tu navegador
2. Frontend: Abre http://localhost:3000 en tu navegador

