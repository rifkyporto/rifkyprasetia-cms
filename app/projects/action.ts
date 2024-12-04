'use server'

import { createClient } from "@/utils/supabase/server";
import { utapi } from "@/server/uploadthing";
import { cookies } from "next/headers";
import { ShowcaseType } from "@/composables/showcase.types";
import { IProjectCategories } from "@/composables/project-categories.type";
import { ProjectDetailType } from "@/composables/project.types";
import { handleFileDelete, revalidatePage } from "@/lib/utils-server";
import { getYoutubeEmbedUrl } from '@/lib/utils';


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
  const slug = formData.get('slug') as string;
  // const categoryId = formData.get('categoryId') as string;
  const categoryLabel = formData.get('categoryLabel') as string;
  const categoryIds = formData.get('categoryIds') as string;
  const role = formData.get('role') as string;
  const clientName = formData.get('clientName') as string;
  const month = formData.get('month') as string;
  const year = formData.get('year') as string;
  const linkTeaser = formData.get('linkTeaser') as string;
  const is_video_istrailer = formData.get('is_video_istrailer');
  const coverImageUrl = formData.get('coverImageUrl') as string;
  const categoryIdsParsed: string[] = JSON.parse(categoryIds);

  const additionalFields = formData.get('additional_fields') as string;
  const banner_Xaxis = formData.get('banner_Xaxis') as string || null;
  const banner_Yaxis = formData.get('banner_Yaxis') as string || null;

  if (id) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        slug,
        // category_id: categoryId,
        category_label: categoryLabel,
        role,
        client_name: clientName,
        date_month_project: `${month} ${year}`,
        link_teaser: getYoutubeEmbedUrl(linkTeaser) || linkTeaser,
        is_video_istrailer: Boolean(is_video_istrailer === "on") || false,
        user_id: userId,
        cover_image_url: coverImageUrl,
        additional_fields: additionalFields,
        banner_Yaxis: Number(banner_Yaxis),
        banner_Xaxis: Number(banner_Xaxis)
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

    await revalidatePage(`/projects/${id}`)
    await revalidatePage('/')

    dataToAdd?.forEach(async (addCategory) => {
      await revalidatePage(`/${addCategory}`)
    })
    dataToDelete?.forEach(async (deleteCategory) => {
      await revalidatePage(`/${deleteCategory}`)
    })

    return data;
  } else {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        slug,
        // category_id: categoryId,
        category_label: categoryLabel,
        role,
        client_name: clientName,
        date_month_project: `${month} ${year}`,
        link_teaser: getYoutubeEmbedUrl(linkTeaser) || linkTeaser,
        is_video_istrailer: Boolean(is_video_istrailer === "on") || false,
        user_id: userId,
        cover_image_url: coverImageUrl,
        additional_fields: additionalFields,
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

    await revalidatePage(`/projects/${data?.[0].id}`)
    await revalidatePage('/')

    categoryIdsParsed?.forEach(async (slug) => {
      await revalidatePage(`/${slug}`)
    })

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
  const linkBulk = formData.get('link_bulk') as string;
  const showcaseType = formData.get('showcaseType') as string;
  const project_id = formData.get('project_id') as string;

  const link_bulk = linkBulk ? JSON.parse(linkBulk) : null;

  const { data: dataProject, error } = await supabase
    .from('projects')
    .select(`id, slug`)
    .eq("id", id)
    .single()

  console.log({project_id})
  if (id) {
    const { data, error } = await supabase
      .from('showcase_project')
      .update({
        link: getYoutubeEmbedUrl(link) || link,
        is_video: showcaseType === 'video',
        updated_at: new Date()
      })
      .eq('id', id)

    if (error) throw error;

    const responseRevalidate = await fetch(`https://rifkyprasetia-portfolio.vercel.app/api/revalidate?path=/projects/${project_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const responseRevalidateJson = await responseRevalidate.json()
    console.log({responseRevalidateJson})

    await revalidatePage(`/projects/${dataProject?.slug}`)

    return data;
  } else if (link_bulk && link_bulk?.length) {
    const { count } = await supabase
      .from('showcase_project')
      .select('id', { count: 'exact' })
      .eq('project_id', project_id);

    await Promise.all(
      link_bulk.map(async (linkimg: string, index: number) => {

        const { data, error } = await supabase
          .from('showcase_project')
          .insert({
            link: getYoutubeEmbedUrl(linkimg) || linkimg,
            is_video: showcaseType === 'video',
            project_id,
            user_id: userId,
            position: (count || 0) + index
          });

        if (error) throw error;
      })
    )
    await revalidatePage(`/projects/${dataProject?.slug}`)
    return
  } else {
    const { count } = await supabase
      .from('showcase_project')
      .select('id', { count: 'exact' })
      .eq('project_id', project_id);

    const { data, error } = await supabase
      .from('showcase_project')
      .insert({
        link: getYoutubeEmbedUrl(link) || link,
        is_video: showcaseType === 'video',
        project_id,
        user_id: userId,
        position: count
      });

    if (error) throw error;

    // const responseRevalidate = await fetch(`https://rifkyprasetia-portfolio.vercel.app/api/revalidate?path=/projects/${project_id}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })

    // const responseRevalidateJson = await responseRevalidate.json()
    // console.log({responseRevalidateJson})
    await revalidatePage(`/projects/${dataProject?.slug}`)
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
  let project_id = ''

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
    // @ts-ignore
    project_id = data?.[0].project_id
  })

  project_id && await revalidatePage(`/projects/${project_id}`)
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

  await revalidatePage(`/`)

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
  let routeUrl = ''

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

    // @ts-ignore
    routeUrl = data?.[0]?.category_id
  })

  await revalidatePage(`/${routeUrl}`)
  // if (error) throw error;
  // return data
}

export async function deleteProject(id: string) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  // await handleFileDelete(image);

  const { data, error } = await supabase
    .from('projects')
    .select(`*`)
    .eq("id", id)

  if (!data || error) throw new Error('Delete project unsuccessful, please contact the admin.');

  const imageThumbnail = data?.[0]?.cover_image_url;

  if (imageThumbnail) {
    await handleFileDelete(imageThumbnail);
  }

  const { data: dataShowcase } = await supabase
    .from('showcase_project')
    .select(`*`)
    .eq("project_id", id)

  if (dataShowcase && dataShowcase.length) {
    const imageSupabase: string[] = [];
    dataShowcase.forEach((showcase) => {
      if (showcase?.link && showcase?.link?.includes("supabase")) {
        imageSupabase.push(showcase?.link);
      }
    })

    if (imageSupabase.length) {
      await Promise.all(imageSupabase.map( async (image) => {
        await handleFileDelete(image);
      }))
    }

    // // delete bulk all showcase project
    // await supabase
    //   .from('showcase_project')
    //   .delete()
    //   .eq('project_id', id)
  }

  const { data: projectCategories } = await supabase
    .from('project_categories')
    .select(`*`)
    .eq("project_id", id)

  

  if (projectCategories?.length) {
    // delete project categories
    await supabase
      .from('project_categories')
      .delete()
      .eq('project_id', id)
  }

  if (dataShowcase && dataShowcase.length) {
    await supabase
      .from('showcase_project')
      .delete()
      .eq('project_id', id)
  }

  // delete project
  await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  await revalidatePage(`/`)
  await revalidatePage(`/projects/${id}`)
  const { data: categories, error: errorCategories } = await supabase
    .from('category')
    .select("slug")

  categories?.forEach( async (slugs) => {
    await revalidatePage(`/${slugs?.slug}`);
  })
}

export async function deleteShowcase(id: string) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data: dataShowcase } = await supabase
    .from('showcase_project')
    .select(`*`)
    .eq("id", id)
  console.log({dataShowcase})
  if (!dataShowcase || !dataShowcase.length) throw new Error('Delete project unsuccessful, please contact the admin.');

  //@ts-ignore
  const imageThumbnail = dataShowcase?.[0]?.link;

  if (imageThumbnail && imageThumbnail.includes('supabase')) {
    await handleFileDelete(imageThumbnail);
  }

  await supabase
    .from('showcase_project')
    .delete()
    .eq('id', id)

  await revalidatePage(`/projects/${dataShowcase?.[0]?.project_id}`)
}

export async function deleteImageUploadthing(id: string) {
  await utapi.deleteFiles(id);
};
