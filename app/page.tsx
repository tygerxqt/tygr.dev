import { Icons } from "@/components/icons";
import Image from "next/image";
import { FaReact, FaRust, FaTwitter } from "react-icons/fa";
import { SiAstro, SiFigma, SiSvelte, SiTypescript } from "react-icons/si";
import { AiFillCamera, AiFillGithub, AiFillHtml5, AiFillInstagram } from "react-icons/ai";
import { LayoutGrid } from "lucide-react"
import { MdDesignServices } from "react-icons/md";
import { Balancer } from "react-wrap-balancer";
import { TextBlockWrapper } from "@/components/ui/text-block-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectCol from "@/components/project-col";
import { notion } from "@/lib/notion";
import { Project } from "@/types/project";

async function getProjects() {
  const projects: any = await notion.databases.query({
    database_id: process.env.NOTION_PROJECTS_DATABASE_ID as string
  });

  let all: Project[] = projects.results.map((p: any) => p.properties);
  all = all.filter((p: Project) => p.private.checkbox.valueOf() === false);

  let res: Project[] = all.slice(0, 3);

  return res;
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="flex flex-col gap-4 px-2 py-8">
      <div className="flex flex-row sm:gap-4">
        <div className="flex flex-row gap-2 justify-center items-start h-full max-h-[132px]">
          <div className="flex-col items-center hidden gap-1 justify-evenly sm:flex">
            <Link href="https://github.com/tygerxqt" target="_blank">
              <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px] flex items-center">
                <AiFillGithub className="w-full h-full" />
              </Button>
            </Link>
            <Link href="https://twitter.com/tygerxqt" target="_blank">
              <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px]">
                <FaTwitter fill="currentColor" className="w-full h-full" />
              </Button>
            </Link>
            <Link href="https://instagram.com/tygerxqt" target="_blank">
              <Button size={"icon"} className="px-2 py-1 h-[40px] w-[40px]">
                <AiFillInstagram className="w-full h-full" />
              </Button>
            </Link>
          </div>
          <Image width={132} height={132} className="max-h-[132px] rounded-md hidden sm:block" src="https://secure.gravatar.com/avatar/871c2885d0acbbc08be33547816255e3?size=512" alt="Avatar" />
        </div>

        <div className="flex flex-col items-start">
          <Balancer>
            <small className="text-sm text-neutral-500">
              any - they/them • 17 • UK <span><s>(bri ish)</s></span>
            </small>
            <p className="items-center w-full max-w-2xl text-2xl font-bold sm:text-3xl font-display">
              <span className="text-neutral-500">ty mason.</span> aka tygerxqt, <span className="text-neutral-500">a professional idiot.</span> founder
              {/* <span className="dark:text-neutral-400 text-neutral-600">{" "} & {" "}</span> */}
              {/* head of design */}
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
        <Link href="https://twitter.com/tygerxqt" target="_blank">
          <Button size={"icon"} className="flex flex-row items-center h-full gap-2 px-2 py-1 text-sm font-medium">
            <FaTwitter fill="currentColor" /> Twitter
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
            <ProjectCol title={projects[0].name.title[0].plain_text} desc={projects[0].summary.rich_text[0].plain_text} year={projects[0].year.number} href={projects[0].link.url} />
            <ProjectCol title={projects[1].name.title[0].plain_text} desc={projects[1].summary.rich_text[0].plain_text} year={projects[1].year.number} href={projects[1].link.url} />
            <ProjectCol title={projects[2].name.title[0].plain_text} desc={projects[2].summary.rich_text[0].plain_text} year={projects[2].year.number} href={projects[2].link.url} />
          </div>
        </div>
      </div>
    </main>
  )
}
