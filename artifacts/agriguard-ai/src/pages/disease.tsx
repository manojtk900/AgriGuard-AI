import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDetectDisease, DiseaseDetectionResult } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Stethoscope, AlertCircle, CheckCircle, ShieldAlert, HeartPulse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  cropType: z.string().min(1, "Please select a crop type"),
  image: z.any()
});

export default function DiseasePage() {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  
  const detectMutation = useDetectDisease();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        form.setValue('image', reader.result); // In a real app we'd pass the base64 or FormData
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!previewUrl) {
      toast({ title: "Image required", description: "Please upload an image of the plant.", variant: "destructive" });
      return;
    }

    // In a real app, parse base64 properly. We'll pass a dummy base64 string for the API
    detectMutation.mutate({ 
      data: { 
        imageBase64: previewUrl.split(',')[1] || "dummy_base64", 
        cropType: values.cropType 
      } 
    }, {
      onSuccess: (data) => {
        setResult(data);
        toast({ title: "Analysis Complete", description: "Disease detection finished." });
      },
      onError: () => {
        toast({ title: "Detection Failed", description: "Could not analyze the image.", variant: "destructive" });
      }
    });
  }

  const severityColor = {
    Healthy: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
    Mild: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
    Moderate: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
    Severe: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Plant Disease Detection</h1>
        <p className="text-muted-foreground text-lg">
          Upload a photo of a sick plant or leaf to instantly identify diseases and get treatment recommendations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Clear, focused images yield better results.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cropType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Type (Optional but recommended)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a crop" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="corn">Corn / Maize</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="tomato">Tomato</SelectItem>
                            <SelectItem value="potato">Potato</SelectItem>
                            <SelectItem value="apple">Apple</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormLabel>Plant/Leaf Image</FormLabel>
                    <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}>
                      {previewUrl ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button type="button" variant="secondary" onClick={() => { setPreviewUrl(null); setResult(null); }} className="gap-2">
                              <Upload className="w-4 h-4" /> Change Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center py-6">
                          <div className="p-4 bg-muted rounded-full mb-4">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground mb-1">Click to upload image</span>
                          <span className="text-sm text-muted-foreground">JPG, PNG up to 10MB</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                      )}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={!previewUrl || detectMutation.isPending}
                  >
                    {detectMutation.isPending ? (
                      "Analyzing AI Model..."
                    ) : (
                      <>
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Analyze for Diseases
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className={`border-t-4 ${result.severity === 'Healthy' ? 'border-t-green-500' : 'border-t-destructive'}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardDescription className="font-semibold mb-1 uppercase tracking-wider">Detection Result</CardDescription>
                      <CardTitle className="text-2xl">{result.disease}</CardTitle>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${severityColor[result.severity]}`}>
                      {result.severity}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">AI Confidence</span>
                      <span className="font-bold">{result.confidence.toFixed(1)}%</span>
                    </div>
                    <Progress value={result.confidence} className="h-2" />
                  </div>

                  <div className="text-sm leading-relaxed text-foreground/90 bg-muted/30 p-4 rounded-lg border">
                    {result.description}
                  </div>

                  {result.severity !== 'Healthy' && (
                    <div className="space-y-4">
                      <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                        <h4 className="font-semibold flex items-center gap-2 text-orange-800 dark:text-orange-400 mb-2">
                          <HeartPulse className="w-4 h-4" /> Immediate Treatment
                        </h4>
                        <p className="text-sm text-orange-900/80 dark:text-orange-300/80">{result.treatment}</p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                        <h4 className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-400 mb-2">
                          <ShieldAlert className="w-4 h-4" /> Future Prevention
                        </h4>
                        <p className="text-sm text-blue-900/80 dark:text-blue-300/80">{result.prevention}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/30 rounded-xl border border-dashed border-border min-h-[400px]">
              <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                <Stethoscope className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Awaiting Image</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Upload a photo and click analyze to see detailed disease information, severity, and treatment protocols here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
