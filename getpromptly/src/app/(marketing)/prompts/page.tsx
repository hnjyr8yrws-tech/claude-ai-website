// STEP 2 — async server component. Reads the CSV at build time and hands the
// full typed array to the client. useSearchParams (inside the client) requires a
// Suspense boundary, so the client tree is wrapped below.

import { Suspense } from "react";
import { getAllPrompts } from "@/lib/prompts-data";
import PromptsPageClient from "@/components/prompts/PromptsPageClient";
import DevTierSwitcher from "@/components/dev/DevTierSwitcher";

export const metadata = {
  title: "600+ AI Prompts for UK Schools | GetPromptly",
  description:
    "Browse 600+ ready-to-use AI prompts for teachers, leaders, SENCOs, parents, and students. GDPR-friendly, UK curriculum aligned.",
};

export default function PromptsPage() {
  const prompts = getAllPrompts();

  return (
    <>
      <Suspense fallback={null}>
        <PromptsPageClient prompts={prompts} />
      </Suspense>
      <DevTierSwitcher />
    </>
  );
}
