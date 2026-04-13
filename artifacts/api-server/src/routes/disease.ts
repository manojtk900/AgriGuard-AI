import { Router } from "express";
import { z } from "zod";

const router = Router();

const diseaseDetectionInput = z.object({
  imageBase64: z.string(),
  cropType: z.string().optional(),
});

type DiseaseProfile = {
  disease: string;
  severity: "Healthy" | "Mild" | "Moderate" | "Severe";
  description: string;
  treatment: string;
  prevention: string;
};

const diseaseProfiles: DiseaseProfile[] = [
  {
    disease: "Healthy",
    severity: "Healthy",
    description:
      "The plant appears healthy with no signs of disease or pest damage. Leaf color, texture, and structure are all within normal parameters.",
    treatment:
      "No treatment required. Continue standard agricultural practices.",
    prevention:
      "Maintain crop rotation, balanced fertilization, and regular field scouting to keep the crop healthy.",
  },
  {
    disease: "Leaf Spot",
    severity: "Mild",
    description:
      "Circular to irregular brown or tan spots detected on leaf surfaces. Early-stage fungal infection likely caused by Cercospora or Alternaria species.",
    treatment:
      "Apply copper-based fungicide or mancozeb at 2g/L. Remove and destroy severely infected leaves. Improve field drainage.",
    prevention:
      "Use disease-resistant varieties. Avoid overhead irrigation. Maintain proper plant spacing for airflow.",
  },
  {
    disease: "Powdery Mildew",
    severity: "Mild",
    description:
      "White to grayish powdery coating detected on leaf surfaces. Caused by Erysiphe species, commonly seen in humid conditions with temperature fluctuations.",
    treatment:
      "Apply sulfur-based fungicide or potassium bicarbonate spray. Remove affected plant parts. Ensure good air circulation.",
    prevention:
      "Plant resistant varieties. Avoid excess nitrogen fertilization. Maintain proper spacing and pruning.",
  },
  {
    disease: "Early Blight",
    severity: "Moderate",
    description:
      "Dark brown spots with concentric rings (target-like pattern) detected on older leaves. Alternaria solani infection spreading from lower canopy upward.",
    treatment:
      "Apply chlorothalonil or mancozeb fungicide. Remove infected lower leaves. Apply potassium-rich fertilizer to boost plant immunity.",
    prevention:
      "Practice 3-year crop rotation. Use certified disease-free seeds. Avoid overhead irrigation in the evening.",
  },
  {
    disease: "Late Blight",
    severity: "Severe",
    description:
      "Large, water-soaked lesions with white mold on leaf undersides detected. Phytophthora infestans — a highly destructive pathogen that spreads rapidly in cool, wet conditions.",
    treatment:
      "Apply metalaxyl + mancozeb (Ridomil) immediately. Destroy heavily infected plants. Alert neighboring farmers as it spreads rapidly.",
    prevention:
      "Use certified seed/planting material. Apply preventive fungicide before disease onset. Monitor forecasts for cool, wet weather.",
  },
  {
    disease: "Rust",
    severity: "Moderate",
    description:
      "Orange-brown pustules on leaf surfaces with yellow halos detected. Fungal rust disease (Puccinia species) reducing photosynthesis capacity significantly.",
    treatment:
      "Apply tebuconazole or propiconazole systemic fungicide. Spray in early morning. Repeat after 10–14 days if required.",
    prevention:
      "Use resistant crop varieties. Apply sulfur dust as preventive measure. Remove crop residues after harvest.",
  },
  {
    disease: "Yellow Mosaic Virus",
    severity: "Severe",
    description:
      "Irregular yellow-green mosaic pattern on leaves indicating viral infection. Spread by whitefly vectors. Can cause 60–100% yield loss if not managed early.",
    treatment:
      "No direct cure exists. Remove and destroy infected plants immediately. Control whitefly population with imidacloprid or thiamethoxam.",
    prevention:
      "Use virus-resistant varieties. Apply reflective mulch to deter whiteflies. Plant border crops to reduce vector landing.",
  },
];

function simulateDetection(imageSize: number, cropType?: string): DiseaseProfile {
  const weights = [0.35, 0.18, 0.12, 0.15, 0.08, 0.07, 0.05];
  const rand = (imageSize % 100) / 100;
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      return diseaseProfiles[i];
    }
  }
  return diseaseProfiles[0];
}

router.post("/disease/detect", (req, res) => {
  const parseResult = diseaseDetectionInput.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid input", details: parseResult.error });
    return;
  }

  const { imageBase64, cropType } = parseResult.data;
  const imageSize = imageBase64.length;

  const profile = simulateDetection(imageSize, cropType);
  const baseConfidence = 78 + (imageSize % 20);
  const confidence = Math.min(99, baseConfidence);

  res.json({
    disease: profile.disease,
    severity: profile.severity,
    confidence,
    description: profile.description,
    treatment: profile.treatment,
    prevention: profile.prevention,
  });
});

export default router;
