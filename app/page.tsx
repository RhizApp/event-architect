"use client";

import { useState, useTransition } from "react";
import { generateEventConfig } from "./actions";
import { EventAppConfig } from "@/lib/baml_client/baml_client/types";
import { EventLandingPage } from "./components/EventLandingPage";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<EventAppConfig | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const config = await generateEventConfig(formData);
      setResult(config);
    });
  };

  if (result) {
    return (
      <>
        {/* Floating Back Button */}
        <div className="fixed top-4 right-4 z-50">
          <button 
             onClick={() => setResult(null)}
             className="px-4 py-2 bg-black/80 text-white backdrop-blur-md rounded-full text-sm font-medium hover:bg-black transition-colors shadow-lg border border-white/10"
          >
            ← Back to Editor
          </button>
        </div>
        
        <EventLandingPage config={result} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 font-sans">
      <main className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Rhiz Event Maker
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Design your event&apos;s digital experience powered by Rhiz Protocol.
          </p>
        </header>

        <div className="max-w-xl mx-auto">
          {/* Input Form */}
          <section className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
              Create New Event
            </h2>
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Event Basics
                </label>
                <textarea
                  name="eventBasics"
                  placeholder="e.g. A 2-day tech conference in SF for 500 founders"
                  className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Goals (comma separated)
                </label>
                <input
                  name="goals"
                  placeholder="Networking, Dealflow, Learning"
                  className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Audience
                  </label>
                  <input
                    name="audience"
                    placeholder="Founders, VCs"
                    className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Tone
                  </label>
                  <select
                    name="tone"
                    className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="casual">Casual</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Relationship Intent
                </label>
                <select
                    name="relationshipIntent"
                    className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                  >
                    <option value="high">High (Active Matchmaking)</option>
                    <option value="medium">Medium (Organic Networking)</option>
                    <option value="low">Low (Content Focused)</option>
                  </select>
              </div>

              <input type="hidden" name="sessionShape" value="standard" />
              <input type="hidden" name="matchmakingAppetite" value="high" />
              <input type="hidden" name="tools" value="standard" />

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 px-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
              >
                {isPending ? "Generating Event Experience..." : "Design Event"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
