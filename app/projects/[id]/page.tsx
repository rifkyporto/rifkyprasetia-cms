import React from 'react'
import dynamic from 'next/dynamic';
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
const Information = dynamic(() => import("@/components/project-detail/Information"), { ssr: false });

// import Information from '@/components/project-detail/Information';
import Showcase from '@/components/project-detail/Showcase';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// export const dynamic = "force-dynamic";
export const revalidate = 0
const ProjectDetail: React.FC<PageProps> = async ({ params, searchParams }) => {
  const supabase = createClient();
  const id = params.id;

  const { data: project, error } = await supabase
    .from('projects') // Adjust this to your table name
    .select(`
      *,
      project_categories (
        *,
        category (*)
      )
    `)
    .eq("id", id)

  const { data: categories, error: errorCategories } = await supabase
    .from('category') // Adjust this to your table name
    .select('*')
    // .eq("user_id", process.env.NEXT_PUBLIC_SUPABASE_USER_ID)
  console.log({categories})
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
              <BreadcrumbLink href="/projects/hehe">{project?.[0]?.title}</BreadcrumbLink>
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
          <Information id={id} project={project && project[0]} categories={categories} />
        )}
        {type === "showcase" && (
          <Showcase id={id} />
        )}
        
      </div>
    </Layout>
  )
}

export default ProjectDetail