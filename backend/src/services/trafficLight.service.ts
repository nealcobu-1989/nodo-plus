import { PrismaClient, TrafficLightColor } from '@prisma/client';

const prisma = new PrismaClient();

interface TrafficLightResult {
  score: number;
  color: TrafficLightColor;
}

export async function calculateTrafficLights(questionnaireData: any): Promise<{
  pedagogicalScore: number;
  adaptabilityScore: number;
  impactScore: number;
  organizationalScore: number;
  pedagogicalColor: TrafficLightColor;
  adaptabilityColor: TrafficLightColor;
  impactColor: TrafficLightColor;
  organizationalColor: TrafficLightColor;
}> {
  // Obtener reglas activas
  const rules = await prisma.trafficLightRule.findMany({
    where: { active: true }
  });

  const result: any = {};

  // Calcular cada eje
  for (const axis of ['pedagogical', 'adaptability', 'impact', 'organizational']) {
    const rule = rules.find(r => r.axis === axis);
    
    if (!rule) {
      // Valores por defecto
      result[`${axis}Score`] = 0;
      result[`${axis}Color`] = TrafficLightColor.RED;
      continue;
    }

    // Calcular score basado en ponderaciones
    let score = 0;
    const weights = rule.weights as any;
    
    // Aquí se aplicaría la lógica de cálculo según las preguntas del cuestionario
    // Por ahora, un ejemplo simple:
    Object.keys(weights).forEach(questionKey => {
      const answer = questionnaireData[questionKey];
      const weight = weights[questionKey];
      
      // Normalizar respuesta a 0-100
      if (typeof answer === 'number') {
        score += answer * weight;
      } else if (typeof answer === 'boolean') {
        score += (answer ? 100 : 0) * weight;
      }
    });

    // Determinar color
    let color: TrafficLightColor;
    if (score < rule.thresholdRed) {
      color = TrafficLightColor.RED;
    } else if (score < rule.thresholdYellow) {
      color = TrafficLightColor.YELLOW;
    } else {
      color = TrafficLightColor.GREEN;
    }

    result[`${axis}Score`] = Math.round(score);
    result[`${axis}Color`] = color;
  }

  return result as any;
}

