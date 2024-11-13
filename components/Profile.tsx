"use server"
import { createClient } from "@/utils/supabase/server"
import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import ModalAddEditSocial from './modals/ModalAddEditSocial';
import { SOCIALLIST } from "@/common/socials";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import ProfileClient from "./ProfileClient";

const Profile = async () => {
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profile') // Adjust this to your table name
    .select('*')
    .eq("id", `${process.env.NEXT_PUBLIC_SUPABASE_USER_ID}`)
  const { data: socialData, error: errorSocial } = await supabase
    .from('social') // Adjust this to your table name
    .select('*')
    // .eq("id", `${process.env.NEXT_PUBLIC_SUPABASE_USER_ID}`)
  console.log({profile})
  return (
    <>
      <div className="flex flex-col gap-5 my-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl">Profile</h2>
            <p className="text-sm text-gray-600">Manage your profile data here.</p>
          </div>
        </div>
        <hr className="w-full" />
      </div>
      
      <ProfileClient profile={profile?.[0]} socials={socialData || []} />
    </>
  )
}

export default Profile;
