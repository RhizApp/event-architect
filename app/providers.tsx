"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { RhizProvider } from "./components/RhizProvider";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RhizProvider>{children}</RhizProvider>
    </QueryClientProvider>
  );
}
