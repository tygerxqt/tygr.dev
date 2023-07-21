import { LinkProps } from '@/types/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';
import { BsDiscord } from 'react-icons/bs';
import { FaLastfm } from 'react-icons/fa';

export default function LinkItem({ link }: { link: LinkProps }) {
  return (
    <>
      <a className="flex flex-row items-center w-full p-2 overflow-hidden rounded-md whitespace-nowrap text-ellipsis hover:bg-neutral-200 dark:hover:bg-neutral-800" target="_blank" rel="noopener noreferrer" href={link.link.rich_text[0].plain_text}>
        <p className="gap-1 font-semibold">
          {link.name.title[0].plain_text.toLowerCase().includes("youtube") ?? (
            <Youtube />
          )} {" "}
          <span className="inline-block text-sm font-normal text-neutral-500">
            {link.name.title[0].plain_text}
          </span>
        </p>
        <span className="flex flex-row items-center w-full">
          <hr className="flex-1 mx-2 border border-black/10 dark:border-white/10 min-w-[24px]" />
          <span className="hidden text-sm font-medium text-neutral-500 sm:block">
            {link.summary.rich_text[0].plain_text}
          </span>
          <span className="text-sm font-medium text-neutral-500 sm:hidden">
            {link.link.rich_text[0].plain_text.replace(/(https?:\/\/)?(www.)?/i, '').split('/')[0]}
          </span>
        </span>
      </a>
    </>
  )
}