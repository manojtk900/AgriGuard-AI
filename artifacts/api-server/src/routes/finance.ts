import { Router } from "express";
import { z } from "zod";

const router = Router();

const financialAnalysisInput = z.object({
  crop: z.string(),
  costPerAcre: z.number(),
  acres: z.number(),
  season: z.string().optional(),
});

type CropFinancials = {
  yieldPerAcre: number;
  marketPricePerQuintal: number;
  months: string[];
  costDistribution: number[];
};

const cropFinancials: Record<string, CropFinancials> = {
  rice: {
    yieldPerAcre: 22,
    marketPricePerQuintal: 2183,
    months: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
    costDistribution: [0.15, 0.25, 0.2, 0.15, 0.1, 0.15],
  },
  wheat: {
    yieldPerAcre: 18,
    marketPricePerQuintal: 2275,
    months: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    costDistribution: [0.2, 0.2, 0.15, 0.15, 0.15, 0.15],
  },
  maize: {
    yieldPerAcre: 25,
    marketPricePerQuintal: 1962,
    months: ["Jun", "Jul", "Aug", "Sep", "Oct"],
    costDistribution: [0.25, 0.25, 0.2, 0.15, 0.15],
  },
  chickpea: {
    yieldPerAcre: 9,
    marketPricePerQuintal: 5440,
    months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    costDistribution: [0.2, 0.2, 0.15, 0.15, 0.15, 0.15],
  },
  cotton: {
    yieldPerAcre: 8,
    marketPricePerQuintal: 6620,
    months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    costDistribution: [0.15, 0.2, 0.2, 0.2, 0.15, 0.1],
  },
  sugarcane: {
    yieldPerAcre: 300,
    marketPricePerQuintal: 362,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    costDistribution: [0.1, 0.08, 0.08, 0.08, 0.08, 0.08, 0.1, 0.1, 0.1, 0.08, 0.08, 0.04],
  },
  tomato: {
    yieldPerAcre: 80,
    marketPricePerQuintal: 1800,
    months: ["Jul", "Aug", "Sep", "Oct", "Nov"],
    costDistribution: [0.2, 0.25, 0.2, 0.2, 0.15],
  },
  groundnut: {
    yieldPerAcre: 12,
    marketPricePerQuintal: 5550,
    months: ["Jun", "Jul", "Aug", "Sep", "Oct"],
    costDistribution: [0.2, 0.25, 0.25, 0.2, 0.1],
  },
};

router.post("/finance/analyze", (req, res) => {
  const parseResult = financialAnalysisInput.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid input", details: parseResult.error });
    return;
  }

  const { crop, costPerAcre, acres } = parseResult.data;
  const cropKey = crop.toLowerCase();
  const financials = cropFinancials[cropKey] || cropFinancials.rice;

  const totalCost = Math.round(costPerAcre * acres);
  const expectedYield = Math.round(financials.yieldPerAcre * acres * 10) / 10;
  const marketPrice = financials.marketPricePerQuintal;
  const grossRevenue = Math.round(expectedYield * marketPrice);
  const netProfit = grossRevenue - totalCost;
  const roi = Math.round((netProfit / totalCost) * 100 * 10) / 10;
  const breakEvenYield = Math.round((totalCost / marketPrice) * 10) / 10;

  const monthlyData = financials.months.map((month, i) => {
    const monthlyCost = Math.round(totalCost * financials.costDistribution[i]);
    const isHarvestMonth = i === financials.months.length - 1;
    const revenue = isHarvestMonth ? grossRevenue : 0;
    return { month, cost: monthlyCost, revenue };
  });

  res.json({
    totalCost,
    expectedYield,
    marketPrice,
    grossRevenue,
    netProfit,
    roi,
    breakEvenYield,
    monthlyData,
  });
});

export default router;
