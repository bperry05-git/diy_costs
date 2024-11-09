import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            DIY Project Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant AI-powered insights, material recommendations, and cost estimates for your DIY projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Analyze New Project</h2>
            <p className="text-muted-foreground mb-6">
              Upload a photo or describe your DIY project to get started with personalized recommendations
            </p>
            <Link href="/analyze">
              <Button size="lg" className="w-full">
                Start Analysis
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">View Projects</h2>
            <p className="text-muted-foreground mb-6">
              Browse your past projects, compare costs, and track your DIY journey
            </p>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="w-full">
                View Projects
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
