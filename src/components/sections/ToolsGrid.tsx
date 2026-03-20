import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const categories = [
  "All Tools",
  "Chatbots & LLMs",
  "Image Generation",
  "Video Generation",
  "Text & Writing",
  "Coding Assistants",
  "Productivity",
  "Research & Data",
  "Audio & Speech",
  "Design & Creative",
  "Business & Marketing"
] as const;

type Category = typeof categories[number];

interface Tool {
  id: number | string;
  name: string;
  category: string;
  description?: string;
}

interface ToolsGridProps {
  tools?: Tool[];
}

export default function ToolsGrid({ tools = [] }: ToolsGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All Tools");

  const filteredTools = activeCategory === "All Tools"
    ? tools
    : tools.filter((tool) => tool.category === activeCategory);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight">Explore AI Tools</h2>
          <p className="text-xl text-muted-foreground mt-4">180+ safety-rated tools for UK schools — filter by category</p>
        </div>

        {/* 11 SCROLLABLE FILTER TABS */}
        <Tabs value={activeCategory} onValueChange={(val) => setActiveCategory(val as Category)}>
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
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="group border border-border rounded-3xl p-6 hover:border-primary/30 transition-all hover:shadow-lg"
              >
                <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{tool.description}</p>
                <div className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {tool.category}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-12 text-lg">
              No tools in this category yet — check back soon!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}