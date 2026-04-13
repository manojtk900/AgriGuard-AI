import { Link } from "wouter";
import { useGetCropHistory, getGetCropHistoryQueryKey, useGetSubsidies, getGetSubsidiesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sprout, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { PlantViewer } from "@/components/plant-viewer";

export default function Dashboard() {
  const { data: history, isLoading: historyLoading } = useGetCropHistory({ 
    query: { queryKey: getGetCropHistoryQueryKey() } 
  });
  
  const { data: subsidies, isLoading: subsidiesLoading } = useGetSubsidies({
    query: { queryKey: getGetSubsidiesQueryKey() }
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-primary/10 border border-primary/20">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="p-8 md:p-12 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Smart Intelligence for <span className="text-primary">Modern Farming</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              AgriGuard AI provides predictive crop recommendations, automated disease detection, and financial analysis to maximize your agricultural yield and profitability.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/predict">
                <Button size="lg" className="gap-2 shadow-md hover-elevate">
                  <Sprout className="w-5 h-5" />
                  Predict Optimal Crop
                </Button>
              </Link>
              <Link href="/disease">
                <Button size="lg" variant="outline" className="gap-2 bg-background hover-elevate">
                  <ShieldCheck className="w-5 h-5" />
                  Detect Diseases
                </Button>
              </Link>
            </div>
          </div>
          <div className="h-[300px] md:h-full min-h-[400px] relative w-full bg-gradient-to-tr from-primary/5 to-transparent">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <PlantViewer />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card hover-elevate border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary" />
              Recent Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{history?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Saved analyses in history</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover-elevate border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              Available Subsidies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subsidiesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{subsidies?.length || 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Active government schemes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover-elevate border-border sm:col-span-2 lg:col-span-2 flex flex-col justify-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Financial Calculator
                </h3>
                <p className="text-sm text-muted-foreground">Estimate your ROI and break-even points.</p>
              </div>
              <Link href="/finance">
                <Button variant="ghost" size="icon" className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent History Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Predictions</h2>
          <Link href="/result">
            <Button variant="link" className="text-primary gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        {historyLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-[120px] w-full rounded-xl" />)}
          </div>
        ) : history && history.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {history.slice(0, 3).map((record) => (
              <Card key={record.id} className="hover-elevate">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg capitalize">{record.crop}</CardTitle>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      record.riskLevel === 'Low' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400' :
                      record.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {record.riskLevel} Risk
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1"><span className="font-medium text-foreground">{record.temperature}°C</span></div>
                    <div className="flex items-center gap-1"><span className="font-medium text-foreground">{record.rainfall}mm</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <Sprout className="w-10 h-10 text-muted-foreground/50" />
              <div>
                <p className="text-muted-foreground font-medium">No predictions yet</p>
                <p className="text-sm text-muted-foreground">Run a prediction to see it here.</p>
              </div>
              <Link href="/predict">
                <Button variant="outline" className="mt-2">Start Prediction</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { FileText } from "lucide-react";
