"use client";

import React from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/showcase/Droppable'
import { reorderDragNDrop } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import moment from "moment"
import { Card, CardContent } from "./ui/card";
import { CategoryDropdownType } from "@/composables/category.types"
import { Icon } from '@iconify/react'
import { Button } from "@/components/ui/button"
import ModalAddEditCategory from './modals/ModalAddEditCategory';
import Link from "next/link"
import { upsertCategoryPosition } from '@/app/category/action';

const CategoryWrapper = ({ categoriesData }: { categoriesData: CategoryDropdownType[] }) => {
  const [categories, setCategories] = React.useState<Partial<CategoryDropdownType>[]>(categoriesData || []);

  const onDragEnd = async (result: any) => {
    console.log({result})

    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const res = reorderDragNDrop(categories, result.source.index, result.destination.index).map((dataSection: Partial<CategoryDropdownType>, idx) => {
      return {
        ...dataSection,
        position: idx,
        updated_at: new Date()
      }
    });
    // await reorderCourseSection(result.source.index, result.destination.index, id);

    await upsertCategoryPosition(res)
    setCategories(res)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="showcase">
        {provided => (
          <ul className="link-block no-bullets flex flex-col gap-2 max-w-[70rem]" {...provided.droppableProps} ref={provided.innerRef}>
            {categories?.sort((a, b) => a.position! - b.position!)?.map((category, idx) => (
              <Draggable draggableId={String(category?.position || idx)} index={category?.position! || idx} key={category?.position || idx}>
                {providedChild => (
                  <li
                    ref={providedChild.innerRef}
                    {...providedChild.draggableProps}
                    {...providedChild.dragHandleProps}
                  >
                    <Card key={category.slug}>
                      <CardContent className="flex justify-between pt-6">
                        <div>
                          <div className='text-gray-600'><span className='text-gray-800 font-[600]'>Slug:</span> <i>{category.slug}</i></div>
                          <div className='text-gray-600'><span className='text-gray-800 font-[600]'>Name:</span> {category.name}</div>
                          <div className='text-gray-600'><span className='text-gray-800 font-[600]'>Last Update:</span> {moment(category.updated_at).format("DD MMMM YYYY")}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <ModalAddEditCategory
                            isEdit
                            //@ts-ignore
                            data={category}
                          />
                          <Link href={`/category/${category.slug}`}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button variant={'outline'}><Icon icon="rivet-icons:settings" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Reorder {category?.name} projects</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
    </DragDropContext>
  )
}

export default CategoryWrapper;
