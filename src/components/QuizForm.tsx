import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const quizSchema = z.object({
  q1: z.string(),
  q2: z.string(),
  q3: z.string(),
  q4: z.string(),
  q5: z.string(),
  q6: z.string(),
});

type QuizForm = z.infer<typeof quizSchema>;

const questions = [
  {
    id: "q1",
    question: "What does LLM stand for?",
    options: ["Large Language Model", "Long Learning Machine", "Light Language Module", "Little Learning Model"],
    correct: "Large Language Model",
  },
  {
    id: "q2",
    question: "Which tool is best known for generating images?",
    options: ["ChatGPT", "Midjourney", "GitHub Copilot", "Notion AI"],
    correct: "Midjourney",
  },
  {
    id: "q3",
    question: "What is prompt engineering?",
    options: ["Writing code for AI", "Crafting better instructions for AI", "Designing AI hardware", "Training AI models"],
    correct: "Crafting better instructions for AI",
  },
  {
    id: "q4",
    question: "Which category would video generation tools fall into?",
    options: ["Chatbots & LLMs", "Image Generation", "Video Generation", "Productivity"],
    correct: "Video Generation",
  },
  {
    id: "q5",
    question: "What does 'safety-rated' mean for AI tools in schools?",
    options: ["They are free", "They are tested for child safety and privacy", "They run fast", "They are made in the UK"],
    correct: "They are tested for child safety and privacy",
  },
  {
    id: "q6",
    question: "Which tool helps with writing and editing text?",
    options: ["Runway", "Claude", "DALL·E", "Sora"],
    correct: "Claude",
  },
];

export default function QuizForm() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const form = useForm<QuizForm>({
    resolver: zodResolver(quizSchema),
    defaultValues: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "" },
  });

  const totalQuestions = questions.length;
  const progress = ((step + 1) / totalQuestions) * 100;

  const onSubmit = (data: QuizForm) => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (data[`q${index + 1}` as keyof QuizForm] === q.correct) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const handleNext = () => {
    if (step < totalQuestions - 1) {
      setStep(step + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const restartQuiz = () => {
    setStep(0);
    setScore(0);
    setShowResults(false);
    form.reset();
  };

  if (showResults) {
    const recommendation =
      score >= 80
        ? "🎓 You're an AI Pro! Try advanced tools like Claude, Midjourney Pro, and Runway."
        : score >= 50
        ? "🚀 Solid intermediate level! Start with ChatGPT, Canva Magic Studio, and Gamma."
        : "🌱 Beginner friendly! Begin with free tools like ChatGPT, Bing Image Creator, and Notion AI.";

    return (
      <Card className="p-10 text-center max-w-2xl mx-auto">
        <h3 className="text-5xl font-bold mb-4">{score}%</h3>
        <p className="text-2xl mb-8">Great job!</p>
        <p className="text-lg text-muted-foreground mb-10">{recommendation}</p>
        <Button onClick={restartQuiz} size="lg" className="w-full">
          Take Quiz Again
        </Button>
      </Card>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-3 text-right">
          Question {step + 1} of {totalQuestions}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold mb-8 leading-tight">{currentQ.question}</h3>

        <RadioGroup
          onValueChange={(value) => form.setValue(`q${step + 1}` as keyof QuizForm, value)}
          className="space-y-4"
        >
          {currentQ.options.map((option, idx) => (
            <div key={idx} className="flex items-center space-x-3 border rounded-2xl p-4 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value={option} id={`q${step}-${idx}`} />
              <Label htmlFor={`q${step}-${idx}`} className="flex-1 cursor-pointer text-lg">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          type="button"
          onClick={handleNext}
          disabled={!form.watch(`q${step + 1}` as keyof QuizForm)}
          className="w-full mt-10 text-lg h-14"
        >
          {step === totalQuestions - 1 ? "See My Results" : "Next Question →"}
        </Button>
      </form>
    </div>
  );
}
