import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

const categories = [
  "All Tools", "Chatbots & LLMs", "Image Generation", "Video Generation",
  "Text & Writing", "Coding Assistants", "Productivity", "Research & Data",
  "Audio & Speech", "Design & Creative", "Business & Marketing"
] as const;

type Category = typeof categories[number];

interface Tool {
  id: number;
  name: string;
  category: string;
  description: string;
  safetyScore: number;
  link?: string;
}

// Sample data — 21 tools across categories
const SAMPLE_TOOLS: Tool[] = [
  { id: 1, name: "Claude 3", category: "Chatbots & LLMs", description: "Advanced conversational AI by Anthropic, excellent for reasoning and safety.", safetyScore: 92 },
  { id: 2, name: "ChatGPT-4o", category: "Chatbots & LLMs", description: "OpenAI's flagship model, multimodal and very capable.", safetyScore: 85 },
  { id: 3, name: "Midjourney v6", category: "Image Generation", description: "Best-in-class AI image generator via Discord.", safetyScore: 78 },
  { id: 4, name: "DALL·E 3", category: "Image Generation", description: "OpenAI's text-to-image model, integrated in ChatGPT.", safetyScore: 88 },
  { id: 5, name: "Runway Gen-3", category: "Video Generation", description: "High-quality text-to-video and image-to-video.", safetyScore: 82 },
  { id: 6, name: "Sora", category: "Video Generation", description: "OpenAI's upcoming video model (waitlist).", safetyScore: 90 },
  { id: 7, name: "GrammarlyGO", category: "Text & Writing", description: "AI writing assistant for emails, docs, and social.", safetyScore: 95 },
  { id: 8, name: "Jasper", category: "Text & Writing", description: "Marketing-focused AI copywriter.", safetyScore: 80 },
  { id: 9, name: "GitHub Copilot", category: "Coding Assistants", description: "AI pair programmer in VS Code.", safetyScore: 89 },
  { id: 10, name: "Cursor", category: "Coding Assistants", description: "AI-first code editor (built on Claude).", safetyScore: 91 },
  { id: 11, name: "Notion AI", category: "Productivity", description: "AI features inside Notion for summaries and writing.", safetyScore: 94 },
  { id: 12, name: "Perplexity AI", category: "Research & Data", description: "AI search engine with real-time web access.", safetyScore: 87 },
  { id: 13, name: "ElevenLabs", category: "Audio & Speech", description: "Ultra-realistic text-to-speech and voice cloning.", safetyScore: 75 },
  { id: 14, name: "Canva Magic Studio", category: "Design & Creative", description: "AI design tools inside Canva.", safetyScore: 93 },
  { id: 15, name: "Gamma", category: "Design & Creative", description: "AI-powered presentation builder.", safetyScore: 90 },
  { id: 16, name: "HubSpot AI", category: "Business & Marketing", description: "AI for emails, content, and CRM.", safetyScore: 88 },
  { id: 17, name: "Gemini 1.5", category: "Chatbots & LLMs", description: "Google's long-context model.", safetyScore: 86 },
  { id: 18, name: "Stable Diffusion 3", category: "Image Generation", description: "Open-source image model by Stability AI.", safetyScore: 80 },
  { id: 19, name: "Descript Overdub", category: "Audio & Speech", description: "Voice cloning and editing in podcasts.", safetyScore: 82 },
  { id: 20, name: "Zapier Central", category: "Productivity", description: "AI agents for automation workflows.", safetyScore: 91 },
  { id: 21, name: "Otter.ai", category: "Productivity", description: "AI meeting notes and transcription.", safetyScore: 89 }
];

interface ToolsGridProps {
  tools?: Tool[];
}

export default function ToolsGrid({ tools = SAMPLE_TOOLS }: ToolsGridProps) {
  const ITEMS_PER_PAGE = 9;

  const [activeCategory, setActiveCategory] = useState<Category>("All Tools");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredTools = useMemo(() => {
    return tools
      .filter((tool) => {
        const matchesCategory = activeCategory === "All Tools" || tool.category === activeCategory;
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.safetyScore - a.safetyScore);
  }, [tools, activeCategory, searchTerm]);

  const paginatedTools = useMemo(() => {
    return filteredTools.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredTools, page]);

  const hasMore = paginatedTools.length < filteredTools.length;

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight">Explore AI Tools</h2>
          <p className="text-xl text-muted-foreground mt-4">180+ safety-rated tools for UK schools</p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto mb-8">
          <Input
            type="text"
            placeholder="Search tools... (e.g. Midjourney, Claude, ChatGPT)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 text-base shadow-sm"
          />
        </div>

        {/* 11 FILTER TABS */}
        <Tabs value={activeCategory} onValueChange={(val) => {
          setActiveCategory(val as Category);
          setPage(1); // reset pagination on category change
        }}>
          <TabsList className="inline-flex h-12 items-center bg-muted/50 p-1 rounded-xl mb-12 overflow-x-auto no-scrollbar w-full">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap text-base"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTools.length > 0 ? (
            paginatedTools.map((tool) => (
              <div
                key={tool.id}
                className="group border border-border rounded-3xl p-6 hover:border-primary/30 transition-all hover:shadow-lg flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">{tool.name}</h3>
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    {tool.safetyScore}% safe
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex-grow line-clamp-4 mb-4">{tool.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <div className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {tool.category}
                  </div>
                  {tool.link && (
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      Visit →
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-12 text-lg">
              No tools match your search — try different keywords!
            </p>
          )}
        </div>

        {/* LOAD MORE BUTTON */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}