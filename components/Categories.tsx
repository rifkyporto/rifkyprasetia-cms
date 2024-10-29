"use server"
import { createClient } from "@/utils/supabase/server"
import React from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/showcase/Droppable'
import { reorderDragNDrop } from "@/lib/utils"
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
import { Card, CardContent } from "./ui/card";
import { CategoryDropdownType } from "@/composables/category.types"
import { Icon } from '@iconify/react'
import { Button } from "@/components/ui/button"
import ModalAddEditCategory from './modals/ModalAddEditCategory';
import Link from "next/link"
import CategoryWrapper from "./CategoryWrapper";

const Categories = async () => {
  const supabase = createClient();
  const { data: categories, error } = await supabase
    .from('category') // Adjust this to your table name
    .select('slug, name, position, updated_at')
    // .eq("user_id", `${process.env.NEXT_PUBLIC_SUPABASE_USER_ID}`)

  console.log({categories})

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

      <p className="text-sm font-light mb-5">*Drag n drop to set the position that will be sorted in public page</p>
      <CategoryWrapper categoriesData={categories!}/>
      {/* <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="showcase">
          {provided => (
            <ul className="link-block no-bullets flex flex-col gap-2 max-w-[70rem]" {...provided.droppableProps} ref={provided.innerRef}>
              {categories?.map((category, idx) => (
                <Draggable draggableId={String(category?.position)} index={category?.position!} key={idx}>
                  {providedChild => (
                    <li
                      ref={providedChild.innerRef}
                      {...providedChild.draggableProps}
                      {...providedChild.dragHandleProps}
                    >
                      <Card key={category.slug}>
                        <CardContent className="flex justify-between pt-6">
                          <div>
                            <div><strong>Slug:</strong> <i>{category.slug}</i></div>
                            <div><strong>Name:</strong> {category.name}</div>
                            <div><strong>Last Update:</strong> {moment(category.updated_at).format("DD MMMM YYYY")}</div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <ModalAddEditCategory
                              isEdit
                              data={category}
                            />
                            <Link href={`/category/${category.slug}`}>
                              <Button variant={'outline'}><Icon icon="rivet-icons:settings" /></Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      </DragDropContext> */}
      {/* <div className="flex flex-col gap-2 max-w-[70rem]">
        {categories?.map((category) => (
          <Draggable draggableId={String(position)} index={position!} key={position}>
            {providedChild => (
              <li
                ref={providedChild.innerRef}
                {...providedChild.draggableProps}
                {...providedChild.dragHandleProps}
              >
                <Card key={category.slug}>
                  <CardContent className="flex justify-between pt-6">
                    <div>
                      <div><strong>Slug:</strong> <i>{category.slug}</i></div>
                      <div><strong>Name:</strong> {category.name}</div>
                      <div><strong>Last Update:</strong> {moment(category.updated_at).format("DD MMMM YYYY")}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <ModalAddEditCategory
                        isEdit
                        data={category}
                      />
                      <Link href={`/category/${category.slug}`}>
                        <Button variant={'outline'}><Icon icon="rivet-icons:settings" /></Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </li>
            )}
          </Draggable>
        ))}
      </div> */}
    </>
  )
}

export default Categories