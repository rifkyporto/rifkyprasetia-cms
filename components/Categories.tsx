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
import { Icon } from '@iconify/react'
import { Button } from "@/components/ui/button"
import ModalAddEditCategory from './modals/ModalAddEditCategory';

const Categories = () => {
  const categories = [
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
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.name}</TableCell>
              <TableCell>{invoice.value}</TableCell>
              <TableCell>
                <ModalAddEditCategory isEdit />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </>
  )
}

export default Categories