"use client";

import Link from "next/link";
import { AiCapabilities } from "./components/AiCapabilities";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-950 text-foreground font-sans selection:bg-brand-500/30">
      <main className="max-w-7xl mx-auto px-6 py-24 lg:flex lg:items-center lg:gap-24 min-h-[calc(100vh-100px)]">
        {/* Cinematic Header */}
        <div className="lg:w-1/2 space-y-10 animate-fade-in relative z-10">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter text-white leading-[0.9]">
              Event <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
                Architect
              </span>
            </h1>
            <p className="text-xl text-surface-400 font-light max-w-lg leading-relaxed">
              Design intelligent, identity-aware event experiences powered by Rhiz Protocol.
              Define the soul of your gathering in seconds.
            </p>
          </div>
          
          <div className="pt-8 border-t border-surface-800/50">
            <div className="flex items-center gap-4 text-surface-500 text-xs tracking-widest uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Status: Active
            </div>

            <Link 
              href="/create"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-brand-50 text-black font-heading font-bold text-xl rounded-full transition-all hover:scale-105 hover:shadow-2xl hover:shadow-brand-500/20 group"
            >
              Start Building
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Feature Showcase (Right Side) */}
        <div className="lg:w-1/2 mt-16 lg:mt-0">
          <div className="relative">
             {/* Abstract Background Element */}
             <div className="absolute -inset-10 bg-gradient-to-tr from-brand-500/10 to-purple-500/10 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
             
             <div className="relative bg-surface-900/30 backdrop-blur-sm border border-surface-800/50 rounded-3xl p-8 shadow-2xl">
                 <AiCapabilities />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
