"use client";

import React from 'react'
import { upsertShowcasePosition, fetchShowcase } from '@/app/projects/action';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/showcase/Droppable'
import { reorderDragNDrop } from "@/lib/utils"
import { ShowcaseType } from '@/composables/showcase.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '../ui/button';
import ModalAddEditShowcase from '../modals/ModalAddEditShowcase';
import { Icon } from '@iconify/react';
import ModalDeleteShowcase from '../modals/ModalDeleteShowcase';

const Showcase: React.FC<{ id: string }> = ({ id }) => {
  const [showcases, setShowcases] = React.useState<Partial<ShowcaseType>[]>([]);
  const [loadfetch, setLoadfetch] = React.useState<'idle'|'loading'>('idle')
  console.log({id})
  React.useEffect(() => {
    setLoadfetch('loading')
    id && fetchShowcase(id).then((data) => {
      const resData = data.sort((a, b) => a.position - b.position)
      setShowcases(resData)

      setLoadfetch('idle')

      if (!data) setLoadfetch('idle')
    });
  }, [])

  const onDragEnd = async (result: any) => {
    console.log({result})

    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const res = reorderDragNDrop(showcases, result.source.index, result.destination.index).map((dataSection: Partial<ShowcaseType>, idx) => {
      return {
        ...dataSection,
        position: idx,
        updated_at: new Date()
      }
    });
    // await reorderCourseSection(result.source.index, result.destination.index, id);

    await upsertShowcasePosition(res)
    setShowcases(res)
  }

  return (
    <div className='flex flex-col w-full gap-5'>
      <div className='flex justify-between lg:max-w-2xl'>
        <div>
          <p className='text-2xl'>Project Showcase</p>
          <small>Drag and drop the list below to show it in public page.</small>
        </div>
        
        {/* <Button variant={'outline'}>Add Showcase</Button> */}
        <ModalAddEditShowcase project_id={id} />
      </div>
      <hr className='lg:max-w-2xl'/>
      {/* 
      <Label className='flex flex-col gap-3'>
        Photos
        <img
          src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
          alt="Vercel Logo"
          // fill
          // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
          // width={320}
          // height={100}
          // priority
          className="lg:max-w-2xl rounded-lg"
        />
      </Label> */}

      <div className='lg:max-w-2xl'>
        {loadfetch === 'loading' && (
          <Icon
            icon="svg-spinners:6-dots-rotate"
            className="text-4xl mx-auto my-auto text-[#787878]"
          />
        )}
        {showcases && showcases.length ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="showcase">
            {provided => (
              <ul className="link-block no-bullets" {...provided.droppableProps} ref={provided.innerRef}>
                {showcases.sort((a, b) => a.position! + b.position!).map((section: Partial<ShowcaseType>, idx: number) => {
                  const { id: idSection, link, is_video, position, project_id } = section;
                  console.log({position, link})
                  return (
                    <Draggable draggableId={String(position)} index={position!} key={position}>
                      {providedChild => (
                        <li
                          ref={providedChild.innerRef}
                          {...providedChild.draggableProps}
                          {...providedChild.dragHandleProps}
                        >
                          <Card className="my-4">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className='w-[500px] flex flex-col gap-5'>
                                  <CardTitle>Showcase {position! + 1}</CardTitle>
                                  {is_video ? (
                                    // <iframe
                                    //   title="iframe-module"
                                    //   src="https://youtu.be/khEXKi5bxYU?si=O-U4ET3qf0CyJJV4"
                                    //   id="iframeModule"
                                    //   frameBorder="0"
                                    //   className=""
                                    //   loading="lazy"
                                    //   style={{
                                    //     width: '100%',
                                    //     height: '100%',
                                    //   }}
                                    // />
                                    <iframe
                                      width="500"
                                      height="300"
                                      src={`${link}?rel=0`}
                                      title="YouTube video player"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"
                                      allowFullScreen
                                      className='m-0'
                                    >
                                    </iframe>
                                  ) : (
                                    <img src={link} alt="" />
                                  )}
                                  
                                  {/* <CardTitle>Bab {position! + 1}</CardTitle>
                                  <CardDescription className='truncate'>{link}</CardDescription> */}
                                </div>
                                <div className="flex gap-3">
                                  <ModalAddEditShowcase isEdit data={section} project_id={id} />
                                  <ModalDeleteShowcase id={id} />
                                  {/* <ModalAddCourseSection isEdit={true} defaultData={section} setCourseSections={setCourseSections} totalLength={courseSections.length} /> */}
                                  
                                </div>
                              </div>
                            </CardHeader>
                            {/* <CardFooter className="flex flex-col items-start">
                              <span className="text-sm text-gray-400">Created At: {moment(createdDate).format("DD MMMM YYYY HH:mm")} </span>
                              <span className="text-sm text-gray-400">Updated At: {moment(updatedDate).format("DD MMMM YYYY HH:mm")} </span>
                            </CardFooter> */}
                          </Card>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
            </StrictModeDroppable>
          </DragDropContext>
        ) : "No Showcases"}
      </div>
      
    </div>
  )
}

export default Showcase