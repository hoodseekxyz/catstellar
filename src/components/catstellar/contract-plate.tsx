"use client";

import { useState } from "react";
import { contracts } from "@/data/mission";

export function ContractPlate() {
  const [copied, setCopied] = useState(false);
  const value = contracts.token;

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-6 max-w-xl border border-cream/30 bg-ink/80 p-4 backdrop-blur-md">
      <p className="text-xs tracking-widest text-gold uppercase">Token</p>
      {value ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`${contracts.explorer}${value}`}
            className="text-sm break-all text-cream underline decoration-line underline-offset-4 hover:text-gold"
          >
            {value}
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-11 shrink-0 items-center border border-cream/30 px-3 text-xs tracking-widest text-gold uppercase"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : (
        <p className="mt-3 font-display text-2xl italic">Pending. The wormhole is not open.</p>
      )}
      <p className="mt-3 text-sm text-mist">
        {value
          ? "CATSTELLARX. Paired with SPCX. This line is the token."
          : "The address lands here when the launch is real. Until then, a ticker is a costume."}
      </p>
    </div>
  );
}
