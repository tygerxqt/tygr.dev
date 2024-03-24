import {
	Inter,
	JetBrains_Mono,
	Literata,
	Readex_Pro,
	Sora,
} from "next/font/google";
import Providers from "./providers";

import "./globals.css";

import Footer from "@/components/footer";
import { Metadata } from "next";
import Script from "next/script";
import NavBar from "@/components/nav";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});
const sora = Sora({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sora",
});
const literata = Literata({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-literata",
});
const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
	title: "tygr.dev",
	description: "a professional idiot.",
	keywords: ["tygrxqt", "ty mason", "tygr dev", "tygr", "tyger796", "tyger"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${sora.variable} ${literata.variable} ${jetbrainsMono.variable}`}
		>
			<body className="bg-neutral-100 dark:bg-neutral-900">
				<Script
					async
					src="https://analytics.tygr.dev/script.js"
					data-website-id="817137dd-63e0-4d02-bf17-a0f7723860b2"
				/>
				<div
					className="w-full min-h-screen p-2 sm:p-4 bg-neutral-100 dark:bg-neutral-900"
					vaul-drawer-wrapper=""
				>
					<Providers>
						<NavBar />
						{children}
						<Footer />
					</Providers>
				</div>
			</body>
		</html>
	);
}
