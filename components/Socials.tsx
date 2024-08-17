"use server"
import { createClient } from "@/utils/supabase/server"
import React from 'react';
import { cn } from '@/lib/utils';
import { Social } from "@/composables/social.types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Icon } from '@iconify/react';
import ModalAddEditSocial from './modals/ModalAddEditSocial';
import { SOCIALLIST } from "@/common/socials";
const Socials = async () => {
  const supabase = createClient();
  const { data: socials, error } = await supabase
    .from('social') // Adjust this to your table name
    .select('id, key, username')
    .eq("user_id", `${process.env.NEXT_PUBLIC_SUPABASE_USER_ID}`)

  console.log({socials})
  const socialMedia = [
    {
      id: "XXX",
      socialKey: "instagram",
      socialName: "Instagram",
      username: "@xyz",
      logo: "uil:instagram-alt",
      color: "text-pink-600"
    },
    {
      id: "XXX",
      socialKey: "linkedin",
      socialName: "Linkedin",
      username: "@xyz-xyz",
      logo: "mdi:linkedin",
      color: "text-blue-600"
    },
    {
      id: "XXX",
      socialKey: "youtube",
      socialName: "Youtube",
      username: "@xyz-xyz",
      logo: "mdi:youtube",
      color: "text-red-600"
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-5 my-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl">Socials</h2>
            <p className="text-sm text-gray-600">Manage your categories here.</p>
          </div>
          <ModalAddEditSocial />
        </div>
        <hr className="w-full" />
      </div>
      <Table>
        <TableCaption>A list of your social media.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Socials</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {socials?.map((social: Partial<Social>) => {
            return (
              <TableRow key={social.id}>
                <TableCell className='flex gap-2'>
                  <Icon
                    icon={SOCIALLIST?.find((socialItem) => socialItem?.socialKey === social.key)?.logo!}
                    className={cn(
                      "text-3xl",
                      SOCIALLIST?.find((socialItem) => socialItem?.socialKey === social.key)?.color!
                    )}
                  />
                  {/* <p>{social.socialName}</p> */}
                </TableCell>
                <TableCell className='min-w-[90%]'>
                  {social.username}
                </TableCell>
                <TableCell>
                  <ModalAddEditSocial isEdit data={social}/>
                </TableCell>
                {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default Socials