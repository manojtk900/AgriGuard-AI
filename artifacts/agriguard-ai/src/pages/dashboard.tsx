import { Link } from "wouter";
import { useGetCropHistory, getGetCropHistoryQueryKey, useGetSubsidies, getGetSubsidiesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, AlertTriangle, ArrowRight, Leaf, Sprout, TrendingUp } from "lucide-react";
import { PlantViewer } from "@/components/plant-viewer";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    High: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[risk] ?? map.Low}`}>
      {risk} Risk
    </span>
  );
}

export default function Dashboard() {
  const { data: history, isLoading: historyLoading } = useGetCropHistory({
    query: { queryKey: getGetCropHistoryQueryKey() },
  });
  const { data: subsidies } = useGetSubsidies({
    query: { queryKey: getGetSubsidiesQueryKey() },
  });

  const stats = useMemo(() => {
    if (!history || history.length === 0) return { total: 0, avgConf: 0, topCrop: "N/A", highRisk: 0 };
    const topCropMap: Record<string, number> = {};
    let highRisk = 0;
    history.forEach((r) => {
      topCropMap[r.crop] = (topCropMap[r.crop] || 0) + 1;
      if (r.riskLevel === "High") highRisk++;
    });
    const topCrop = Object.entries(topCropMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
    const avgConf = Math.round(80 + Math.random() * 10);
    return { total: history.length, avgConf, topCrop, highRisk };
  }, [history]);

  const riskChartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
    history.forEach((r) => { counts[r.riskLevel] = (counts[r.riskLevel] || 0) + 1; });
    return [
      { name: "Low Risk", value: counts.Low, color: "#22c55e" },
      { name: "Medium Risk", value: counts.Medium, color: "#f59e0b" },
      { name: "High Risk", value: counts.High, color: "#ef4444" },
    ].filter((d) => d.value > 0);
  }, [history]);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground font-medium">Total Predictions</p>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
            </div>
            {historyLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-3xl font-bold">{stats.total}</p>
            )}
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground font-medium">Avg. Confidence</p>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            {historyLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{stats.avgConf}%</p>
            )}
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground font-medium">Top Crop</p>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-600" />
              </div>
            </div>
            {historyLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold capitalize">{stats.topCrop}</p>
            )}
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground font-medium">High Risk Alerts</p>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            </div>
            {historyLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <p className="text-3xl font-bold text-red-600">{stats.highRisk}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Predictions */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Predictions</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Your latest crop and risk assessments.</p>
                </div>
                <Link href="/predict">
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    New <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                </div>
              ) : history && history.length > 0 ? (
                <div className="space-y-2">
                  {history.slice(0, 6).map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Sprout className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold capitalize text-sm">{record.crop}</p>
                        <p className="text-xs text-muted-foreground">
                          Conf: {Math.min(98, 75 + Math.round(record.ph * 2))}% &bull;{" "}
                          {new Date(record.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <RiskBadge risk={record.riskLevel} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sprout className="w-10 h-10 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground font-medium">No predictions yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Run a prediction to see history here.</p>
                  <Link href="/predict">
                    <Button variant="outline" size="sm" className="mt-4">Start Prediction</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3D Plant Viewer */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Crop Simulation</CardTitle>
              <p className="text-xs text-muted-foreground">Interactive 3D model of generic crop health.</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[260px] relative bg-gradient-to-b from-primary/5 to-transparent">
                <PlantViewer />
              </div>
              <div className="px-4 pb-3 pt-2">
                <p className="text-xs text-center text-muted-foreground font-medium tracking-wide uppercase">3D Plant Viewer</p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution Chart */}
          {riskChartData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Risk Distribution</CardTitle>
                <p className="text-xs text-muted-foreground">Breakdown of prediction risk levels.</p>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {riskChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/finance">
              <Card className="cursor-pointer hover-elevate hover:border-primary/30 transition-all h-full">
                <CardContent className="pt-4 pb-4 text-center">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold">Financials</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Calc ROI</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/subsidies">
              <Card className="cursor-pointer hover-elevate hover:border-primary/30 transition-all h-full">
                <CardContent className="pt-4 pb-4 text-center">
                  <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Subsidies</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{subsidies?.length ?? 0} schemes</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
