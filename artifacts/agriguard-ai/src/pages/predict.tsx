import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePredictCrop } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sprout, CloudRain, Thermometer, Droplets, FlaskConical, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PlantViewer } from "@/components/plant-viewer";

const formSchema = z.object({
  temperature: z.coerce.number().min(-10).max(60),
  humidity: z.coerce.number().min(0).max(100),
  ph: z.coerce.number().min(0).max(14),
  rainfall: z.coerce.number().min(0).max(5000)
});

export default function PredictPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const predictMutation = usePredictCrop();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: 25,
      humidity: 60,
      ph: 6.5,
      rainfall: 150
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    predictMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        toast({
          title: "Prediction Complete",
          description: `Optimal crop: ${data.crop}`,
        });
        // Store latest result in session storage temporarily so Result page can read it immediately
        // Alternatively, the Result page could just fetch the latest history
        sessionStorage.setItem("latest_prediction", JSON.stringify({ ...data, inputs: values }));
        setLocation("/result");
      },
      onError: (err) => {
        toast({
          title: "Prediction Failed",
          description: "Could not generate crop prediction. Please try again.",
          variant: "destructive"
        });
      }
    });
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crop Prediction Model</h1>
        <p className="text-muted-foreground text-lg">
          Enter your soil and environmental metrics to determine the optimal crop for your field.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Metrics</CardTitle>
              <CardDescription>All fields are required for an accurate prediction.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            Temperature (°C)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 25.5" {...field} />
                          </FormControl>
                          <FormDescription>Average daily temperature</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="humidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            Humidity (%)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 60" {...field} />
                          </FormControl>
                          <FormDescription>Relative air humidity</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ph"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-purple-500" />
                            Soil pH
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 6.5" {...field} />
                          </FormControl>
                          <FormDescription>0 (acidic) to 14 (alkaline)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rainfall"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-blue-600" />
                            Rainfall (mm)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" placeholder="e.g. 200" {...field} />
                          </FormControl>
                          <FormDescription>Expected seasonal rainfall</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    disabled={predictMutation.isPending}
                  >
                    {predictMutation.isPending ? (
                      <>Analyzing Data...</>
                    ) : (
                      <>
                        Run Prediction Model
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20 overflow-hidden h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Live 3D Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-[300px]">
              <div className="absolute inset-0">
                <PlantViewer />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
