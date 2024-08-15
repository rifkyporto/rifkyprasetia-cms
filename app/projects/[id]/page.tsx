"use server";

import React from 'react'
import { createClient } from '@/utils/supabase/server';
import Layout from '@/components/Layout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { cn } from '@/lib/utils'

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import ButtonSidebar from '@/components/project-detail/ButtonSidebar'

import Information from '@/components/project-detail/Information';
import Showcase from '@/components/project-detail/Showcase';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProjectDetail: React.FC<PageProps> = async ({ params, searchParams }) => {
  const supabase = createClient();
  const id = params.id;

  const { data: project, error } = await supabase
    .from('projects') // Adjust this to your table name
    .select('*')
    .eq("id", id)

  const type = searchParams.type;
  console.log({type, project})
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
          // <div className='flex flex-col w-full gap-5'>
          //   <div className='flex justify-between lg:max-w-2xl'>
          //     <p className='text-2xl'>Project Information</p>
          //     <div className='flex gap-3'>
          //       <Button variant={'outline'}>Cancel</Button>
          //       <Button>Save</Button>
          //     </div>
          //   </div>

          //   <hr className='lg:max-w-2xl'/>
          //   <Label className='flex flex-col gap-3'>
          //     Project Image
          //     <img
          //       src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
          //       alt="Vercel Logo"
          //       // fill
          //       // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
          //       // width={320}
          //       // height={100}
          //       // priority
          //       className="w-[300px] rounded-lg"
          //     />
          //   </Label>
          //   <Label className='flex flex-col gap-3'>
          //     Project Name
          //     <Input placeholder='Enter project name' className='lg:max-w-2xl' />
          //   </Label>
          //   <Label className='flex flex-col gap-3'>
          //     Project Type
          //     <Select>
          //       <SelectTrigger className="lg:max-w-2xl outline-none focus:shadow-outline p-2 placeholder:text-gray-400 flex">
          //         <SelectValue placeholder="Select category" />
          //       </SelectTrigger>
          //       <SelectContent>
          //         <SelectItem value="all">All</SelectItem>
          //         <SelectItem value="short-movie">Short Movie</SelectItem>
          //         <SelectItem value="music-video">Music Video</SelectItem>
          //         <SelectItem value="commercial">Commercial</SelectItem>
          //         <SelectItem value="fashion">Fashion</SelectItem>
          //         <SelectItem value="others">Others</SelectItem>
          //       </SelectContent>
          //     </Select>
          //   </Label>
          //   <Label className='flex flex-col gap-3'>
          //     Role
          //     <Input placeholder='Enter your role' className='lg:max-w-2xl' />
          //   </Label>
          //   <Label className='flex flex-col gap-3'>
          //     Client
          //     <Input placeholder='Enter your client' className='lg:max-w-2xl' />
          //   </Label>
          //   <Label className='flex flex-col gap-3'>
          //     Date Project
          //     <Input placeholder='Enter date project' className='lg:max-w-2xl' />
          //   </Label>
          //   <Label className='flex flex-col gap-3'>
          //     Link to Watch
          //     <Input placeholder='Enter the link' className='lg:max-w-2xl' />
          //   </Label>
          // </div>
          <Information project={project && project[0]} />
        )}
        {type === "showcase" && (
          <Showcase />
        )}
        
      </div>
    </Layout>
  )
}

export default ProjectDetail