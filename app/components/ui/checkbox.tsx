"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-[5px] border border-[#526677] bg-[#0c1219] transition-all duration-150 hover:border-[#88c6e9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a6dfff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090e14] disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:border-[#a6dfff] data-[state=checked]:bg-[#a6dfff] data-[state=checked]:text-[#090e14]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3.5 w-3.5 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
