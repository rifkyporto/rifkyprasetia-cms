import React from 'react'
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import ModalCreateProject from './modals/ModalCreateProject';
const Projects = () => {
  return (
    <>
      <div className="flex flex-col gap-5 my-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl">All Projects</h2>
            <p className="text-sm text-gray-600">Manage your project here.</p>
          </div>
          <div className="flex gap-3">
            <Select>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="short-movie">Short Movie</SelectItem>
                <SelectItem value="music-video">Music Video</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <ModalCreateProject />
          </div>
        </div>
        <hr className="w-full" />
      </div>
      <Input className="mb-5 focus:border-0" placeholder="Search project by name" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-5">
        <Link href="/projects/jeder" className="flex flex-col gap-2 w-full">
          <img
            src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
            alt="Vercel Logo"
            // fill
            // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
            // width={320}
            // height={100}
            // priority
            className="w-full rounded-lg"
          />
          <div className="flex justify-between items-start">
            <div className="flex flex-col pl-1">
              <p className="text-xl">#Jembatan by Chandra Liow</p>
              <p className="text-gray-500 text-sm font-light">Short Film, July 2024</p>
            </div>
            <Icon icon="mage:dots" className="text-xl mt-1" />
          </div>
        </Link>
        <div className="flex flex-col gap-2 w-full">
          <img
            src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
            alt="Vercel Logo"
            // fill
            // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
            // width={320}
            // height={100}
            // priority
            className="w-full rounded-lg"
          />
          <div className="flex justify-between items-start">
            <div className="flex flex-col pl-1">
              <p className="text-xl">#Jembatan by Chandra Liow</p>
              <p className="text-gray-500 text-sm font-light">Short Film, July 2024</p>
            </div>
            <Icon icon="mage:dots" className="text-xl mt-1" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <img
            src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
            alt="Vercel Logo"
            // fill
            // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
            // width={320}
            // height={100}
            // priority
            className="w-full rounded-lg"
          />
          <div className="flex justify-between items-start">
            <div className="flex flex-col pl-1">
              <p className="text-xl">#Jembatan by Chandra Liow</p>
              <p className="text-gray-500 text-sm font-light">Short Film, July 2024</p>
            </div>
            <Icon icon="mage:dots" className="text-xl mt-1" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <img
            src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
            alt="Vercel Logo"
            // fill
            // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
            // width={320}
            // height={100}
            // priority
            className="w-full rounded-lg"
          />
          <div className="flex justify-between items-start">
            <div className="flex flex-col pl-1">
              <p className="text-xl">#Jembatan by Chandra Liow</p>
              <p className="text-gray-500 text-sm font-light">Short Film, July 2024</p>
            </div>
            <Icon icon="mage:dots" className="text-xl mt-1" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <img
            src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
            alt="Vercel Logo"
            // fill
            // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
            // width={320}
            // height={100}
            // priority
            className="w-full rounded-lg"
          />
          <div className="flex justify-between items-start">
            <div className="flex flex-col pl-1">
              <p className="text-xl">#Jembatan by Chandra Liow</p>
              <p className="text-gray-500 text-sm font-light">Short Film, July 2024</p>
            </div>
            <Icon icon="mage:dots" className="text-xl mt-1" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Projects