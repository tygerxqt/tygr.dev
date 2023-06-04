import { Box, LucideIcon, LucideProps } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
    Nord: (props: LucideProps) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="28" viewBox="0 0 32 28" fill="currentColor">
            <path d="M32 28H22L8 3.5H4V24.5L8 24.5703L13.04 14.9103L14.96 18.4103L10 28H0V0H10L24.16 24.5H28V3.5H24L19.04 13.0903L17.04 9.66L22 0H32V28Z" fill="currentColor" />
        </svg>
    ),
    Lofu: Box
}