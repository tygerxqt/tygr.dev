import Image from "next/image";
import Link from "next/link";
import ProjectCol from "@/components/projects/col";
import { Balancer } from "react-wrap-balancer";
import { TextBlockWrapper } from "@/components/ui/text-block-wrapper";
import { Button } from "@/components/ui/button";
import { cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Icons from "@/components/icons";

export default async function Home() {
  const projects = await cms.request(readItems("projects"));

  return (
    <main className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col gap-4 px-2 py-8 max-w-[800px] w-full">
        <div className="flex flex-row gap-2 sm:gap-4">
          <div className="flex flex-row gap-2 justify-center items-start h-full max-h-[132px]">
            <div className="flex-col items-center hidden gap-1 justify-evenly sm:flex">
              <Link href="https://github.com/tygerxqt" target="_blank">
                <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px] flex items-center">
                  <Icons.Github className="w-full h-full" />
                </Button>
              </Link>
              <Link href="https://bsky.app/profile/tygr.dev" target="_blank">
                <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px]">
                  <Icons.Bluesky className="w-full h-full" />
                </Button>
              </Link>
              <Link href="https://instagram.com/tygerxqt" target="_blank">
                <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px]">
                  <Icons.Instagram className="w-full h-full" />
                </Button>
              </Link>
            </div>
            <Image width={132} height={132} className="max-h-[132px] min-w-[132px] w-full rounded-md hidden md:block" src="/profile.jpg" alt="Avatar" />
          </div>

          <div className="flex flex-col items-start">
            <small className="text-sm text-neutral-500">
              any - he/him • 17 • UK <span className="text-xs"><s>(bri ish)</s></span>
            </small>
            <p className="items-center w-full text-2xl font-bold tracking-[0.010em] sm:text-3xl font-display font">
              <Balancer>
                <span className="text-neutral-500">hello, i&apos;m ty! aka</span> tygerxqt.
                <br />
                <span className="text-neutral-500">a {" "}</span>
                full-stack {" "}
                <span className="text-neutral-500">web developer, {" "}</span>
                <br />
                <span className="text-neutral-500">and founder of {" "}</span>
                <a target="_blank" href="https://lofu.studio" className="inline-flex flex-row items-center gap-2 hover:text-neutral-800 dark:hover:text-neutral-200">
                  lofu studio
                  <span>
                    <Icons.Lofu className="w-8 h-8 dark:text-neutral-400 text-neutral-600" />
                  </span>
                </a>
              </Balancer>
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 pt-2 sm:hidden">
          <Link href="https://github.com/tygerxqt" target="_blank">
            <Button size="sm" className="flex flex-row items-center h-full gap-2 px-2 py-1 text-sm font-medium">
              <Icons.Github className="w-full h-full" /> GitHub
            </Button>
          </Link>
          <Link href="https://bsky.app/profile/tygr.dev" target="_blank">
            <Button size="sm" className="flex flex-row items-center h-full gap-2 px-2 py-1 text-sm font-medium">
              <Icons.Bluesky className="w-full h-full" />
              BlueSky
            </Button>
          </Link>
          <Link href="https://instagram.com/tygerxqt" target="_blank">
            <Button size="sm" className="flex flex-row items-center h-full gap-2 px-2 py-1 text-sm font-medium">
              <Icons.Instagram className="w-full h-full" /> Instagram
            </Button>
          </Link>
        </div>

        <div className="flex-row justify-between hidden pt-4 sm:flex">
          <div className="flex flex-col gap-3">
            <p className="text-xl font-semibold">
              Languages
            </p>
            <div className="flex flex-row gap-2">
              <Icons.Typescript className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                TypeScript
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <Icons.Rust className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Rust
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <Icons.HTML className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                HTML & CSS
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xl font-semibold">
              Skills
            </p>
            <div className="flex flex-row gap-2">
              <Icons.Design className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Brand / Software Design
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <Icons.Figma className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Figma / Photoshop
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <Icons.Camera className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Photography
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xl font-semibold">
              Frameworks
            </p>
            <div className="flex flex-row gap-2">
              <Icons.React className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                React
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <Icons.Vue className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Vue
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <Icons.Svelte className="w-6 h-6" />
              <p className="text-neutral-600 dark:text-neutral-400">
                Svelte
              </p>
            </div>
          </div>
        </div>

        <hr className="w-full my-4 border border-black/10 dark:border-white/10" />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-2 sm:justify-between sm:flex-row">
              <h2 className="text-2xl font-bold">
                Journey
              </h2>
              <small className="text-sm text-neutral-500">
                A little on how I got to where I am today.
              </small>
            </div>
            <TextBlockWrapper className="p-2 border rounded-md border-black/10 dark:border-white/10" expandButtonTitle="Read more">
              <p>
                I discovered Discord in 2018 and regularly used the various bots on the platform. After using them consistently, I was curious about how they worked, so I asked Google. I looked at multiple JavaScript tutorials and tried to create my bot for people to use.
                <br /><br />
                My first Discord bot was called &quot;Cookie&quot; (later renamed to <Link href="https://github.com/lofustudio/arisu" className="text-blue-500 dark:text-blue-400" target="_blank">Arisu</Link>), a moderator bot explicitly built for my Discord server. Next came Mimi, an experimental music bot. And finally, <Link href="https://github.com/nord-studio/atlas" target="_blank" className="text-blue-500 dark:text-blue-400">Atlas</Link>, a public moderation bot.
                <br /><br />
                After a while, I ran out of ideas for new things to add to these bots. However, there was one thing that I couldn&apos;t get my mind off. Some popular bots had websites you could visit, allowing you to control the bot! Now THAT was cool, and I wanted it for myself.
                <br /><br />
                Sooner or later, I switched my focus towards learning front-end development, and lost interest in Discord bots. After learning the basics of HTML, CSS and with my pre-existing knowledge of JavaScript, I created my <Link href="https://v1.tygr.dev/" target="_blank" className="text-blue-500 dark:text-blue-400">first website</Link>.
                <br /><br />
                However, my journey has only begun; I&apos;m currently enrolled in a Computer Science course at <Link href="https://www.eastleigh.ac.uk/" target="_blank" className="text-blue-500 dark:text-blue-400">Eastleigh College</Link> and I&apos;m constantly learning new languages, frameworks and skills.
                <br /><br /><br />
              </p>
            </TextBlockWrapper>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col items-start">
                <h2 className="text-2xl font-bold">
                  Projects
                </h2>
                <small className="text-sm text-neutral-500">
                  A few featured projects that I&apos;ve worked on!
                </small>
              </div>
              <Link href="/projects">
                <Button size="icon" className="flex flex-row items-center gap-2 w-9 h-9">
                  <Icons.LayoutGrid className="p-0" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-1 pt-2">
              {projects.slice(0, 3).map((p, i: number) => (
                <ProjectCol title={p.name} desc={p.summary} href={p.link} year={p.year} img={`${process.env.NEXT_PUBLIC_CMS_URL}/assets/${p.image}`} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div >
    </main>
  )
}
