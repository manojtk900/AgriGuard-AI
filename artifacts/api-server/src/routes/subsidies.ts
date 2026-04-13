import { Router } from "express";

const router = Router();

const subsidies = [
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Direct income support of Rs. 6,000 per year to all farmer families across India, provided in three equal installments of Rs. 2,000 every four months.",
    amount: "Rs. 6,000/year",
    eligibility:
      "All land-holding farmer families with cultivable land. Excludes institutional land holders, farmer families holding constitutional posts, and income taxpayers.",
    applicationUrl: "https://pmkisan.gov.in",
    category: "Income Support",
  },
  {
    id: "pmfby",
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Comprehensive crop insurance scheme covering pre-sowing to post-harvest losses due to natural calamities, pests, and diseases. Premium is heavily subsidized.",
    amount: "2% premium for Kharif, 1.5% for Rabi crops",
    eligibility:
      "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas. Compulsory for loanee farmers.",
    applicationUrl: "https://pmfby.gov.in",
    category: "Insurance",
  },
  {
    id: "pmksy",
    name: "PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)",
    ministry: "Ministry of Jal Shakti",
    description:
      "Focuses on end-to-end irrigation supply chain — from source creation to field level distribution. Promotes drip and sprinkler irrigation under the 'Per Drop More Crop' component.",
    amount: "50% subsidy for small/marginal farmers, 45% for others",
    eligibility:
      "All categories of farmers. Small and marginal farmers get higher subsidy on micro-irrigation equipment installation.",
    applicationUrl: "https://pmksy.gov.in",
    category: "Irrigation",
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC) Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Provides adequate and timely credit to farmers for agricultural operations, post-harvest expenses, and non-farm activities at subsidized interest rates of 4–7%.",
    amount: "Credit up to Rs. 3 lakh at 4% interest (with subvention)",
    eligibility:
      "Farmers, sharecroppers, oral lessees, self-help groups, and joint liability groups engaged in agricultural and allied activities.",
    applicationUrl: "https://www.nabard.org/content1.aspx?id=572",
    category: "Credit",
  },
  {
    id: "smam",
    name: "SMAM (Sub Mission on Agricultural Mechanization)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Promotes use of modern farm machinery through financial assistance and custom hiring centers. Includes support for tractors, power tillers, combine harvesters, and precision farming equipment.",
    amount: "25–50% subsidy on farm machinery (up to Rs. 1.25 lakh)",
    eligibility:
      "Individual farmers, Farmer Producer Organizations, and cooperative societies. Priority to small, marginal, and women farmers.",
    applicationUrl: "https://agrimachinery.nic.in",
    category: "Equipment",
  },
  {
    id: "nfsm",
    name: "NFSM (National Food Security Mission)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Enhances production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion and productivity enhancement. Provides certified seeds, demonstrations, and training.",
    amount: "Seed subsidy, free demonstrations, and training programs",
    eligibility:
      "Farmers in identified districts across states. Focus on small and marginal farmers for maximum benefit.",
    applicationUrl: "https://nfsm.gov.in",
    category: "Input Subsidy",
  },
  {
    id: "pkvy",
    name: "PKVY (Paramparagat Krishi Vikas Yojana)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Promotes organic farming through cluster approach. Provides assistance for organic inputs, certification, and marketing. Helps farmers transition from chemical to organic practices.",
    amount: "Rs. 50,000/ha over 3 years for organic conversion",
    eligibility:
      "Farmers willing to convert to organic farming. Must form clusters of minimum 20 ha. Priority to farmers in hilly, tribal, and rain-fed areas.",
    applicationUrl: "https://pgsindia-ncof.gov.in/pkvy/Index.aspx",
    category: "Input Subsidy",
  },
  {
    id: "pmegp",
    name: "PMEGP (PM Employment Generation Programme)",
    ministry: "Ministry of MSME",
    description:
      "Provides financial assistance for setting up agro-processing micro-enterprises in rural areas. Supports value addition to farm produce through processing units.",
    amount: "25–35% subsidy on project cost (up to Rs. 25 lakh for manufacturing)",
    eligibility:
      "Any individual above 18 years, self-help groups, charitable trusts, and cooperative societies. Educational qualification required for projects above Rs. 10 lakh.",
    applicationUrl: "https://www.kviconline.gov.in/pmegpeportal",
    category: "Credit",
  },
];

router.get("/subsidies", (_req, res) => {
  res.json(subsidies);
});

export default router;
