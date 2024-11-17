'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePage } from "@/lib/utils-server";

export async function socialAction(formData: FormData) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const userId = session.user.id;

  const id = formData.get('id') as string;
  const socialKey = formData.get('key') as string;
  const link = formData.get('link') as string;
  const username = formData.get('username') as string;

  console.log({socialKey, userId})
  const { data: checkKey } = await supabase
    .from('social')
    .select(`
      id,
      key
    `)
    .eq("key", socialKey)
    .eq("user_id", userId)
      
    console.log({checkKey})
    if (id && checkKey && id !== checkKey[0].id) {
    throw new Error('Social already exists');
  } else if (!id && checkKey?.length) {
    throw new Error('Social already exists');
  }


  if (id) {
    const { data, error } = await supabase
      .from('social')
      .update({
        key: socialKey, link, username
      })
      .eq('id', id);

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
    .from('social')
    .insert({
      key: socialKey,
      link: link,
      user_id: userId,
      username
    });

    if (error) throw error;

    await revalidatePage(`/`);
    await revalidatePage(`/contact`);

    const { data: projects, error: errorProjects } = await supabase
      .from('projects')
      .select("id")

    const { data: categories, error: errorCategories } = await supabase
      .from('category')
      .select("slug")

    if (projects?.length) {
      projects?.forEach( async (project) => {
        await revalidatePage(`/${project?.id}`);
      })
    }

    if (categories?.length) {
      categories.forEach(async (slugs) => {
        await revalidatePage(`/${slugs?.slug}`);
      })
    }

    return data;
  }
}
