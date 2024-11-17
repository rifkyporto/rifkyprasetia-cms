'use server'

import { CategoryDropdownType } from "@/composables/category.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePage } from "@/lib/utils-server";
import { cookies } from "next/headers";

export async function categoryAction(formData: FormData, isEdit: boolean) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  // const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;

  // if (slug) {
  //   const { data: checkSlug } = await supabase
  //     .from('category')
  //     .select(`
  //       slug
  //     `)
  //     .eq("slug", slug)
  //     .eq("user_id", userId)

  //   if (checkSlug) {
  //     throw new Error('Slug already exists');
  //   }
  // }

  if (isEdit) {
    const { data, error } = await supabase
      .from('category')
      .update({
        name,
        updated_at: new Date()
      })
      .eq('slug', slug).select()
      .select("slug")
    console.log({data})
    if (error) throw error;

    await revalidatePage(`/${slug}`);

    data?.forEach( async (slugs) => {
      await revalidatePage(`/${slugs?.slug}`);
    })
    
    await revalidatePage(`/contact`);
    await revalidatePage(`/`);
    
    const { data: projects, error: errorProjects } = await supabase
      .from('projects')
      .select("id")

    if (projects?.length) {
      projects.forEach(async (project) => {
        await revalidatePage(`/projects/${project?.id}`);
      })
    }

    return data;
  } else {
    const { data, error } = await supabase
    .from('category')
    .insert({
      name,
      ...(slug ? { slug } : { slug: name.toLowerCase().replace(/ /g, '-')}),
      user_id: userId,
    })
    .select("slug");

    if (error) throw error;

    await revalidatePage(`/${slug}`);

    data?.forEach( async (slugs) => {
      await revalidatePage(`/${slugs?.slug}`);
    })

    await revalidatePage(`/contact`);
    await revalidatePage(`/`);

    const { data: projects, error: errorProjects } = await supabase
      .from('projects')
      .select("id")

    if (projects?.length) {
      projects.forEach(async (project) => {
        await revalidatePage(`/projects/${project?.id}`);
      })
    }

    return data;
  }
}

export async function upsertCategoryPosition(categories: Partial<CategoryDropdownType>[]) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  categories.forEach(async (category) => {
    const { data, error } = await supabase
      .from('category')
      .update({
        position: category.position,
        updated_at: new Date()
      })
      .eq('slug', category.slug)

    await revalidatePage(`/${category?.slug}`);
  })

  await revalidatePage(`/`);
  await revalidatePage(`/contact`);

  const { data: projects, error: errorProjects } = await supabase
    .from('projects')
    .select("id")

  if (projects?.length) {
    projects.forEach(async (project) => {
      await revalidatePage(`/projects/${project?.id}`);
    })
  }
}
