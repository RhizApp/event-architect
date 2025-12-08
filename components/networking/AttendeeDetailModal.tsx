"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, MessageCircle } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { GraphAttendee } from "@/lib/types";

interface AttendeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendee: GraphAttendee | null;
  onConnect?: (attendee: GraphAttendee) => Promise<void>; 
}

export function AttendeeDetailModal({
  isOpen,
  onClose,
  attendee,
  onConnect,
}: AttendeeDetailModalProps) {
  const [connectionStatus, setConnectionStatus] = React.useState<"idle" | "pending" | "connected">("idle");

  // Reset state when modal opens/changes attendee
  React.useEffect(() => {
    if (isOpen) setConnectionStatus("idle");
  }, [isOpen, attendee]);

  const handleConnectClick = async () => {
    if (!attendee || !onConnect) return;
    
    setConnectionStatus("pending");
    try {
      await onConnect(attendee);
      setConnectionStatus("connected");
    } catch (error) {
       console.error("Connection failed", error);
       setConnectionStatus("idle"); // Retry allowed
    }
  };

  if (!attendee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed z-50 w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {/* Header / Cover */}
            <div className="relative h-32 bg-gradient-to-r from-blue-900/40 to-indigo-900/40">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 -mt-12 relative">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-zinc-900 bg-zinc-800 overflow-hidden shadow-lg mb-4">
                {attendee.imageFromUrl ? (
                  <Image
                    src={attendee.imageFromUrl}
                    alt={attendee.preferred_name || "Profile"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <User size={32} />
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="space-y-1 mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  {attendee.preferred_name}
                </h3>
                {attendee.handle && (
                  <p className="text-indigo-400 font-medium">@{attendee.handle}</p>
                )}
                {/* Fallback role */}
                <p className="text-zinc-400 text-sm">Event Attendee</p>
              </div>

              {/* Bio / Tags */}
              <div className="space-y-4">
                {attendee.tags && attendee.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attendee.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
                  <button 
                    onClick={handleConnectClick}
                    disabled={connectionStatus !== "idle"}
                    className={clsx(
                        "flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all",
                        connectionStatus === "connected" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : "bg-white text-black hover:bg-neutral-200"
                    )}
                  >
                     {connectionStatus === "pending" ? (
                         <span className="animate-pulse">Connecting...</span>
                     ) : connectionStatus === "connected" ? (
                         <>✓ Connected</>
                     ) : (
                         <>
                            <User size={16} />
                            Connect
                         </>
                     )}
                  </button>
                  <button className="flex-1 py-2.5 bg-zinc-800 text-white text-sm font-semibold rounded-lg hover:bg-zinc-700 transition-colors border border-white/5 flex items-center justify-center gap-2">
                     <MessageCircle size={16} />
                     Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
