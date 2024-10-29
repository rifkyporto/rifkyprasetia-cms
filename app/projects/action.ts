'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ShowcaseType } from "@/composables/showcase.types";
import { IProjectCategories } from "@/composables/project-categories.type";
import { ProjectDetailType } from "@/composables/project.types";

export async function createProject(formData: FormData) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const categoryIds = formData.get('categoryIds') as string;
  const role = formData.get('role') as string;
  const clientName = formData.get('clientName') as string;
  const month = formData.get('month') as string;
  const year = formData.get('year') as string;
  const linkTeaser = formData.get('linkTeaser') as string;
  const coverImageUrl = formData.get('coverImageUrl') as string;

  const categoryIdsParsed: string[] = JSON.parse(categoryIds);

  if (id) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        category_id: categoryId,
        role,
        client_name: clientName,
        date_month_project: `${month} ${year}`,
        link_teaser: linkTeaser,
        user_id: userId,
        cover_image_url: coverImageUrl
      })
      .eq('id', id);

      const { data: currentCategories } = await supabase
        .from('project_categories') // Adjust this to your table name
        .select(`
          *
        `)
        .eq("project_id", id)

      // @ts-ignore
      const project_categories: IProjectCategories[] = currentCategories || []
      console.log({currentCategories, project_categories, categoryIdsParsed})
      let dataToDelete = project_categories?.filter((cat) => {
        const find = categoryIdsParsed.find((parsed) => parsed === cat.category_id)
        console.log({finddelete: find})
        return Boolean(!find)
      });

      let dataToAdd = categoryIdsParsed?.filter((parsed) => {
        const find = project_categories?.find((curr) => curr.category_id === parsed)
        console.log({findAdd: find})
        return Boolean(!find)
      });

      console.log({dataToAdd, dataToDelete})

      if (dataToDelete.length) {
        await supabase
          .from('project_categories')
          .delete()
          .in('id', dataToDelete?.map((data) => data.id)) // .in() operator checks if value is in array
      }

      if (dataToAdd.length) {
        const { data, error } = await supabase
          .from('project_categories')
          .insert(dataToAdd.map((data) => {
            return { category_id: data, project_id: id, position: 0, user_id: process.env.NEXT_PUBLIC_SUPABASE_USER_ID }
          }))
          .select()
        // categoryIdsParsed.forEach( async (ids: string) => {
        //   const { data: dataPC, error: errorPc } = await supabase
        //     .from('project_categories')
        //     .insert({
        //       category_id: ids,
        //       project_id: id,
        //       position: 0,
        //     });
      }

  
      //   console.log({dataPC, error})
      // })
    console.log({data})
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        category_id: categoryId,
        role,
        client_name: clientName,
        date_month_project: `${month} ${year}`,
        link_teaser: linkTeaser,
        user_id: userId,
        cover_image_url: coverImageUrl
      })
      .select();
    console.log({created: data})
    categoryIdsParsed.forEach( async (ids: string) => {
      const { data: dataPC, error: errorPc } = await supabase
        .from('project_categories')
        .insert({
          category_id: ids,
          project_id: data?.[0].id,
          position: 0,
          user_id: process.env.NEXT_PUBLIC_SUPABASE_USER_ID
        });

      console.log({dataPC})
    })
    

    if (error) throw error;
    return data;
  }
}

export async function fetchShowcase(id: string) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const userId = session.user.id;
  console.log({session, id, userId})

  const { data, error } = await supabase
    .from('showcase_project')
    .select(`*`)
    .eq("project_id", id)
    .eq("user_id", userId)
  console.log("hhh")
  if (error) throw error;
  return data
}

export async function showcaseAction(formData: FormData) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  const id = formData.get('id') as string;
  const link = formData.get('link') as string;
  const showcaseType = formData.get('showcaseType') as string;
  const project_id = formData.get('project_id') as string;

  console.log({project_id})
  if (id) {
    const { data, error } = await supabase
      .from('showcase_project')
      .update({
        link,
        is_video: showcaseType === 'video',
        updated_at: new Date()
      })
      .eq('id', id)

    if (error) throw error;
    return data;
  } else {
    const { count } = await supabase
      .from('showcase_project')
      .select('id', { count: 'exact' })
      .eq('project_id', project_id);

    const { data, error } = await supabase
      .from('showcase_project')
      .insert({
        link,
        is_video: showcaseType === 'video',
        project_id,
        user_id: userId,
        position: count
      });

    if (error) throw error;
    return data;
  }
}

export async function upsertShowcasePosition(showcases: Partial<ShowcaseType>[]) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  showcases.forEach(async (showcase) => {
    const { data, error } = await supabase
      .from('showcase_project')
      // .upsert(showcases.map((showcase) => {
      //   return { id: showcase.id, position: showcase.position, updated_at: new Date() }
      // }))
      .update({
        position: showcase.position,
        updated_at: new Date()
      })
      .eq('id', showcase.id)
  })

  // if (error) throw error;
  // return data
}

export async function upsertAllProjectPosition(projects: Partial<ProjectDetailType>[]) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  projects.forEach(async (showcase) => {
    const { data, error } = await supabase
      .from('projects')
      // .upsert(showcases.map((showcase) => {
      //   return { id: showcase.id, position: showcase.position, updated_at: new Date() }
      // }))
      .update({
        position: showcase.position,
        updated_at: new Date()
      })
      .eq('id', showcase.id)
  })

  // if (error) throw error;
  // return data
}

export async function upsertCategoryProjectPosition(projects: Partial<IProjectCategories>[]) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  projects.forEach(async (showcase) => {
    const { data, error } = await supabase
      .from('project_categories')
      // .upsert(showcases.map((showcase) => {
      //   return { id: showcase.id, position: showcase.position, updated_at: new Date() }
      // }))
      .update({
        position: showcase.position,
        updated_at: new Date()
      })
      .eq('id', showcase.id)
  })

  // if (error) throw error;
  // return data
}
