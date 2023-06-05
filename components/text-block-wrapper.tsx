"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface TextBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    expandButtonTitle?: string
}

export function TextBlockWrapper({
    expandButtonTitle = "View More",
    className,
    children,
    ...props
}: TextBlockProps) {
    const [isOpened, setIsOpened] = React.useState(false)

    return (
        <Collapsible open={isOpened} onOpenChange={setIsOpened}>
            <div className={cn("relative overflow-hidden", className)} {...props}>
                <CollapsibleContent
                    forceMount
                    className={cn("overflow-hidden", !isOpened && "max-h-32")}
                >
                    <div
                        className={cn(
                            "[&_pre]:my-0 [&_pre]:max-h-[650px] [&_pre]:pb-[100px]",
                            !isOpened ? "[&_pre]:overflow-hidden" : "[&_pre]:overflow-auto]"
                        )}
                    >
                        {children}
                    </div>
                </CollapsibleContent>
                <div
                    className={cn(
                        "absolute flex items-center justify-center bg-gradient-to-b from-[#1C1B22]/30 to-white/90 dark:to-[#1C1B22]/90 p-2",
                        isOpened ? "inset-x-0 bottom-0 h-12" : "inset-0"
                    )}
                >
                    <CollapsibleTrigger asChild>
                        <Button variant="primary" className="h-8 text-xs">
                            {isOpened ? "Collapse" : expandButtonTitle}
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </div>
        </Collapsible>
    )
}