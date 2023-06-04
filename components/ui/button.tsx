import { VariantProps, cva } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            theme: {
                primary: "text-white bg-black border border-black  dark:text-black dark:bg-white dark:border-white",
                secondary: "bg-white text-neutral-500 border border-black/10 hover:border-black hover:text-black  dark:bg-black dark:border-white/10 dark:hover:border-white dark:hover:text-white",
            },
            variant: {
                primary: "hover:bg-white hover:text-black  disabled:hover:bg-black disabled:hover:text-white  hover:active:bg-neutral-200  dark:hover:bg-black dark:hover:text-white  disabled:dark:hover:bg-white disabled:dark:hover:text-black  dark:hover:active:bg-neutral-700",
                shadow: "hover:-translate-y-0.5 hover:active:translate-y-0 shadow-md active:shadow-md hover:shadow-xl",
                ghost: "text-neutral-500 hover:text-black bg-transparent border-none hover:border hover:bg-neutral-200 hover:active:bg-neutral-300  dark:text-neutral-500 dark:hover:text-white dark:bg-transparent dark:hover:border dark:hover:bg-neutral-700 dark:hover:active:bg-neutral-600",
                link: "text-neutral-500 hover:text-black bg-transparent border-none hover:border hover:underline hover:underline-offset-4  dark:text-neutral-500 dark:hover:text-white dark:bg-transparent dark:hover:border dark:hover:underline hover:underline-offset-4"
            },
            size: {
                none: "p-0",
                icon: "p-2",
                sm: "p-1 px-3",
                md: "p-2 px-4",
                lg: "p-3 px-6"
            },
        },
        defaultVariants: {
            theme: "primary",
            variant: "primary",
            size: "md",
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, theme, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, theme, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }