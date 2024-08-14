import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
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

const Socials = () => {
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
          {socialMedia.map((social) => (
            <TableRow key={social.id}>
              <TableCell className='flex gap-2'>
                <Icon
                  icon={social.logo}
                  className={cn(
                    "text-3xl",
                    social.color
                  )}
                />
                {/* <p>{social.socialName}</p> */}
              </TableCell>
              <TableCell className='min-w-[90%]'>
                {social.username}
              </TableCell>
              <TableCell>
                <ModalAddEditSocial isEdit/>
              </TableCell>
              {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Socials