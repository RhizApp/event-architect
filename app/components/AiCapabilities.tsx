"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, CheckCircle2, MessageSquare, LayoutTemplate, Users, Radio, Wand2, CalendarClock } from 'lucide-react';

interface CodePreview {
  label: string;
  text: string;
}

interface ListPreviewItem {
  status: string;
  text: string;
}

type PreviewContent = CodePreview | ListPreviewItem[] | React.ReactNode;

interface Capability {
  title: string;
  description: string;
  longDescription: string;
  icon: (className: string) => React.ReactNode;
  previewType: 'code' | 'visual' | 'list';
  previewContent: PreviewContent;
  color: string;
}

const capabilities: Capability[] = [
  {
    title: "Generative Content",
    description: "Instant copy, agendas, intros & sponsor blurbs.",
    longDescription: "Stop staring at a blank page. Our LLM pipeline generates high-fidelity event content in seconds, ensuring consistent tone across every touchpoint—from speaker bios to marketing emails.",
    color: "from-purple-500 to-indigo-500",
    previewType: "code",
    previewContent: {
      label: "Generated Speaker Intro",
      text: "Please welcome Dr. Aris Thorne. A pioneer in synthetic biology, Aris is redefining how we think about organic computing. Today, she reveals how 'biological circuits' might just be the future of AI infrastructure..."
    },
    icon: (className: string) => (
      <Wand2 className={className} />
    )
  },
  {
    title: "Smart Scheduling",
    description: "Constraint-aware tracks & conflict resolution.",
    longDescription: "The constraint solver validates your schedule against 50+ variables: speaker availability, room capacity, travel time buffers, and audiovisual requirements. It's like a chessboard that solves itself.",
    color: "from-blue-500 to-cyan-500",
    previewType: "list",
    previewContent: [
      { status: "resolved", text: "Conflict: Dr. Thorne double-booked" },
      { status: "optimized", text: "Room Capacity: Main Stage (98% full)" },
      { status: "success", text: "Buffer Added: 15min transition time" }
    ],
    icon: (className: string) => (
      <CalendarClock className={className} />
    )
  },
  {
    title: "Adaptive Voice",
    description: "Brand-safe rewriting & localization.",
    longDescription: "Train the AI on your brand guidelines. Whether you need 'Corporate Professional' or 'High-Energy Playful', the engine rewrites all assets to match your specific voice signature.",
    color: "from-pink-500 to-rose-500",
    previewType: "visual",
    previewContent: (
      <div className="space-y-3">
        <div className="p-3 bg-neutral-800/50 rounded border-l-2 border-neutral-600">
          <div className="text-xs text-neutral-500 mb-1">Input (Draft)</div>
          <div className="text-sm text-neutral-300">&quot;Come to the party tonight, it will be fun.&quot;</div>
        </div>
        <div className="flex justify-center">
            <ArrowRight className="w-4 h-4 text-neutral-500 rotate-90" />
        </div>
        <div className="p-3 bg-brand-500/10 rounded border-l-2 border-brand-500">
          <div className="text-xs text-brand-400 mb-1">Output (Vibrant Tone)</div>
          <div className="text-sm text-white">&quot;Ignite the night! Join us for an electric evening of connection and celebration. ⚡️&quot;</div>
        </div>
      </div>
    ),
    icon: (className: string) => (
      <MessageSquare className={className} />
    )
  },
  {
    title: "Comms & Outreach",
    description: "Drafts cold-opens & follow-up cadences.",
    longDescription: "Automate your speaker and sponsor outreach with sequences that actually sound human. The system personalizes every email based on the recipient's LinkedIn profile and recent work.",
    color: "from-amber-500 to-orange-500",
    previewType: "visual",
    previewContent: (
      <div className="bg-white text-black p-4 rounded-lg font-mono text-xs shadow-xl">
        <div className="border-b border-neutral-200 pb-2 mb-2">
          <span className="text-neutral-500">To:</span> <span className="font-semibold">sarah@example.com</span>
        </div>
        <p className="leading-relaxed">
          &quot;Hi Sarah,<br/><br/>
          I loved your recent paper on <span className="bg-yellow-200 px-1">Zero-Knowledge Proofs</span>. We&apos;d love to have you lead a workshop on this at the Summit...&quot;
        </p>
      </div>
    ),
    icon: (className: string) => (
      <Users className={className} />
    )
  },
  {
    title: "Operational Assets",
    description: "Auto-generates badges, QR & signage copy.",
    longDescription: "Generate print-ready assets instantly. From attendee badges with personalized QR codes to wayfinding signage that adapts to your venue plan.",
    color: "from-emerald-500 to-teal-500",
    previewType: "visual",
    previewContent: (
      <div className="flex items-center justify-center p-4">
        <div className="bg-white text-black w-32 h-44 rounded-xl shadow-lg flex flex-col items-center p-4 border-t-8 border-emerald-500">
             <div className="w-16 h-16 bg-neutral-900 rounded mb-3 flex items-center justify-center text-white text-[8px]">QR</div>
             <div className="font-bold text-lg leading-none">ALICE</div>
             <div className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Speaker</div>
             <div className="mt-auto text-[10px] text-neutral-400">ACCESS ALL</div>
        </div>
      </div>
    ),
    icon: (className: string) => (
      <LayoutTemplate className={className} />
    )
  },
  {
    title: "Networking Prompts",
    description: "Context-aware icebreakers & engagement triggers.",
    longDescription: "Ban awkward silence. We analyze attendee interests to push 'Smart Suggestions' to their phones when they are near each other.",
    color: "from-indigo-500 to-purple-500",
    previewType: "visual",
    previewContent: (
      <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
         <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-xs text-green-400 uppercase tracking-wider font-bold">Nearby Match</span>
         </div>
         <p className="text-sm text-white font-medium">Ask David about:</p>
         <p className="text-sm text-neutral-400 mt-1">&quot;His recent investment in Decentralized Science.&quot;</p>
      </div>
    ),
    icon: (className: string) => (
      <Users className={className} />
    )
  },
  {
    title: "Live Intelligence",
    description: "Q&A summarization & automated recap packs.",
    longDescription: "Don't just record the talk—capture the insight. Our audio pipeline transcribes sessions in real-time and generates 'Key Takeaway' one-pagers for attendees immediately after the applause.",
    color: "from-red-500 to-orange-500",
    previewType: "list",
    previewContent: [
      { status: "live", text: "Recording: Main Stage..." },
      { status: "done", text: "Sentiment Analysis: Positive (92%)" },
      { status: "done", text: "Action Items Extracted: 3" }
    ],
    icon: (className: string) => (
      <Radio className={className} />
    )
  },
  {
    title: "Smart Follow-ups",
    description: "Post-event matchmaking based on interactions.",
    longDescription: "The event ends, but the network grows. We suggest high-value introductions based on who actually met and what they talked about.",
    color: "from-blue-500 to-indigo-500",
    previewType: "visual",
    previewContent: (
      <div className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg">
         <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-neutral-600 border border-neutral-800" />
            <div className="w-8 h-8 rounded-full bg-neutral-500 border border-neutral-800" />
         </div>
         <div className="text-xs">
            <div className="text-white font-medium">New Connection!</div>
            <div className="text-neutral-500">95% Match Score</div>
         </div>
      </div>
    ),
    icon: (className: string) => (
      <CheckCircle2 className={className} />
    )
  }
];

export function AiCapabilities() {
  const [selectedCap, setSelectedCap] = useState<Capability | null>(null);

  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
      <h3 className="text-xs font-mono text-surface-500 uppercase tracking-widest pl-2 border-l-2 border-brand-500/50">
        AI Intelligence Suite
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((cap, i) => (

          <motion.div 
            key={i}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCap(cap)}
            className="group flex gap-4 p-3 rounded-xl cursor-pointer hover:bg-surface-900/60 transition-colors border border-transparent hover:border-surface-800 relative overflow-hidden"
          >
            {/* Hover Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${cap.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            <div className="shrink-0 pt-0.5 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-surface-800/50 flex items-center justify-center group-hover:bg-brand-500/10 group-hover:text-brand-400 text-surface-400 transition-colors">
                {cap.icon("w-4 h-4")}
              </div>
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-medium text-surface-200 group-hover:text-white pb-0.5 flex items-center gap-2">
                {cap.title}
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-surface-400" />
              </h4>
              <p className="text-xs text-surface-500 group-hover:text-surface-400 leading-relaxed">
                {cap.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCap && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCap(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
            />
            <motion.div
              layoutId={`cap-${selectedCap.title}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed z-[101] w-full max-w-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-950 border border-surface-700/50 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header Gradient */}
                <div className={`h-2 w-full bg-gradient-to-r ${selectedCap.color}`} />
                
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-surface-900 border border-surface-800">
                                {selectedCap.icon("w-6 h-6 text-white")}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white font-heading tracking-tight">{selectedCap.title}</h3>
                                <p className="text-sm text-surface-400">Powered by Rhiz Intelligence</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedCap(null)}
                            className="p-2 hover:bg-surface-900 rounded-full text-surface-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-surface-300 leading-relaxed mb-8 text-base">
                        {selectedCap.longDescription}
                    </p>

                    {/* Preview Section */}
                    <div className="bg-surface-900/50 rounded-xl border border-surface-800/50 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-brand-400" />
                            <span className="text-xs font-mono text-brand-400 uppercase tracking-widest">
                                Live Preview
                            </span>
                        </div>
                        
{selectedCap.previewType === 'code' && (
    <div className="font-mono text-sm text-surface-300 bg-surface-950 p-4 rounded-lg border border-surface-800 shadow-inner">
        <div className="text-xs text-surface-500 mb-2 border-b border-surface-800 pb-2">
            {'//'} {(selectedCap.previewContent as CodePreview).label}
        </div>
        {(selectedCap.previewContent as CodePreview).text}
        <span className="animate-pulse inline-block w-2 h-4 bg-brand-500 ml-1 align-middle"></span>
    </div>
)}

                        {selectedCap.previewType === 'list' && (
                             <div className="space-y-3">
                                {(selectedCap.previewContent as ListPreviewItem[]).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm">
                                        {item.status === 'resolved' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {item.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {item.status === 'optimized' && <Zap className="w-4 h-4 text-amber-500" />}
                                        {item.status === 'live' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1 mr-1" />}
                                        {item.status === 'done' && <CheckCircle2 className="w-4 h-4 text-surface-400" />}
                                        {item.status === 'calculated' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                                        <span className="text-surface-200">{item.text}</span>
                                    </div>
                                ))}
                             </div>
                        )}

                        {selectedCap.previewType === 'visual' && (
                            <div className="flex justify-center">
                                {selectedCap.previewContent as React.ReactNode}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-surface-900/30 p-4 border-t border-surface-800 flex justify-between items-center">
                     <span className="text-xs text-surface-500 font-mono">v2.1.0 • MODEL: RHIZ-L-01</span>
                     <button 
                        onClick={() => setSelectedCap(null)}
                        className="text-xs font-semibold text-white hover:text-brand-400 transition-colors flex items-center gap-1"
                     >
                        Close Preview <ArrowRight className="w-3 h-3" />
                     </button>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
