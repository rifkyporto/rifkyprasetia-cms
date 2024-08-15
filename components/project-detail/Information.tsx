"use client";

import { MONTH_LIST, YEAR_LIST } from '@/common/date-config';
import React, { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { ProjectDetailType } from '@/composables/project.types';
import { Button } from "@/components/ui/button"

interface InformationProp {
  project: ProjectDetailType | null
}
const Information: React.FC<InformationProp> = ({ project }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [month, setMonth] = useState<string>(project?.date_month_project?.split(" ")?.[0] || '');
  const [year, setYear] = useState<string>(project?.date_month_project?.split(" ")?.[1] || '');

  const formRef = useRef<HTMLFormElement>(null);

  const handleCancel = (e: any) => {
    e.preventDefault()
    formRef.current?.reset(); // Reset the form to its default values
    setIsEdit(false)
  };

  return (
    <div className='flex flex-col w-full gap-5'>
      <form ref={formRef} className='flex flex-col w-full gap-5'>
        <div className='flex justify-between lg:max-w-2xl'>
          <p className='text-2xl'>Project Information</p>
          <div className='flex gap-3'>
            <Button variant={'outline'} disabled={!isEdit} onClick={handleCancel}>Cancel</Button>
            <Button disabled={!isEdit}>Save</Button>
          </div>
        </div>

        <hr className='lg:max-w-2xl'/>
        
        <Label className='flex flex-col gap-3'>
          Project Image
          <img
            src={project?.cover_image_url}
            // src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
            alt="Vercel Logo"
            // fill
            // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
            // width={320}
            // height={100}
            // priority
            className="w-[300px] rounded-lg"
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Project Name
          <Input
            id='title'
            name='title'
            placeholder='Enter project name'
            className='lg:max-w-2xl'
            defaultValue={project?.title}
            onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Project Type
          <Select defaultValue={project?.category_id}>
            <SelectTrigger className="lg:max-w-2xl outline-none focus:shadow-outline p-2 placeholder:text-gray-400 flex">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="short-movie">Short Movie</SelectItem>
              <SelectItem value="music-video">Music Video</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </Label>
        <Label className='flex flex-col gap-3'>
          Role
          <Input
            placeholder='Enter your role'
            className='lg:max-w-2xl'
            defaultValue={project?.role}
            onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Client
          <Input
            placeholder='Enter your client'
            className='lg:max-w-2xl'
            defaultValue={project?.client_name}
            onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Date Project
          {/* <Input placeholder='Enter date project' className='lg:max-w-2xl' /> */}
          <div className='flex gap-2'>
            <Select defaultValue={month} onValueChange={(value) => setMonth(value)}>
              <SelectTrigger className="lg:max-w-2xl outline-none focus:shadow-outline p-2 placeholder:text-gray-400 flex">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_LIST.map((month: { label: string, value: number }) => {
                  return (
                    <SelectItem value={month.label}>{month.label}</SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Select defaultValue={year} onValueChange={(value) => setYear(value)}>
              <SelectTrigger className="lg:max-w-2xl outline-none focus:shadow-outline p-2 placeholder:text-gray-400 flex">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_LIST.map((year: string) => {
                  return (
                    <SelectItem value={year}>{year}</SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </Label>
        <Label className='flex flex-col gap-3'>
          Link to Watch
          <Input
            placeholder='Enter the link'
            className='lg:max-w-2xl'
            defaultValue={project?.link_teaser}
            onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
      </form>
    </div>
  )
}

export default Information;
