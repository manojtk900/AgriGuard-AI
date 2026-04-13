import { useGetSubsidies, getGetSubsidiesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Landmark, FileCheck, ExternalLink, IndianRupee } from "lucide-react";

export default function SubsidiesPage() {
  const { data: subsidies, isLoading } = useGetSubsidies({
    query: { queryKey: getGetSubsidiesQueryKey() }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Income Support": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Insurance": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Irrigation": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "Credit": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Equipment": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-secondary/10 text-secondary";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Landmark className="w-8 h-8 text-primary" />
            Government Subsidies
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover and apply for agricultural schemes and financial support programs provided by the Government of India.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {subsidies?.map((subsidy) => (
            <Card key={subsidy.id} className="flex flex-col hover-elevate transition-all border-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="outline" className={`border-0 font-semibold ${getCategoryColor(subsidy.category)}`}>
                    {subsidy.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-tight">{subsidy.name}</CardTitle>
                <CardDescription className="font-medium text-primary/80">
                  {subsidy.ministry}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 text-sm">
                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {subsidy.description}
                </p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-md">
                    <IndianRupee className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-xs uppercase text-muted-foreground mb-0.5">Benefit Amount</span>
                      <span className="font-medium">{subsidy.amount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-md">
                    <FileCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-xs uppercase text-muted-foreground mb-0.5">Eligibility</span>
                      <span className="text-foreground/90">{subsidy.eligibility}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Button className="w-full gap-2 group" variant="default" asChild>
                  <a href={subsidy.applicationUrl || "#"} target="_blank" rel="noreferrer">
                    Check Details <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
