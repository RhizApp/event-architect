"use client";

import Link from "next/link";

import { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateEventConfig } from "../actions/events";
import { EventAppConfig } from "@/lib/types";
import { EventLandingPage } from "../components/EventLandingPage";
import { ModeSelector } from "@/components/create/ModeSelector";
import { LiteModeFields } from "@/components/create/LiteModeFields";
import { ArchitectModeFields } from "@/components/create/ArchitectModeFields";
import { GenerationError } from "@/components/create/GenerationError";
import { ImageUploader } from "@/components/create/ImageUploader";

export default function CreateEventPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<(EventAppConfig & { eventId?: string }) | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFormData, setLastFormData] = useState<FormData | null>(null);
  const [mode, setMode] = useState<'lite' | 'architect'>('architect');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scrapedData, setScrapedData] = useState<any | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExtraction = useCallback((data: any) => {
    console.log("Scraped data:", data);
    setScrapedData(data);
    
    // Auto-switch mode if we detect rich details? 
    // For now, staying in current mode is safer, or we could hint user.
    // Ensure we have minimal valid data to show visual feedback
  }, []);

  const handleSubmit = useCallback((formData: FormData) => {
    setError(null);
    setLastFormData(formData); // Save for retry
    
    startTransition(async () => {
      try {
        const result = await generateEventConfig(formData);
        
        if (!result.success || !result.data) {
           const errMsg = result.error || "Unknown error occurred";
           setError(new Error(errMsg));
           return;
        }

        setResult(result.data);
        setRetryCount(0); // Reset retry count on success
      } catch (e) {
        console.error("Submission error:", e);
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    });
  }, []);

  const handleRetry = useCallback(() => {
    if (lastFormData) {
      setRetryCount(prev => prev + 1);
      handleSubmit(lastFormData);
    }
  }, [lastFormData, handleSubmit]);

  if (result) {
    return (
      <div className="bg-white dark:bg-zinc-950 min-h-screen">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 bg-noise text-foreground font-sans selection:bg-brand-500/30">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-24">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tighter text-white mb-3 md:mb-4">
              Configure Your Event
            </h1>
            <p className="text-surface-400 font-light text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Define the constraints and goals. Our AI engine will generate the entire experience architecture in seconds.
            </p>
        </div>

        {/* Configuration Cockpit - Centered */}
        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <section className="relative bg-surface-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-5 md:p-12 shadow-glass ring-1 ring-white/5 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-500/20 to-transparent" />
            <div className="mb-8 md:mb-10 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-heading font-semibold text-white tracking-tight">
                Configuration Parameters
              </h2>
              <span className="text-[10px] md:text-xs font-mono text-brand-400 bg-brand-500/10 px-2 md:px-3 py-1 rounded-full border border-brand-500/20">
                v2.0.0
              </span>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const md = new FormData(e.currentTarget);
              handleSubmit(md);
            }} className="space-y-8 md:space-y-10 pb-24 md:pb-0">
              
              <ModeSelector mode={mode} onChange={setMode} />

              <ImageUploader onExtractionComplete={handleExtraction} />

              {/* LITE MODE SPECIFIC FIELDS */}
              {mode === 'lite' && <LiteModeFields defaultValues={scrapedData} />}

              {/* ARCHITECT MODE SPECIFIC FIELDS */}
              {mode === 'architect' && <ArchitectModeFields defaultValues={scrapedData} />}

              {error && (
                <GenerationError 
                    error={error} 
                    retryCount={retryCount} 
                    isPending={isPending} 
                    onRetry={handleRetry} 
                />
              )}

              {/* SHARED FIELDS (Date & Location) */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4 group">
                  <label className="text-xs font-mono text-brand-300 uppercase tracking-widest group-focus-within:text-brand-400 transition-colors">
                    {mode === 'lite' ? 'When' : '02 // Event Date'}
                  </label>
                  <input
                    key={scrapedData?.eventDate ? 'date-filled' : 'date-empty'}
                    defaultValue={scrapedData?.eventDate}
                    name="eventDate"
                    type="text"
                    placeholder="e.g., 'Oct 12-14, 2025'"
                    className="w-full bg-transparent border-0 border-b border-surface-700/50 focus:border-brand-500 text-lg md:text-xl text-white placeholder-surface-600/50 py-3 px-0 outline-none transition-all duration-300 focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_10px_20px_-10px_rgba(6,182,212,0.1)]"
                    required
                  />
                </div>

                <div className="space-y-4 group">
                  <label className="text-xs font-mono text-brand-300 uppercase tracking-widest group-focus-within:text-brand-400 transition-colors">
                    {mode === 'lite' ? 'Where' : '03 // Location'}
                  </label>
                  <input
                    key={scrapedData?.eventLocation ? 'loc-filled' : 'loc-empty'}
                    defaultValue={scrapedData?.eventLocation}
                    name="eventLocation"
                    type="text"
                    placeholder="e.g., 'Brooklyn, NY'"
                    className="w-full bg-transparent border-0 border-b border-surface-700/50 focus:border-brand-500 text-lg md:text-xl text-white placeholder-surface-600/50 py-3 px-0 outline-none transition-all duration-300 focus:scale-[1.01] focus:-translate-y-0.5 focus:shadow-[0_10px_20px_-10px_rgba(6,182,212,0.1)]"
                    required
                  />
                </div>
              </div>

              {/* Hidden Fields for Defaults */}
              <input type="hidden" name="sessionShape" value="standard" />
              <input type="hidden" name="matchmakingAppetite" value="high" />
              <input type="hidden" name="tools" value="standard" />

              {/* Submit Action - Sticky on Mobile, Static on Desktop */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-950/90 backdrop-blur-xl border-t border-white/10 z-40 md:static md:bg-transparent md:border-t-0 md:p-0 md:z-auto md:backdrop-blur-none">
                 <div className="max-w-4xl mx-auto w-full"> {/* Container to match parent width on mobile optionally, but strictly we just want full width button */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="group relative w-full py-4 md:py-6 bg-white hover:bg-brand-50 rounded-xl md:rounded-2xl text-black font-heading font-bold text-lg md:text-xl tracking-tight transition-all transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-white/20 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 w-full">
                        <AnimatePresence mode="wait">
                          {isPending ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-3"
                            >
                              <span className="animate-spin text-xl md:text-2xl">✺</span>
                              {retryCount > 0 ? (
                                <span className="text-base md:text-xl">Retrying...</span>
                              ) : (
                                <span className="text-base md:text-xl">
                                  {mode === 'lite' ? 'Launching...' : 'Initializing...'}
                                </span>
                              )}
                            </motion.span>
                          ) : (
                            <motion.span
                                key="idle"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3"
                            >
                              {mode === 'lite' ? 'Launch Event' : 'Generate Experience'}
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </button>
                    <div className="hidden md:flex items-center justify-center mt-4 gap-4">
                        <p className="text-center text-surface-500 text-xs">
                        Powered by Rhiz Intelligence • Generates configuration in ~15s
                        </p>
                        <Link href="/" className="text-xs text-brand-400 hover:text-brand-300">
                            Back
                        </Link>
                    </div>
                 </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
