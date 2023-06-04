import { Icons } from "@/components/icons";
import Image from "next/image";

export default function Home() {
  return (
    <main className="py-8">
      <div className="flex flex-row gap-4">
        <Image width={132} height={132} className="max-h-[132px] rounded-md hidden sm:block" src="https://secure.gravatar.com/avatar/871c2885d0acbbc08be33547816255e3?size=512" alt="Avatar" />
        <div className="flex flex-col items-start">
          <small className="text-neutral-500 text-sm">
            any - they/them • 17 • UK <span><s>(bri ish)</s></span>
          </small>
          <p className="sm:text-3xl text-2xl w-full max-w-2xl items-center font-display font-bold">
            <span className="text-neutral-500">ty mason.</span> aka tygerxqt, <span className="text-neutral-500">a professional idiot.</span> founder and head of
            design at {" "}
            <a target="_blank" href="https://nordstud.io" className="dark:text-neutral-400 text-neutral-600 inline-flex flex-row gap-3 items-center">nord studio
              <span className="pr-2">
                <Icons.Nord className="w-8 h-8" />
              </span>
            </a>
            and {" "}
            <a target="_blank" href="https://lofu.studio" className="dark:text-neutral-400 text-neutral-600 inline-flex flex-row gap-2 items-center">
              lofu studio
              <span>
                <Icons.Lofu className="w-8 h-8" />
              </span>
            </a>
          </p>
        </div>
      </div>
      <div className="pt-8">
        <h3 className="font-display text-2xl font-bold pb-2">
          ~/about
        </h3>
        <p>
          I discovered Discord in 2018, and not long after, I kept using the various bots on the platform. It was only a short time until I tried it and got pretty good at it! During my journey, I made a total of 4 different bots.
          <br /> <br />

          My first bot was called &quot;Cookie&quot; (later renamed Arisu), a moderator bot explicitly built for my Discord server. Next came Mimi, the music bot. Then Atlas, and finally, Citra. During this journey, I learned various skills and languages, but most importantly, I started to teach myself how to make a website.
          <br /> <br />
          Initially, it was for my Discord bots so they could have a dashboard like the cool kids; however, I got bored of making bots; it didn&apos;t help that Discord kept changing the way they interfaced with the API too. So I stopped maintaining them.
          <br /> <br />
          However, my web development journey has only just begun.
          <br /> <br />
          - Ty Mason
        </p>
      </div>
    </main>
  )
}
