"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { RhizProvider } from "./components/RhizProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RhizProvider>{children}</RhizProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
