'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function socialAction(formData: FormData) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }
  console.log({session})
  const userId = session.user.id;

  const id = formData.get('id') as string;
  const socialKey = formData.get('key') as string;
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
        key: socialKey, username: username
      })
      .eq('id', id);

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
    .from('social')
    .insert({
      key: socialKey,
      username: username,
      user_id: userId,
    });

    if (error) throw error;
    return data;
  }
}
