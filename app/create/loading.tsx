export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        <p className="text-surface-400 font-mono text-xs uppercase tracking-widest animate-pulse">
          Initializing Creator...
        </p>
      </div>
    </div>
  );
}
