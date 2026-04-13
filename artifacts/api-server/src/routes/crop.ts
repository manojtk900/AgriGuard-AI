import { Router } from "express";
import { z } from "zod";

const router = Router();

const cropPredictionInput = z.object({
  temperature: z.number(),
  humidity: z.number(),
  ph: z.number(),
  rainfall: z.number(),
});

type CropRule = {
  crop: string;
  minTemp: number;
  maxTemp: number;
  minHumidity: number;
  maxHumidity: number;
  minPh: number;
  maxPh: number;
  minRainfall: number;
  maxRainfall: number;
  explanation: string;
  tips: string[];
  alternatives: string[];
};

const cropRules: CropRule[] = [
  {
    crop: "Rice",
    minTemp: 20,
    maxTemp: 37,
    minHumidity: 60,
    maxHumidity: 100,
    minPh: 5.5,
    maxPh: 7.0,
    minRainfall: 100,
    maxRainfall: 300,
    explanation:
      "High rainfall and humidity strongly support rice cultivation. The temperature and soil pH are ideal for paddy growth.",
    tips: [
      "Maintain standing water of 5–10 cm during vegetative stage",
      "Apply nitrogen fertilizer in 3 split doses",
      "Monitor for blast disease during humid conditions",
    ],
    alternatives: ["Jute", "Sugarcane", "Coconut"],
  },
  {
    crop: "Wheat",
    minTemp: 10,
    maxTemp: 25,
    minHumidity: 30,
    maxHumidity: 65,
    minPh: 6.0,
    maxPh: 7.5,
    minRainfall: 30,
    maxRainfall: 100,
    explanation:
      "Cool temperatures and moderate rainfall are perfect for wheat. The soil pH falls within the ideal range for nutrient absorption.",
    tips: [
      "Sow seeds in October–November for best yield",
      "Ensure proper irrigation at crown root initiation stage",
      "Apply phosphorus before sowing for strong root development",
    ],
    alternatives: ["Barley", "Oats", "Mustard"],
  },
  {
    crop: "Maize",
    minTemp: 18,
    maxTemp: 35,
    minHumidity: 50,
    maxHumidity: 80,
    minPh: 5.8,
    maxPh: 7.0,
    minRainfall: 50,
    maxRainfall: 180,
    explanation:
      "Warm temperatures and moderate humidity are well-suited for maize. Good drainage and moderate rainfall support healthy crop development.",
    tips: [
      "Plant in rows with 60–75 cm spacing",
      "Apply potassium fertilizer for strong stalk development",
      "Irrigate at silking and tasseling stages for best yield",
    ],
    alternatives: ["Sorghum", "Pearl Millet", "Cotton"],
  },
  {
    crop: "Chickpea",
    minTemp: 15,
    maxTemp: 30,
    minHumidity: 20,
    maxHumidity: 60,
    minPh: 6.0,
    maxPh: 8.0,
    minRainfall: 20,
    maxRainfall: 80,
    explanation:
      "Dry and cool conditions with low humidity are ideal for chickpea. The alkaline-tolerant soil pH supports good pod development.",
    tips: [
      "Seed treatment with Rhizobium culture before sowing",
      "Avoid waterlogging — ensure well-drained fields",
      "Use drip irrigation for efficient water use",
    ],
    alternatives: ["Lentil", "Peas", "Mustard"],
  },
  {
    crop: "Cotton",
    minTemp: 20,
    maxTemp: 40,
    minHumidity: 40,
    maxHumidity: 70,
    minPh: 6.0,
    maxPh: 8.0,
    minRainfall: 60,
    maxRainfall: 150,
    explanation:
      "Warm temperatures with low to moderate rainfall are excellent for cotton. The soil conditions support strong boll formation.",
    tips: [
      "Choose Bt cotton varieties for bollworm resistance",
      "Apply boron micronutrient during boll development",
      "Monitor for whitefly and aphid pests regularly",
    ],
    alternatives: ["Groundnut", "Sorghum", "Pearl Millet"],
  },
  {
    crop: "Sugarcane",
    minTemp: 20,
    maxTemp: 38,
    minHumidity: 60,
    maxHumidity: 90,
    minPh: 5.5,
    maxPh: 7.5,
    minRainfall: 100,
    maxRainfall: 250,
    explanation:
      "Tropical climate with high humidity and ample rainfall perfectly suits sugarcane. The warm temperatures support rapid stem elongation.",
    tips: [
      "Use sets (setts) from disease-free mother crop",
      "Apply trash mulching to conserve soil moisture",
      "Earthing up at 3 and 6 months improves stability",
    ],
    alternatives: ["Rice", "Banana", "Coconut"],
  },
  {
    crop: "Tomato",
    minTemp: 18,
    maxTemp: 30,
    minHumidity: 45,
    maxHumidity: 75,
    minPh: 6.0,
    maxPh: 7.0,
    minRainfall: 40,
    maxRainfall: 120,
    explanation:
      "Moderate temperatures with good humidity levels create excellent conditions for tomato. Well-balanced soil pH ensures optimal nutrient uptake.",
    tips: [
      "Train plants using stake-and-string method",
      "Apply calcium spray to prevent blossom end rot",
      "Maintain consistent irrigation to avoid fruit cracking",
    ],
    alternatives: ["Chili", "Capsicum", "Eggplant"],
  },
  {
    crop: "Groundnut",
    minTemp: 25,
    maxTemp: 38,
    minHumidity: 40,
    maxHumidity: 70,
    minPh: 5.5,
    maxPh: 7.0,
    minRainfall: 50,
    maxRainfall: 130,
    explanation:
      "Hot and dry conditions are perfect for groundnut cultivation. Light sandy loam soil with these conditions promotes good pod formation.",
    tips: [
      "Inoculate seeds with Bradyrhizobium for nitrogen fixation",
      "Apply gypsum at pegging stage for calcium supply",
      "Harvest when most leaves turn yellow-green",
    ],
    alternatives: ["Sesame", "Sunflower", "Cotton"],
  },
];

function calculateScore(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 1.0;
  const midpoint = (min + max) / 2;
  const range = (max - min) / 2;
  const distance = Math.abs(value - midpoint) - range;
  return Math.max(0, 1 - distance / (range * 2));
}

function predictCropLogic(
  temperature: number,
  humidity: number,
  ph: number,
  rainfall: number,
): {
  crop: CropRule;
  score: number;
} {
  const scored = cropRules.map((rule) => {
    const score =
      calculateScore(temperature, rule.minTemp, rule.maxTemp) * 0.3 +
      calculateScore(humidity, rule.minHumidity, rule.maxHumidity) * 0.25 +
      calculateScore(ph, rule.minPh, rule.maxPh) * 0.2 +
      calculateScore(rainfall, rule.minRainfall, rule.maxRainfall) * 0.25;
    return { crop: rule, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

function assessRisk(
  temperature: number,
  humidity: number,
  ph: number,
  rainfall: number,
): "Low" | "Medium" | "High" {
  let riskScore = 0;

  if (temperature > 38 || temperature < 10) riskScore += 2;
  else if (temperature > 35 || temperature < 15) riskScore += 1;

  if (humidity > 90 || humidity < 20) riskScore += 2;
  else if (humidity > 80 || humidity < 30) riskScore += 1;

  if (ph < 4.5 || ph > 9.0) riskScore += 2;
  else if (ph < 5.5 || ph > 8.5) riskScore += 1;

  if (rainfall > 300 || rainfall < 20) riskScore += 2;
  else if (rainfall > 250 || rainfall < 30) riskScore += 1;

  if (riskScore <= 1) return "Low";
  if (riskScore <= 3) return "Medium";
  return "High";
}

const predictionHistory: {
  id: string;
  crop: string;
  riskLevel: string;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  createdAt: string;
}[] = [
  {
    id: "1",
    crop: "Rice",
    riskLevel: "Low",
    temperature: 28,
    humidity: 75,
    ph: 6.2,
    rainfall: 180,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    crop: "Wheat",
    riskLevel: "Low",
    temperature: 18,
    humidity: 50,
    ph: 6.8,
    rainfall: 60,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    crop: "Cotton",
    riskLevel: "Medium",
    temperature: 35,
    humidity: 55,
    ph: 7.2,
    rainfall: 90,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

router.post("/crop/predict", (req, res) => {
  const parseResult = cropPredictionInput.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid input", details: parseResult.error });
    return;
  }

  const { temperature, humidity, ph, rainfall } = parseResult.data;
  const { crop, score } = predictCropLogic(temperature, humidity, ph, rainfall);
  const riskLevel = assessRisk(temperature, humidity, ph, rainfall);

  const record = {
    id: String(Date.now()),
    crop: crop.crop,
    riskLevel,
    temperature,
    humidity,
    ph,
    rainfall,
    createdAt: new Date().toISOString(),
  };
  predictionHistory.unshift(record);

  res.json({
    crop: crop.crop,
    confidence: Math.round(score * 100),
    riskLevel,
    explanation: crop.explanation,
    alternativeCrops: crop.alternatives,
    tips: crop.tips,
  });
});

router.get("/crop/history", (_req, res) => {
  res.json(predictionHistory.slice(0, 10));
});

export default router;
