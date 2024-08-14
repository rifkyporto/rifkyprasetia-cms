'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function createProject(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;


  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const role = formData.get('role') as string;
  const clientName = formData.get('clientName') as string;
  const month = formData.get('month') as string;
  const year = formData.get('year') as string;
  const linkTeaser = formData.get('linkTeaser') as string;

  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      category_id: categoryId,
      role,
      client_name: clientName,
      date_month_project: `${month} ${year}`,
      link_teaser: linkTeaser,
      user_id: userId
    });

  if (error) throw error;
  return data;
}
