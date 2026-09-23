import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border text-sm font-semibold whitespace-nowrap transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-primary/85",
        outline: "border-input bg-background text-foreground hover:bg-muted",
        secondary: "border-input bg-background text-foreground hover:bg-muted",
        ghost: "border-transparent bg-transparent text-foreground hover:bg-muted",
        destructive: "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/85",
        link: "border-transparent bg-transparent text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        xs: "h-9 min-h-11 px-3 text-xs sm:min-h-9 [@media(pointer:coarse)]:min-h-11",
        sm: "h-9 min-h-11 px-4 sm:min-h-9 [@media(pointer:coarse)]:min-h-11",
        lg: "h-12 px-6",
        icon: "size-11 p-0",
        "icon-xs": "size-9 min-h-11 min-w-11 p-0 sm:min-h-9 sm:min-w-9 [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11",
        "icon-sm": "size-9 min-h-11 min-w-11 p-0 sm:min-h-9 sm:min-w-9 [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export { buttonVariants };
