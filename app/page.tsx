import { Icons } from "@/components/icons";
import Image from "next/image";
import { FaCloud, FaReact, FaRust, FaTwitter } from "react-icons/fa";
import { SiAstro, SiFigma, SiSvelte, SiTypescript } from "react-icons/si";
import { AiFillCamera, AiFillGithub, AiFillHtml5, AiFillInstagram } from "react-icons/ai";
import { LayoutGrid } from "lucide-react"
import { MdDesignServices } from "react-icons/md";
import { Balancer } from "react-wrap-balancer";
import { TextBlockWrapper } from "@/components/ui/text-block-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectCol from "@/components/projects/col";
import { cms } from "@/lib/directus";
import { readItems } from "@directus/sdk";

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
                  <AiFillGithub className="w-full h-full" />
                </Button>
              </Link>
              <Link href="https://bsky.app/profile/tygr.dev" target="_blank">
                <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px]">
                  <svg width="1em" height="1em" viewBox="0 0 360 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="currentColor">
                    <path d="M254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158Z"></path>
                    <path d="M180 141.964C163.699 110.262 119.308 51.1817 78.0347 22.044C38.4971 -5.86834 23.414 -1.03207 13.526 3.43594C2.08093 8.60755 0 26.1785 0 36.5164C0 46.8542 5.66748 121.272 9.36416 133.694C21.5786 174.738 65.0603 188.607 105.104 184.156C107.151 183.852 109.227 183.572 111.329 183.312C109.267 183.642 107.19 183.924 105.104 184.156C46.4204 192.847 -5.69621 214.233 62.6582 290.33C137.848 368.18 165.705 273.637 180 225.702C194.295 273.637 210.76 364.771 295.995 290.33C360 225.702 313.58 192.85 254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158C294.94 188.61 338.421 174.74 350.636 133.697C354.333 121.275 360 46.8568 360 36.519C360 26.1811 357.919 8.61012 346.474 3.43851C336.586 -1.02949 321.503 -5.86576 281.965 22.0466C240.692 51.1843 196.301 110.262 180 141.964Z"></path>
                  </svg>
                </Button>
              </Link>
              <Link href="https://instagram.com/tygerxqt" target="_blank">
                <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px]">
                  <AiFillInstagram className="w-full h-full" />
                </Button>
              </Link>
            </div>
            <Image width={132} height={132} className="max-h-[132px] min-w-[132px] w-full rounded-md hidden sm:block" src="https://secure.gravatar.com/avatar/871c2885d0acbbc08be33547816255e3?size=512" alt="Avatar" />
          </div>

          <div className="flex flex-col items-start">
            <Balancer>
              <small className="text-sm text-neutral-500">
                any - they/them • 17 • UK <span><s>(bri ish)</s></span>
              </small>
              <p className="items-center w-full text-2xl font-bold sm:text-3xl font-display">
                <span className="text-neutral-500">ty mason.</span> aka tygerxqt, <span className="text-neutral-500">a professional idiot.</span> founder
                <span className="dark:text-neutral-400 text-neutral-600">{" "} of {" "}</span>
                <a target="_blank" href="https://nordstud.io" className="inline-flex flex-row items-center gap-3 hover:text-neutral-800 dark:hover:text-neutral-200">nord studio
                  <span className="pr-1 dark:text-neutral-400 text-neutral-600">
                    <Icons.Nord className="w-8 h-8" />
                  </span>
                </a>
                <span className="dark:text-neutral-400 text-neutral-600"> and {" "}</span>
                <a target="_blank" href="https://lofu.studio" className="inline-flex flex-row items-center gap-2 hover:text-neutral-800 dark:hover:text-neutral-200">
                  lofu studio
                  <span>
                    <Icons.Lofu className="w-8 h-8 dark:text-neutral-400 text-neutral-600" />
                  </span>
                </a>
              </p>
            </Balancer>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 pt-2 sm:hidden">
          <Link href="https://github.com/tygerxqt" target="_blank">
            <Button size={"icon"} className="flex flex-row items-center h-full gap-2 px-2 py-1 text-sm font-medium">
              <AiFillGithub /> GitHub
            </Button>
          </Link>
          <Link href="https://bsky.app/profile/tygr.dev" target="_blank">
            <Button size={"icon"} className="flex flex-row items-center h-full gap-2 px-2 py-1 text-sm font-medium">
              <svg width="1em" height="1em" viewBox="0 0 360 320" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158Z"></path>
                <path d="M180 141.964C163.699 110.262 119.308 51.1817 78.0347 22.044C38.4971 -5.86834 23.414 -1.03207 13.526 3.43594C2.08093 8.60755 0 26.1785 0 36.5164C0 46.8542 5.66748 121.272 9.36416 133.694C21.5786 174.738 65.0603 188.607 105.104 184.156C107.151 183.852 109.227 183.572 111.329 183.312C109.267 183.642 107.19 183.924 105.104 184.156C46.4204 192.847 -5.69621 214.233 62.6582 290.33C137.848 368.18 165.705 273.637 180 225.702C194.295 273.637 210.76 364.771 295.995 290.33C360 225.702 313.58 192.85 254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158C294.94 188.61 338.421 174.74 350.636 133.697C354.333 121.275 360 46.8568 360 36.519C360 26.1811 357.919 8.61012 346.474 3.43851C336.586 -1.02949 321.503 -5.86576 281.965 22.0466C240.692 51.1843 196.301 110.262 180 141.964Z"></path>
              </svg>
              BlueSky
            </Button>
          </Link>
          <Link href="https://instagram.com/tygerxqt" target="_blank">
            <Button size={"icon"} className="flex flex-row items-center h-full gap-2 px-2 py-1 text-sm font-medium">
              <AiFillInstagram /> Instagram
            </Button>
          </Link>
        </div>

        <div className="flex-row justify-between hidden pt-4 sm:flex">
          <div className="flex flex-col gap-3">
            <p className="text-xl font-semibold">
              Languages
            </p>
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

        <hr className="w-full my-4 border border-black/10 dark:border-white/10" />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-2 sm:justify-between sm:flex-row">
              <h2 className="text-2xl font-bold">
                ~/journey.txt
              </h2>
              <small className="text-sm text-neutral-500">
                A little on how I got to where I am today.
              </small>
            </div>
            <TextBlockWrapper className="p-2 border rounded-md border-black/10 dark:border-white/10" expandButtonTitle="Read more">
              <p>
                I discovered Discord in 2018 and regularly used the various bots on the platform. After using them consistently, I was curious about how they worked, so I asked Google. I looked at multiple JavaScript tutorials and tried to create my bot for people to use.
                <br /><br />
                Surprisingly, I got good at it after several years of trial and error! During my journey, I made a total of 4 different bots. My first bot was called &quot;Cookie&quot; (later renamed Arisu), a moderator bot explicitly built for my Discord server. Next came Mimi, a music bot. And finally, Atlas, a public moderation bot.
                <br /><br />
                After a while, I ran out of ideas for new things to add to these bots. However, there was one thing that I couldn&apos;t get my mind off. Some popular bots had websites you could visit, allowing you to control the bot! Now THAT was cool, and I wanted it for myself.
                <br /><br />
                I devoted most of my time to teaching myself how to construct and design websites; however, I got bored of making bots; it didn&apos;t help that Discord kept changing how they interfaced with the API. So I stopped maintaining them.
                <br /><br />
                My web development journey has only begun; I&apos;ve been self-teaching various skills, languages, and frameworks since then.
                <br /><br />
              </p>
            </TextBlockWrapper>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col items-start">
                <h2 className="text-2xl font-bold">
                  ~/projects.json
                </h2>
                <small className="text-sm text-neutral-500">
                  A few featured projects that I&apos;ve worked on!
                </small>
              </div>
              <Link href="/projects">
                <Button size="icon" className="flex flex-row items-center gap-2 w-9 h-9">
                  <LayoutGrid className="p-0" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-2">
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
