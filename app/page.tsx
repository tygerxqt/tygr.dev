import { AiFillGithub, AiOutlineTwitter, AiFillMail } from "react-icons/ai";
import { ArrowRight, LayoutGrid, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full px-3 my-32 sm:gap-6 md:gap-4 lg:gap-2 sm:px-6">
        <div className="flex flex-col items-center max-w-[1400px] w-full justify-center md:justify-between gap-4 md:gap-6 lg:gap-8 text-center sm:text-left sm:flex-row xs:gap-2">
          <div className="flex flex-col items-center justify-center gap-6 sm:items-start sm:justify-start">
            <div className="flex flex-col gap-2">
              <small className="text-lg translate-y-2 xl:text-lg text-primary-500">
                tygerxqt • they/him
              </small>
              <h1 className="text-4xl font-black sm:text-5xl md:text-6xl lg:text-6xl">
                A professional idiot.
              </h1>
              <p className="font-semibold text-md sm:text-lg md:text-xl lg:text-2xl text-primary-400">
                Founder of Nord Studio & Lofu Studio.
              </p>
            </div>
            <div className="flex flex-row items-center justify-center w-full gap-4 sm:justify-start sm:items-start sm:flex-row">
              <Link href="https://github.com/tygerxqt">
                <Button theme="primary" size="sm" className="flex flex-row items-center">
                  <AiFillGithub className="w-4 h-4 mr-2" />
                  Github
                </Button>
              </Link>
              <Link href="https://twitter.com/tygerxqt">
                <Button theme="primary" size="sm" className="flex flex-row items-center">
                  <AiOutlineTwitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              </Link>
              <Link href="mailto:hi@tygr.dev">
                <Button theme="primary" size="sm" className="flex flex-row items-center">
                  <AiFillMail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </Link>
            </div>
          </div>
          <Image alt="Logo" src={"https://secure.gravatar.com/avatar/871c2885d0acbbc08be33547816255e3?size=448"} width={448} height={0} priority className="hidden w-48 h-48 border rounded-full sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 xl:w-fit xl:h-fit border-black/10 dark:border-white/10 md:block" />
        </div>

        <div className="flex flex-col items-center max-w-[1400px] w-full gap-8 pt-32">
          <div className="flex flex-col items-start w-full gap-2 sm:gap-0">
            <div className="flex flex-row items-start justify-between w-full">
              <h2 className="text-3xl font-bold">
                ~/projects
              </h2>
              <Link href="/projects">
                <Button className="flex-row items-center hidden sm:flex" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button className="flex flex-row items-center sm:hidden" size="icon">
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <p className="text-left text-primary-500">
              A few featured projects that I&apos;ve worked on or am currently working on.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col w-full border rounded-md bg-primary-200/50 dark:bg-primary-700/50 border-black/10 dark:border-white/10">
              <Image src="/assets/projects/tygr-dev.jpg" alt="project image" width={1200} height={0} className="object-cover w-full h-48 rounded-t-md" />
              <div className="px-4 py-2">
                <div className="flex flex-row items-center justify-between w-full ">
                  <p className="text-2xl font-semibold">
                    tygr.dev
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    4
                    <Star className="w-4 h-4" fill="white" />
                  </div>
                </div>
                <p className="text-primary-500 dark:text-primary-100/50">
                  My personal website. Hosted on Vercel.
                </p>
              </div>
            </div>

            <div className="flex flex-col w-full border rounded-md bg-primary-200/50 dark:bg-primary-700/50 border-black/10 dark:border-white/10">
              <Image src="/assets/projects/nordstud-io.jpg" alt="project image" width={1200} height={0} className="object-cover w-full h-48 rounded-t-md" />
              <div className="px-4 py-2">
                <div className="flex flex-row items-center justify-between w-full ">
                  <p className="text-2xl font-semibold">
                    nordstud.io
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    4
                    <Star className="w-4 h-4" fill="white" />
                  </div>
                </div>
                <p className="text-primary-500 dark:text-primary-100/50">
                  The website for my software studio, Nord Studio.
                </p>
              </div>
            </div>

            <div className="flex flex-col w-full border rounded-md bg-primary-200/50 dark:bg-primary-700/50 border-black/10 dark:border-white/10">
              <Image src="/assets/projects/nyan-coffee.jpg" alt="project image" width={1200} height={0} className="object-cover w-full h-48 rounded-t-md" />
              <div className="px-4 py-2">
                <div className="flex flex-row items-center justify-between w-full ">
                  <p className="text-2xl font-semibold">
                    nyan.coffee
                  </p>
                  <div className="flex flex-row items-center gap-1">
                    2
                    <Star className="w-4 h-4" fill="white" />
                  </div>
                </div>
                <p className="text-primary-500 dark:text-primary-100/50">
                  A static site for my friend, NyanSpaghet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
