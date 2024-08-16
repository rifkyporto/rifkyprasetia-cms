'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

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
