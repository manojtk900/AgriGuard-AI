import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalyzeFinancials, FinancialAnalysisResult } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, IndianRupee, PieChart, Calculator, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  crop: z.string().min(1, "Please select a crop"),
  costPerAcre: z.coerce.number().min(1, "Must be greater than 0"),
  acres: z.coerce.number().min(0.1, "Must be greater than 0"),
  season: z.string().optional()
});

export default function FinancePage() {
  const { toast } = useToast();
  const [result, setResult] = useState<FinancialAnalysisResult | null>(null);
  
  const analyzeMutation = useAnalyzeFinancials();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: "rice",
      costPerAcre: 15000,
      acres: 5,
      season: "Kharif"
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    analyzeMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        setResult(data);
        toast({ title: "Analysis Complete", description: "Financial projections generated successfully." });
      },
      onError: () => {
        toast({ title: "Analysis Failed", description: "Could not generate financial data.", variant: "destructive" });
      }
    });
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Viability</h1>
        <p className="text-muted-foreground text-lg">
          Calculate expected costs, revenues, and return on investment for your planned cultivation.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Input Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="crop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a crop" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="sugarcane">Sugarcane</SelectItem>
                            <SelectItem value="soybean">Soybean</SelectItem>
                            <SelectItem value="maize">Maize / Corn</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="costPerAcre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Cost per Acre (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Land Area (Acres)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Growing Season</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Kharif">Kharif (Monsoon)</SelectItem>
                            <SelectItem value="Rabi">Rabi (Winter)</SelectItem>
                            <SelectItem value="Zaid">Zaid (Summer)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full mt-2" disabled={analyzeMutation.isPending}>
                    {analyzeMutation.isPending ? "Calculating..." : "Analyze Profitability"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {!result ? (
            <Card className="h-full border-dashed flex flex-col items-center justify-center p-12 text-center bg-muted/20 min-h-[400px]">
              <PieChart className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analysis Generated</h3>
              <p className="text-muted-foreground">Fill in the parameters on the left and click calculate to see your financial projections, ROI, and break-even analysis.</p>
            </Card>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(result.totalCost)}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-secondary/5 border-secondary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Expected Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(result.grossRevenue)}</div>
                  </CardContent>
                </Card>

                <Card className={`${result.netProfit >= 0 ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${result.netProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {formatCurrency(result.netProfit)}
                    </div>
                    <div className="text-xs font-medium mt-1 opacity-80">
                      {result.roi.toFixed(1)}% ROI
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Projection</CardTitle>
                  <CardDescription>Estimated monthly costs vs revenue realization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          tickFormatter={(value) => `₹${value / 1000}k`}
                        />
                        <Tooltip 
                          cursor={{ fill: 'hsl(var(--muted))' }}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                          formatter={(value: number) => [formatCurrency(value), undefined]}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="cost" name="Cost Input" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        <Bar dataKey="revenue" name="Revenue Realized" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Yield Stats */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Expected Yield</p>
                      <p className="text-xl font-semibold">{result.expectedYield} Quintals</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Market Price</p>
                      <p className="text-xl font-semibold">{formatCurrency(result.marketPrice)}/q</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                        <RefreshCw className="w-4 h-4" /> Break-Even Point
                      </p>
                      <p className="text-xl font-semibold">{result.breakEvenYield.toFixed(1)} Quintals</p>
                      <p className="text-xs text-muted-foreground mt-1">Minimum yield needed to cover costs</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
