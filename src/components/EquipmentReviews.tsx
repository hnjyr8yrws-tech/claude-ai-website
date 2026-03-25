import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const equipment = [
  {
    name: "MagicSchool.ai",
    description: "AI lesson planner & resource generator trusted by 2M+ teachers. Instant prompts, rubrics, and worksheets.",
    safetyScore: 98,
    rating: 4.9,
    category: "Lesson Planning",
  },
  {
    name: "SchoolAI",
    description: "Classroom AI companion that adapts to every pupil. Real-time feedback and safe prompting built-in.",
    safetyScore: 97,
    rating: 4.8,
    category: "Student Support",
  },
  {
    name: "Brisk Teaching",
    description: "Chrome extension that turns any Google Doc into an AI teaching assistant in seconds.",
    safetyScore: 96,
    rating: 4.7,
    category: "Workflow Tools",
  },
  {
    name: "Curipod",
    description: "Instant interactive lessons with polls, drawings & AI-generated questions. Perfect for UK curriculum.",
    safetyScore: 95,
    rating: 4.9,
    category: "Interactive Lessons",
  },
  {
    name: "Diffit",
    description: "AI that instantly differentiates any text for every reading level – ideal for SEND support.",
    safetyScore: 94,
    rating: 4.8,
    category: "Differentiation",
  },
  {
    name: "Eduaide.ai",
    description: "All-in-one AI teacher toolkit: rubrics, quizzes, IEPs and safe prompt library.",
    safetyScore: 93,
    rating: 4.6,
    category: "Teacher Toolkit",
  },
  {
    name: "Twee",
    description: "AI for language & literacy teachers. Creates stories, dialogues and comprehension tasks instantly.",
    safetyScore: 92,
    rating: 4.7,
    category: "Literacy",
  },
  {
    name: "Khanmigo",
    description: "Khan Academy's AI tutor – guided learning with full safety controls and curriculum alignment.",
    safetyScore: 98,
    rating: 4.9,
    category: "Tutoring",
  },
  {
    name: "Century Tech",
    description: "Personalised learning platform with AI pathways and powerful UK curriculum mapping.",
    safetyScore: 95,
    rating: 4.8,
    category: "Personalised Learning",
  },
];

export default function EquipmentReviews() {
  return (
    <section id="equipment-reviews" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3">NEW</Badge>
          <h2 className="text-4xl font-bold tracking-tight">Equipment Reviews</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            We test the best AI tools for UK classrooms. Every tool is scored for <span className="font-semibold text-emerald-600">safety, effectiveness</span> and real-world classroom use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl group-hover:text-emerald-600 transition-colors">{item.name}</CardTitle>
                  <Badge variant="outline" className="text-emerald-700 border-emerald-200">{item.category}</Badge>
                </div>
                <CardDescription className="text-base">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-6">
                  {/* Safety Score */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Promptly Safety Score</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-emerald-600">{item.safetyScore}</span>
                      <span className="text-2xl text-emerald-600">/100</span>
                    </div>
                  </div>
                  {/* Star rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                </div>

                <Button className="w-full group-hover:bg-emerald-600" variant="default">
                  Read Full Review →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button size="lg" variant="outline" asChild>
            <a href="#training-hub">Browse All 40+ Tools in Training Hub</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
