"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { rhizClient } from "@/lib/rhizClient";

interface RhizContextType {
  identityId: string | null;
  isLoading: boolean;
  ensureIdentity: (email?: string, name?: string) => Promise<string>;
}

const RhizContext = createContext<RhizContextType | undefined>(undefined);

export function RhizProvider({ children }: { children: ReactNode }) {
  const [identityId, setIdentityId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ensureIdentity = async (email?: string, name?: string) => {
    setIsLoading(true);
    try {
      // In a real app, you might check localStorage first or use a proper auth hook
      const storedId = typeof window !== 'undefined' ? localStorage.getItem("rhiz_identity_id") : null;
      
      if (storedId) {
          setIdentityId(storedId);
          setIsLoading(false);
          return storedId;
      }

      const result = await rhizClient.ensureIdentity({ email, name });
      setIdentityId(result.id);
      if (typeof window !== 'undefined') {
          localStorage.setItem("rhiz_identity_id", result.id);
      }
      return result.id;
    } catch (error) {
      console.error("Failed to ensure Rhiz identity:", error);
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Attempt to load identity on mount
    ensureIdentity();
  }, []);

  return (
    <RhizContext.Provider value={{ identityId, isLoading, ensureIdentity }}>
      {children}
    </RhizContext.Provider>
  );
}

export function useRhiz() {
  const context = useContext(RhizContext);
  if (context === undefined) {
    throw new Error("useRhiz must be used within a RhizProvider");
  }
  return context;
}
