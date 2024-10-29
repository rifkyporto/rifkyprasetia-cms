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
import CreateProject from '@/components/project-detail/create-project';
import Information from '@/components/project-detail/Information';
import Showcase from '@/components/project-detail/Showcase';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export const dynamic = "force-dynamic";

const ProjectDetail: React.FC<PageProps> = async ({ searchParams }) => {
  const supabase = createClient();

  const { data: categories, error: errorCategories } = await supabase
    .from('category') // Adjust this to your table name
    .select('*')
    // .eq("user_id", process.env.NEXT_PUBLIC_SUPABASE_USER_ID)
  console.log({categories})
  const type = searchParams.type;
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
              <BreadcrumbLink href="/projects/create">Create Project</BreadcrumbLink>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex flex-col gap-2 my-5'>
        <p className='text-3xl'>Create Project</p>
        <hr />
      </div>
      
      <div className='my-10 flex gap-10'>
        {/* <div className='w-[300px] flex flex-col gap-2'>
          <nav
            className={cn(
              "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
            )}
          >
            {sidebarNavItems.map((item) => (
              <ButtonSidebar
                queryType={item.queryType}
                title={item.title}
              />
            ))}
          </nav>
        </div> */}

        <CreateProject categories={categories} />
        {/* {type === "showcase" && (
          <Showcase id={id} />
        )} */}
        
      </div>
    </Layout>
  )
}

export default ProjectDetail