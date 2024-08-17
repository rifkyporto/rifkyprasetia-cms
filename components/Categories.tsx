"use server"
import { createClient } from "@/utils/supabase/server"
import React from 'react'
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
import moment from "moment"
import { CategoryDropdownType } from "@/composables/category.types"
import { Icon } from '@iconify/react'
import { Button } from "@/components/ui/button"
import ModalAddEditCategory from './modals/ModalAddEditCategory';

const Categories = async () => {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from('category') // Adjust this to your table name
    .select('slug, name, updated_at')
    .eq("user_id", `${process.env.NEXT_PUBLIC_SUPABASE_USER_ID}`)

  console.log({categories})
  const categoriess = [
    {
      id: "XXXX",
      name: "Short Film",
      value: "short-film",
    },
    {
      id: "XXXX",
      name: "Music Video",
      value: "music-video",
    },
    {
      id: "XXXX",
      name: "Commercial",
      value: "commercial",
    },
    {
      id: "XXXX",
      name: "Fashion",
      value: "fashion",
    },
    {
      id: "XXXX",
      name: "Others",
      value: "others",
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-5 my-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl">Categories</h2>
            <p className="text-sm text-gray-600">Manage your categories here.</p>
          </div>
          <ModalAddEditCategory isEdit={false} />
        </div>
        <hr className="w-full" />
      </div>
      <Table>
        <TableCaption>A list of your category database.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Slug</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.slug}>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{moment(category.updated_at).format("DD MMMM YYYY")}</TableCell>
              <TableCell>
                <ModalAddEditCategory
                  isEdit
                  data={category}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Categories