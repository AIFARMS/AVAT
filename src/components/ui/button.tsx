import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import type { UIProps } from "@/components/ui/types"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 aria-expanded:bg-blue-700 aria-expanded:text-white",
        outline:
          "border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-100 aria-expanded:bg-zinc-100 aria-expanded:text-zinc-950 dark:border-input dark:bg-input/30 dark:text-foreground dark:hover:bg-input/50",
        secondary:
          "bg-zinc-200 text-zinc-950 hover:bg-zinc-300 aria-expanded:bg-zinc-300 aria-expanded:text-zinc-950",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 aria-expanded:bg-emerald-700 aria-expanded:text-white",
        media:
          "bg-indigo-500 text-white hover:bg-indigo-600 aria-expanded:bg-indigo-600 aria-expanded:text-white",
        surface:
          "border-white/20 bg-white/10 text-zinc-100 hover:bg-white/20 hover:text-white aria-expanded:bg-white/20 aria-expanded:text-white",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:border-red-400 focus-visible:ring-red-500/30 dark:focus-visible:ring-red-500/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: UIProps<"button">) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
