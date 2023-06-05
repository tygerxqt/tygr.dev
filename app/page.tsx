import { Icons } from "@/components/icons";
import Image from "next/image";
import { FaReact, FaRust } from "react-icons/fa";
import { SiAstro, SiFigma, SiSvelte, SiTypescript } from "react-icons/si";
import { AiFillCamera, AiFillHtml5 } from "react-icons/ai";
import { MdDesignServices } from "react-icons/md";

export default function Home() {
  return (
    <main className="gap-4 py-8">
      <div className="flex flex-row gap-4">
        <Image width={132} height={132} className="max-h-[132px] rounded-md hidden sm:block" src="https://secure.gravatar.com/avatar/871c2885d0acbbc08be33547816255e3?size=512" alt="Avatar" />
        <div className="flex flex-col items-start">
          <small className="text-sm text-neutral-500">
            any - they/them • 17 • UK <span><s>(bri ish)</s></span>
          </small>
          <p className="items-center w-full max-w-2xl text-2xl font-bold sm:text-3xl font-display">
            <span className="text-neutral-500">ty mason.</span> aka tygerxqt, <span className="text-neutral-500">a professional idiot.</span> founder
            <span className="dark:text-neutral-400 text-neutral-600">{" "} and {" "}</span>
            head of design
            <span className="dark:text-neutral-400 text-neutral-600">{" "} at {" "}</span>
            <a target="_blank" href="https://nordstud.io" className="inline-flex flex-row items-center gap-3">nord studio
              <span className="pr-1 dark:text-neutral-400 text-neutral-600">
                <Icons.Nord className="w-8 h-8" />
              </span>
            </a>
            <span className="dark:text-neutral-400 text-neutral-600"> and {" "}</span>
            <a target="_blank" href="https://lofu.studio" className="inline-flex flex-row items-center gap-2">
              lofu studio
              <span>
                <Icons.Lofu className="w-8 h-8 dark:text-neutral-400 text-neutral-600" />
              </span>
            </a>
          </p>
        </div>
      </div>

      <div className="flex-row justify-between hidden pt-4 sm:flex">
        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">
            Languages
          </p>
          {/* <hr className="w-full border border-black/10 dark:border-white/10" /> */}
          <div className="flex flex-row gap-2">
            <SiTypescript className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              TypeScript
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <FaRust className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Rust
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <AiFillHtml5 className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              HTML & CSS
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">
            Skills
          </p>
          {/* <hr className="w-full border border-black/10 dark:border-white/10" /> */}
          <div className="flex flex-row gap-2">
            <MdDesignServices className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Brand / Software Design
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <SiFigma className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Figma / Photoshop
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <AiFillCamera className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Photography
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold">
            Frameworks
          </p>
          {/* <hr className="w-full border border-black/10 dark:border-white/10" /> */}
          <div className="flex flex-row gap-2">
            <FaReact className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              React / NextJS
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <SiAstro className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Astro
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <SiSvelte className="w-6 h-6" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Svelte / SolidJS
            </p>
          </div>
        </div>
      </div>

      <div>
        <hr className="w-full my-4 border border-black/10 dark:border-white/10" />
        <p>
          I discovered Discord in 2018 and regularly used the various bots on the platform. After using them consistently, I was curious about how they worked, so I asked Google. I looked at multiple JavaScript tutorials and tried to create my bot for people to use.
          <br /><br />
          Surprisingly, I got good at it after several years of trial and error! During my journey, I made a total of 4 different bots. My first bot was called quot;Cookiequot; (later renamed Arisu), a moderator bot explicitly built for my Discord server. Next came Mimi, a music bot. And finally, Atlas, a public moderation bot.
          <br /><br />
          After a while, I ran out of ideas for new things to add to these bots. However, there was one thing that I couldn&apos;t get my mind off. Some popular bots had websites you could visit, allowing you to control the bot! Now THAT was cool, and I wanted it for myself.
          <br /><br />
          I devoted most of my time to teaching myself how to construct and design websites; however, I got bored of making bots; it didnapos;t help that Discord kept changing how they interfaced with the API. So I stopped maintaining them.
          <br /><br />
          My web development journey has only begun; Iapos;ve been self-teaching various skills, languages, and frameworks since then.
          <br /><br />
          - Ty Mason
        </p>
      </div>
    </main>
  )
}
