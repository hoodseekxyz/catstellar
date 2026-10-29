"use client";

import { useState } from "react";
import { contracts } from "@/data/mission";

type Which = "token" | "recorder";

export function ContractPlate() {
  const [copied, setCopied] = useState<Which | null>(null);

  async function copy(which: Which, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      window.setTimeout(() => setCopied((current) => (current === which ? null : current)), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="max-w-xl border border-cream/30 bg-ink/80 p-4 backdrop-blur-md">
      <p className="text-xs tracking-widest text-gold uppercase">Contracts</p>
      <ul className="mt-3 divide-y divide-cream/15">
        <PlateRow
          label="Token"
          value={contracts.token}
          empty="Pending. The curve has not opened."
          copied={copied === "token"}
          onCopy={
            contracts.token ? () => copy("token", contracts.token as string) : undefined
          }
        />
        <PlateRow
          label="Flight recorder"
          value={contracts.recorder}
          hint="Not the token. One filing burns 1,000."
          copied={copied === "recorder"}
          onCopy={() => copy("recorder", contracts.recorder)}
        />
      </ul>
    </div>
  );
}

function PlateRow({
  label,
  value,
  empty,
  hint,
  copied,
  onCopy,
}: {
  label: string;
  value: string | null;
  empty?: string;
  hint?: string;
  copied: boolean;
  onCopy?: () => void;
}) {
  const href = value ? `${contracts.explorer}${value}` : undefined;
  return (
    <li className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs tracking-widest text-mist uppercase">{label}</p>
        {value ? (
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 text-xs text-gold hover:text-cream"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      {value ? (
        <a
          href={href}
          className="mt-1 block text-sm break-all text-cream underline decoration-cream/30 underline-offset-4 hover:text-gold"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm text-cream">{empty}</p>
      )}
      {hint ? <p className="mt-1 text-xs text-mist">{hint}</p> : null}
    </li>
  );
}
