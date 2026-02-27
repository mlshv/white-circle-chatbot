"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const hiddenClass =
  "rounded-sm bg-muted-foreground px-0.5 text-transparent select-none";

export function Spoiler({
  children,
  pending,
}: {
  children: ReactNode;
  pending?: string;
  node?: unknown;
}) {
  const [revealed, setRevealed] = useState(false);

  if (pending !== undefined) {
    return <span className={hiddenClass}>{children}</span>;
  }

  return (
    <button
      className={cn(
        "inline transition-all duration-200",
        revealed ? "rounded-sm bg-muted/60 px-0.5" : hiddenClass
      )}
      onClick={() => setRevealed((r) => !r)}
      type="button"
    >
      {children}
    </button>
  );
}
