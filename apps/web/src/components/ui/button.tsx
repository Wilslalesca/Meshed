import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/buttonVariants"; // ✅ This is correct

// export const buttonVariants = cva(
//   // base styles
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold " +
//     "transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none " +
//     "focus-visible:ring-[3px] focus-visible:ring-[--color-ring]/40",
//   {
//     variants: {
//       variant: {
//         // teal primary → gold hover (pulled from your tokens)
//         default:
//           "bg-[--color-primary] text-[--color-primary-foreground] hover:bg-[--color-secondary]",
//         teal:
//           "bg-[--color-teal] text-[--color-primary-foreground] hover:brightness-95",
//         gold:
//           "bg-[--color-gold] text-[--color-secondary-foreground] hover:brightness-95",
//         destructive:
//           "bg-[--color-destructive] text-white hover:brightness-95",

//         // improved outline so it’s never “white on white”
//         outline:
//           "border border-[--color-border] bg-[--color-paper] text-[--color-foreground] " +
//           "hover:bg-[color-mix(in_oklab,var(--color-teal)_12%,transparent)]",

//         ghost: "hover:bg-[color-mix(in_oklab,var(--color-teal)_10%,transparent)]",
//         link: "text-[--color-teal] underline underline-offset-4 hover:opacity-85",
//       },
//       size: {
//         default: "h-10 px-5",
//         sm: "h-8 px-3 rounded-lg",
//         lg: "h-11 px-6 text-base",
//         icon: "size-10 rounded-xl",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
