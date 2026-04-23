import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full min-w-0 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-900/15",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
