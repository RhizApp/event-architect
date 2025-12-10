"use server";

import { zkClient } from "@/lib/rhizClient";

/**
 * Verify a ZK proof for attendee verification
 */
export async function verifyAttendeeProof(
  proof: Record<string, unknown>, // Changed from any to unknown for safety
  publicSignals: string[],
  vkId: string,
  verifierPersonId?: string
) {
  console.log("Verifying ZK Proof for:", verifierPersonId);

  try {
    const result = await zkClient.verifyProof({
      proof,
      public_signals: publicSignals,
      vk_id: vkId,
      verifier_person_id: verifierPersonId,
    });

    console.log("ZK Verification Result:", result);

    if (result.verified) {
      // If verified, we could optionally update the person's status or log a trust event here
      // e.g., await rhizClient.recordInteraction({ ... type: 'zk_verified' ... })
      return { success: true, message: result.message, log: result.proof_log };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("ZK Verification Error:", error);
    return {
      success: false,
      message: "Verification process failed due to server error",
    };
  }
}

/**
 * Operational Assets
 * "Auto-generates badges, QR & signage copy."
 */
export async function generateAssetPayload(
  attendeeId: string
): Promise<{ qrData: string; badgeLayout: string }> {
  const qrData = `rhiz:attendee:${attendeeId}:sig_${Math.random()
    .toString(36)
    .slice(2)}`;
  return {
    qrData,
    badgeLayout: "Layout_Standard_V1",
  };
}
