import React from 'react'
import Layout from '@/components/Layout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { redirect } from "next/navigation"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import ButtonSidebar from '@/components/project-detail/ButtonSidebar'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProjectDetail: React.FC<PageProps> = ({ searchParams }) => {
  const type = searchParams.type; // Access the query parameter
  console.log({type})
  const sidebarNavItems = [
    {
      title: "Information",
      queryType: "information",
    },
    {
      title: "Showcase",
      queryType: "showcase",
    },
  ]

  const pushQueryParam = () => {
    // "use client";

    // const router = useRouter()
    redirect(`/projects/jeder?type=hoho`)
  }

  return (
    <Layout className="w-full flex flex-col gap-10 px-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <BreadcrumbLink href="/projects/hehe">#Jembatan by chandra</BreadcrumbLink>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex flex-col gap-2 my-5'>
        <p className='text-3xl'>Project Detail</p>
        <hr />
      </div>
      
      <div className='my-10 flex gap-10'>
        <div className='w-[300px] flex flex-col gap-2'>
          {/* <img
            src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
            alt="Vercel Logo"
            // fill
            // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
            // width={320}
            // height={100}
            // priority
            className="w-full rounded-lg"
          />
          <p className='text-3xl'>#Jembatan by Chandra Liow</p> */}

          <nav
            className={cn(
              "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
              // className
            )}
            // {...props}
          >
            {sidebarNavItems.map((item) => (
              <ButtonSidebar
                queryType={item.queryType}
                title={item.title}
              />
            ))}
          </nav>
        </div>
        {(!type || type === "information") && (
          <div className='flex flex-col w-full gap-5'>
            <p className='text-2xl'>Project Information</p>
            <hr className='lg:max-w-2xl'/>
            <Label className='flex flex-col gap-3'>
              Project Image
              <img
                src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
                alt="Vercel Logo"
                // fill
                // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
                // width={320}
                // height={100}
                // priority
                className="w-[300px] rounded-lg"
              />
            </Label>
            <Label className='flex flex-col gap-3'>
              Project Name
              <Input placeholder='Enter project name' className='lg:max-w-2xl' />
            </Label>
            <Label className='flex flex-col gap-3'>
              Project Type
              <Select>
                <SelectTrigger className="lg:max-w-2xl outline-none focus:shadow-outline p-2 placeholder:text-gray-400 flex">
                  <SelectValue placeholder="Select category" />
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
            </Label>
            <Label className='flex flex-col gap-3'>
              Role
              <Input placeholder='Enter your role' className='lg:max-w-2xl' />
            </Label>
            <Label className='flex flex-col gap-3'>
              Client
              <Input placeholder='Enter your client' className='lg:max-w-2xl' />
            </Label>
            <Label className='flex flex-col gap-3'>
              Date Project
              <Input placeholder='Enter date project' className='lg:max-w-2xl' />
            </Label>
            <Label className='flex flex-col gap-3'>
              Link to Watch
              <Input placeholder='Enter the link' className='lg:max-w-2xl' />
            </Label>
          </div>
        )}
        {type === "showcase" && (
          <div className='flex flex-col w-full gap-5'>
            <p className='text-2xl'>Project Showcase</p>
            <hr className='lg:max-w-2xl'/>
            <Label className='flex flex-col gap-3'>
              Link Video
              <Input placeholder='Enter your link video of your project' className='lg:max-w-2xl' />
            </Label>
            
            <Label className='flex flex-col gap-3'>
              Photos
              <img
                src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
                alt="Vercel Logo"
                // fill
                // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
                // width={320}
                // height={100}
                // priority
                className="lg:max-w-2xl rounded-lg"
              />
              <img
                src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
                alt="Vercel Logo"
                // fill
                // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
                // width={320}
                // height={100}
                // priority
                className="lg:max-w-2xl rounded-lg"
              />
              <img
                src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
                alt="Vercel Logo"
                // fill
                // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
                // width={320}
                // height={100}
                // priority
                className="lg:max-w-2xl rounded-lg"
              />
            </Label>
          </div>
        )}
        
      </div>
    </Layout>
  )
}

export default ProjectDetail