"use server";

import { b as baml } from "@/lib/baml_client/baml_client";
import { EventAppConfig } from "@/lib/baml_client/baml_client/types";

// Define the arguments for the server action
// Define the arguments for the server action
export async function generateEventConfig(formData: FormData) {
  const eventBasics = (formData.get("eventBasics") as string) || "";
  const goalsStr = (formData.get("goals") as string) || "";
  const goals = goalsStr.split(",").map(s => s.trim()).filter(Boolean);
  const audience = (formData.get("audience") as string) || "General Audience";
  const relationshipIntent = (formData.get("relationshipIntent") as string) || "medium";
  const sessionShape = (formData.get("sessionShape") as string) || "standard";
  const matchmakingAppetite = (formData.get("matchmakingAppetite") as string) || "high";
  const tools = (formData.get("tools") as string) || "standard";
  const tone = (formData.get("tone") as string) || "professional";

  console.log("Generating config with inputs:", { eventBasics, goals, audience, relationshipIntent, tone });

  try {
    const config: EventAppConfig = await baml.GenerateEventAppConfig(
      eventBasics,
      goals,
      audience,
      relationshipIntent,
      sessionShape,
      matchmakingAppetite,
      tools,
      tone
    );
    return config;
  } catch (error: any) {
    console.error("BAML Generation Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    // Check for specific error types if known, or just return the message
    throw new Error(`Failed to generate event configuration: ${error.message || "Unknown error"}`);
  }
}
