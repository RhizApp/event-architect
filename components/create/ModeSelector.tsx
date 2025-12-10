
import { motion } from "framer-motion";

interface ModeSelectorProps {
  mode: 'lite' | 'architect';
  onChange: (mode: 'lite' | 'architect') => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="space-y-4 group">
      <label className="text-xs font-mono text-brand-300 uppercase tracking-widest group-focus-within:text-brand-400 transition-colors">
        00 // Select Mode
      </label>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            id: 'lite',
            label: 'Lite Mode',
            desc: 'Quick, essential event setup. Best for meetups and simple gatherings.'
          },
          {
            id: 'architect',
            label: 'Architect Mode',
            desc: 'Full AI-powered experience design with deep customization.'
          }
        ].map((option) => (
          <div
            key={option.id}
            onClick={() => onChange(option.id as 'lite' | 'architect')}
            className={`relative flex cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
              mode === option.id
                ? 'border-brand-500/50 bg-brand-500/5'
                : 'border-surface-800 bg-surface-900/30 hover:bg-surface-800/50 hover:border-surface-700'
            }`}
          >
            {mode === option.id && (
              <motion.div
                layoutId="mode-highlight"
                className="absolute inset-0 rounded-xl bg-brand-500/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="relative z-10 w-full flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`font-heading font-semibold transition-colors ${mode === option.id ? 'text-brand-100' : 'text-surface-200'}`}>
                  {option.label}
                </span>
                {mode === option.id && (
                    <motion.span 
                        layoutId="active-dot"
                        className="h-2 w-2 rounded-full bg-brand-400 shadow-glow-sm" 
                    />
                )}
              </div>
              <p className="text-sm text-surface-400 font-light">
                {option.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
