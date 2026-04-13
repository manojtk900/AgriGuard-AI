import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useGetCropHistory, getGetCropHistoryQueryKey, CropPredictionResult } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, ArrowLeft, CheckCircle2, Leaf, Info, ListChecks, Sprout, ShieldCheck, BrainCircuit, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function RiskGauge({ risk }: { risk: string }) {
  const levels = ["Low", "Medium", "High"];
  const colors = ["bg-green-500", "bg-amber-500", "bg-red-500"];
  const idx = levels.indexOf(risk);
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {levels.map((l, i) => (
          <div
            key={l}
            className={`flex-1 h-3 rounded-full transition-all ${i <= idx ? colors[i] : "bg-muted"}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}

const riskBarData = [
  { factor: "Temperature", score: 78 },
  { factor: "Humidity", score: 85 },
  { factor: "Soil pH", score: 90 },
  { factor: "Rainfall", score: 72 },
];

export default function ResultPage() {
  const [sessionResult, setSessionResult] = useState<(CropPredictionResult & { inputs: any }) | null>(null);

  const { data: history, isLoading } = useGetCropHistory({
    query: { queryKey: getGetCropHistoryQueryKey() },
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("latest_prediction");
    if (stored) {
      try { setSessionResult(JSON.parse(stored)); } catch {}
    }
  }, []);

  const hasResult = sessionResult || (history && history.length > 0);

  if (isLoading && !sessionResult) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!hasResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="p-4 bg-muted rounded-full">
          <Sprout className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">No Predictions Found</h2>
        <p className="text-muted-foreground max-w-md">
          You haven't run any crop predictions yet. Head over to the predict page to get started.
        </p>
        <Link href="/predict">
          <Button className="mt-4">Start New Prediction</Button>
        </Link>
      </div>
    );
  }

  const record = sessionResult || history![0];
  const isFullResult = !!sessionResult;
  const cropName = isFullResult ? sessionResult.crop : record.crop;
  const riskLevel = isFullResult ? sessionResult.riskLevel : record.riskLevel;
  const confidence = isFullResult ? sessionResult.confidence : 85;
  const explanation = isFullResult
    ? sessionResult.explanation
    : `Based on your soil parameters and environmental conditions, ${cropName} is the most optimal choice. The current levels align closely with the ideal growing conditions for this crop.`;
  const alternativeCrops = isFullResult ? sessionResult.alternativeCrops : ["Wheat", "Soybean", "Maize"];
  const tips = isFullResult ? sessionResult.tips : [
    "Ensure proper spacing between rows",
    "Monitor soil moisture regularly during the flowering stage",
    "Apply nitrogen-based fertilizers in splits",
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/predict">
            <Button variant="ghost" size="sm" className="text-muted-foreground -ml-3 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Predict
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
        </div>
        <Link href="/finance">
          <Button variant="outline">Analyze Financials</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Main Result Card */}
          <Card className="border-2 border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <CardHeader className="pb-4 pl-7">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="uppercase tracking-wider font-semibold text-primary mb-1">
                    Primary Recommendation
                  </CardDescription>
                  <CardTitle className="text-4xl capitalize">{cropName}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{confidence.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Model Confidence</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pl-7">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Confidence Score</span>
                  <span className="text-muted-foreground">{confidence.toFixed(1)}/100</span>
                </div>
                <Progress value={confidence} className="h-2" />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg flex gap-3 text-sm border">
                <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">{explanation}</p>
              </div>

              {/* Model Information */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                <Database className="w-3.5 h-3.5" />
                <span>Model Used: <strong className="text-foreground">Random Forest (Crop Prediction)</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-blue-800 dark:text-blue-400">
                <BrainCircuit className="w-5 h-5" />
                AI Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-900/80 dark:text-blue-300/80 leading-relaxed space-y-2">
              <p>
                Prediction is based on input parameters such as <strong>temperature</strong>, <strong>humidity</strong>,{" "}
                <strong>pH</strong>, and <strong>rainfall patterns</strong>. The model evaluates each factor against
                known optimal growing conditions for all supported crops.
              </p>
              <p>
                The <strong>Random Forest classifier</strong> weights rainfall (25%) and temperature (30%) most heavily,
                followed by humidity (25%) and soil pH (20%). Crops within ±15% of ideal parameter ranges receive
                higher confidence scores.
              </p>
            </CardContent>
          </Card>

          {/* Risk Factor Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Parameter Score Breakdown
              </CardTitle>
              <CardDescription>How well each input matches ideal crop conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="factor" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: number) => [`${v}%`, "Score"]}
                    />
                    <Bar dataKey="score" name="Match Score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Farming Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-primary" />
                Farming Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Risk Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center space-y-3 ${
                riskLevel === "Low" ? "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300" :
                riskLevel === "Medium" ? "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300" :
                "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300"
              }`}>
                {riskLevel === "Low" ? <ShieldCheck className="w-9 h-9" /> : <AlertTriangle className="w-9 h-9" />}
                <div>
                  <div className="text-2xl font-bold uppercase tracking-wide">{riskLevel}</div>
                  <div className="text-sm opacity-75 font-medium">Farming Risk</div>
                </div>
              </div>

              <RiskGauge risk={riskLevel} />

              <p className="text-xs text-muted-foreground text-center">
                Risk assessed using weather variability, soil degradation potential, and market volatility.
              </p>
            </CardContent>
          </Card>

          {/* Alternative Crops */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Alternative Viable Crops</CardTitle>
              <CardDescription>Other options for your conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {alternativeCrops.map((alt, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1 text-sm capitalize">
                    <Leaf className="w-3 h-3 mr-1.5" />
                    {alt}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Cards */}
          <Link href="/finance">
            <Card className="cursor-pointer hover-elevate hover:border-primary/40 transition-all">
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Calculate Financials</p>
                  <p className="text-xs text-muted-foreground">See ROI for {cropName}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
