import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDetectDisease, DiseaseDetectionResult } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Stethoscope, HeartPulse, ShieldAlert, BrainCircuit, Database, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  cropType: z.string().min(1, "Please select a crop type"),
  image: z.any(),
});

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 70 ? "bg-green-500" : value >= 40 ? "bg-amber-400" : "bg-red-500";
  const label = value >= 70 ? "High Confidence" : value >= 40 ? "Moderate Confidence" : "Low Confidence";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium">Confidence Score</span>
        <span className="font-bold tabular-nums">{value.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    Healthy: "bg-green-100 text-green-800 border-green-200",
    Mild: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Moderate: "bg-orange-100 text-orange-800 border-orange-200",
    Severe: "bg-red-100 text-red-800 border-red-200",
  };
  const icons: Record<string, React.ReactNode> = {
    Healthy: <CheckCircle className="w-3.5 h-3.5" />,
    Mild: <ShieldAlert className="w-3.5 h-3.5" />,
    Moderate: <ShieldAlert className="w-3.5 h-3.5" />,
    Severe: <ShieldAlert className="w-3.5 h-3.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${map[severity] ?? map.Mild}`}>
      {icons[severity]}
      {severity} Severity
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-muted rounded-full" />
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground">Analyzing Plant Image...</p>
        <p className="text-sm text-muted-foreground mt-1">Running CNN disease detection model</p>
      </div>
    </div>
  );
}

export default function DiseasePage() {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);

  const detectMutation = useDetectDisease();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { cropType: "" },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        form.setValue("image", reader.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!previewUrl) {
      toast({ title: "Image required", description: "Please upload an image of the plant.", variant: "destructive" });
      return;
    }
    detectMutation.mutate(
      { data: { imageBase64: previewUrl.split(",")[1] || "dummy", cropType: values.cropType } },
      {
        onSuccess: (data) => {
          setResult(data);
          toast({ title: "Analysis Complete", description: `Detected: ${data.disease}` });
        },
        onError: () => {
          toast({ title: "Detection Failed", description: "Could not analyze the image.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Disease Detection</h1>
        <p className="text-muted-foreground text-base">
          Upload images of affected crop leaves for instant pathology analysis.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Upload */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Image Scanner</CardTitle>
              <CardDescription>Upload a clear, well-lit photo of the affected plant part.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="cropType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select crop (optional)" />
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

                  {/* Image Upload / Preview */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Plant / Leaf Image</label>
                    {previewUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-border group">
                        <img
                          src={previewUrl}
                          alt="Uploaded plant"
                          className="w-full h-56 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => { setPreviewUrl(null); setResult(null); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 text-white text-xs">
                          Image loaded — ready to analyze
                        </div>
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">Click to upload image</span>
                          <span className="text-sm text-muted-foreground mt-1">JPG, PNG up to 10MB</span>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={!previewUrl || detectMutation.isPending}
                  >
                    {detectMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Analyzing AI Model...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Analyze for Diseases
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div>
          {detectMutation.isPending ? (
            <Card className="h-full">
              <CardContent><LoadingSpinner /></CardContent>
            </Card>
          ) : result ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Main diagnosis */}
              <Card className={`border-t-4 ${result.severity === "Healthy" ? "border-t-green-500" : result.severity === "Severe" ? "border-t-red-500" : "border-t-amber-500"}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardDescription className="font-semibold uppercase tracking-wider mb-1">DIAGNOSIS</CardDescription>
                      <CardTitle className="text-2xl">{result.disease}</CardTitle>
                    </div>
                    <SeverityBadge severity={result.severity} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ConfidenceBar value={result.confidence} />

                  <div className="bg-muted/40 p-4 rounded-lg border text-sm leading-relaxed">
                    <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Pathology</p>
                    {result.description}
                  </div>

                  {result.severity !== "Healthy" && (
                    <>
                      <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                        <h4 className="font-semibold flex items-center gap-2 text-orange-800 dark:text-orange-400 mb-2 text-sm">
                          <HeartPulse className="w-4 h-4" /> Treatment Protocol
                        </h4>
                        <p className="text-sm text-orange-900/80 dark:text-orange-300/80">{result.treatment}</p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                        <h4 className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-400 mb-2 text-sm">
                          <ShieldAlert className="w-4 h-4" /> Recommended Action
                        </h4>
                        <p className="text-sm text-blue-900/80 dark:text-blue-300/80">{result.prevention}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* AI Explanation */}
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-400">
                    <BrainCircuit className="w-4 h-4" /> AI Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-900/80 dark:text-blue-300/80">
                  Prediction is based on input parameters such as <strong>leaf texture</strong>,{" "}
                  <strong>color gradients</strong>, <strong>lesion patterns</strong>, and{" "}
                  <strong>morphological features</strong> extracted from the uploaded image using a CNN model.
                </CardContent>
              </Card>

              {/* Model info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                <Database className="w-3.5 h-3.5" />
                <span>Model Used: <strong className="text-foreground">CNN (Disease Detection — Simulated)</strong></span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-muted/20 rounded-xl border border-dashed border-border min-h-[440px]">
              <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                <Stethoscope className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-lg font-semibold">Awaiting Image</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Upload a photo and click analyze to see detailed disease information, severity, confidence score, and treatment protocols here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
