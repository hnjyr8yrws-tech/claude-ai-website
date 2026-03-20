import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function ToolsGrid({ tools }: { tools: any[] }) {
  const [activeTab, setActiveTab] = useState("All Tools");

  const filteredTools = activeTab === "All Tools"
    ? tools
    : tools.filter(t => t.category === activeTab);

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="inline-flex w-full overflow-x-auto pb-4 gap-2 no-scrollbar">
          {["All Tools", "Chatbots & LLMs", /* add the other 9 */].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="whitespace-nowrap">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* your existing tools grid using filteredTools */}
    </>
  );
}
