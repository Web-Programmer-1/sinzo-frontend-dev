// CopyButton.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copied!" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-lg bg-violet-100 p-1.5 text-violet-700 transition hover:bg-violet-200 hover:scale-105 active:scale-95"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}