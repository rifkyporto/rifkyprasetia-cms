'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function categoryAction(formData: FormData) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;

  if (slug) {
    const { data: checkSlug } = await supabase
      .from('category')
      .select(`
        id,
        slug
      `)
      .eq("slug", slug)

    if (id && checkSlug && id !== checkSlug[0].id) {
      throw new Error('Slug already exists');
    } else if (!id && checkSlug) {
      throw new Error('Slug already exists');
    }
  }

  if (id) {
    const { data, error } = await supabase
      .from('category')
      .update({
        name, slug: slug
      })
      .eq('id', id);

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
    .from('category')
    .insert({
      name,
      ...(slug ? { slug } : { slug: name.toLowerCase().replace(/ /g, '-')}),
      user_id: userId,
    });

    if (error) throw error;
    return data;
  }
}
