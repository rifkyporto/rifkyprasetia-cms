'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ShowcaseType } from "@/composables/showcase.types";

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
  const role = formData.get('role') as string;
  const clientName = formData.get('clientName') as string;
  const month = formData.get('month') as string;
  const year = formData.get('year') as string;
  const linkTeaser = formData.get('linkTeaser') as string;
  const coverImageUrl = formData.get('coverImageUrl') as string;

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
      .eq('id', id)

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
      });

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
