"use server";
import { createClient } from "@/utils/supabase/server"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react";
import Link from 'next/link';
import ModalCreateProject from './modals/ModalCreateProject';
import SearchInput from "./SearchInputProject";
import FilterCategoryDropdown from "./FilterCategoryDropdown";

const Projects = async ({ searchParams }: { searchParams: { search?: string, type?: string } }) => {
  const searchQuery = searchParams.search || "";
  const typeQuery = searchParams.type || "";
  console.log({typeQuery})
  const supabase = createClient();
  // const { data: projects, error } = await supabase
  //   .from('projects')
  //   .select('*')
  //   .ilike("title", `%${searchQuery}%`)
  //   .ilike("category_id", `%${typeQuery}%`)

  const { data: projects, error } = await supabase
    .from('project_categories')
    .select(`
      *,
      projects (*)
    `)
    .ilike("projects.title", `%${searchQuery}%`)
    .ilike("category_id", `%${typeQuery}%`)
  console.log({projects})

  const allProjects = projects?.map((project) => {
    return project.projects;
  }).sort((a, b) => a.position - b.position)
  console.log({allProjects})

  const { data: categories, error: errorCategories } = await supabase
    .from('category')
    .select(`
      *
    `)
    .eq("user_id", process.env.NEXT_PUBLIC_SUPABASE_USER_ID)
  console.log({projects})

  return (
    <>
      <div className="flex flex-col gap-5 my-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl">All Projects</h2>
            <p className="text-sm text-gray-600">Manage your project here.</p>
          </div>
          <div className="flex gap-3">
            <FilterCategoryDropdown />
            <ModalCreateProject categories={categories!} />
            <Link href={'/projects'}>
              <Button variant={'default'} className="flex gap-1"><Icon icon="rivet-icons:settings" /> Reorder Project</Button>
            </Link>
          </div>
        </div>
        <hr className="w-full" />
      </div>
      <SearchInput />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-5">
        {allProjects?.sort((a, b) => a.position! - b.position!)?.map((project: any) => {
          return (
            <Link href={`/projects/${project.id}`} className="flex flex-col gap-2 w-full">
              <img
                src={project?.cover_image_url || "https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"}
                alt="Vercel Logo"
                width={320}
                height={100}
                className="w-full rounded-lg object-cover h-[250px]"
              />
              <div className="flex justify-between items-start">
                <div className="flex flex-col pl-1">
                  <p className="text-xl">{project?.title}</p>
                  <p className="text-gray-500 text-sm font-light">{project.role}, {project.date_month_project}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Projects