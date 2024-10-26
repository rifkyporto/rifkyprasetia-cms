"use server";
import { createClient } from "@/utils/supabase/server"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react";
import Link from 'next/link';
import ReorderAllProjects from "@/components/reorder-project";

const Projects = async ({ searchParams }: { searchParams: { search?: string, type?: string } }) => {
  const searchQuery = searchParams.search || "";
  const typeQuery = searchParams.type || "";
  console.log({typeQuery})
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from('projects') // Adjust this to your table name
    .select('*')
    .ilike("title", `%${searchQuery}%`)
    .ilike("category_id", `%${typeQuery}%`)
  console.log({projects})
  return (
    <>
      <div className="w-full flex flex-col gap-5 my-10 relative">
        <div className="w-[50%] mx-auto flex justify-center items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl text-center">Reorder Projects</h2>
            <p className="text-sm text-gray-600">Drag and drop to reorder all of this project, to show it in ALL public menu.</p>
          </div>
        </div>
        <hr className="w-full" />
        <div className="absolute left-20 top-5">
          <Link href={'/'}>
            <Button variant={"outline"} className="flex gap-1 text-sm">
              <Icon icon="ion:arrow-back-outline" />
              Back
            </Button>
          </Link>
        </div>
      </div>
      
      <ReorderAllProjects projects={projects!} />
    </>
  )
}

export default Projects