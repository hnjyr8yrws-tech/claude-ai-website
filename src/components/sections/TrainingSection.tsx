import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizForm from "../QuizForm";
import { useState, useEffect } from "react";

export default function TrainingSection() {
  const [activeTab, setActiveTab] = useState("overview");

  // Auto-open quiz tab when someone clicks the "60-Second Quiz" button
  useEffect(() => {
    if (window.location.hash === "#quiz") {
      setActiveTab("quiz");
      const section = document.getElementById("training-hub");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <section id="training-hub" className="py-16 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">AI Training Hub</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master AI tools with structured learning paths, resources, and a quick knowledge quiz.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-10 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="paths" className="rounded-lg">Learning Paths</TabsTrigger>
            <TabsTrigger value="resources" className="rounded-lg">Resources</TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-lg">Take Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="prose max-w-none">
              <p>Welcome to the AI Training Hub! Here you'll find everything you need to go from beginner to pro.</p>
            </div>
          </TabsContent>

          <TabsContent value="paths" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border rounded-2xl">Beginner AI Basics</div>
              <div className="p-6 border rounded-2xl">Prompt Engineering Mastery</div>
              <div className="p-6 border rounded-2xl">Advanced AI Tools</div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <p>Resources tab content goes here (videos, articles, PDFs…)</p>
          </TabsContent>

          <TabsContent value="quiz" className="max-w-3xl mx-auto">
            <QuizForm />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
