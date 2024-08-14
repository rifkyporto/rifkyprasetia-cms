"use client";

import React, { useEffect, useState } from 'react'
import { MONTH_LIST, YEAR_LIST } from '@/common/date-config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"

import { Button } from '../ui/button'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { createProject } from '@/app/projects/action';
import { useRouter } from 'next/navigation';

const ModalCreateProject = () => {
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMonthData, setSelectedMonthData] = useState({
    month: 9,
    year: 2023,
  });

  const [categoryId, setCategoryId] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');



  useEffect(() => {
    setIsMounted(true); // Ensure component mounts on the client
  }, []);

  // Return null if not mounted to avoid server-client mismatch
  if (!isMounted) return null;

  async function onSubmit(formData: FormData) {
    const closeButton = document.getElementById("close-modal-project");

    // event.preventDefault();
    // Create FormData from the form
    // const formData = new FormData(event.currentTarget as HTMLFormElement);

    // Add Select values to FormData
    formData.set('categoryId', categoryId);
    formData.set('month', month);
    formData.set('year', year);

    try {
      await createProject(formData);
      toast({
        title: "Success create new project",
        description: "Don't forget to add the project showcase on detail project.",
      })
      closeButton?.click();
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: "Please try again or contact the support team.",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger><Button variant={"outline"}>Add Project</Button></DialogTrigger>
      <DialogContent className='min-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            This action is used for save the project information. You can add the showcase photo / video or edit the project information later.
          </DialogDescription>
        </DialogHeader>
        <hr />
        <form action={onSubmit}>
          <div className='flex flex-col gap-5'>
            <Label className='flex flex-col gap-2'>
              Project Name
              <Input id='title' name='title' className='lg:max-w-2xl' placeholder='Enter your project name'/>
            </Label>
            <Label className='flex flex-col gap-2'>
              Project Type
              <Select onValueChange={(value) => setCategoryId(value)}>
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
            <Label className='flex flex-col gap-2'>
              Role
              <Input id='role' name='role' className='lg:max-w-2xl' placeholder='Enter your role in this project'/>
            </Label>
            <Label className='flex flex-col gap-2'>
              Client
              <Input id='clientName' name='clientName' className='lg:max-w-2xl' placeholder='Enter your client name'/>
            </Label>
            <Label className='flex flex-col gap-2'>
              Date of Project
              <div className='flex gap-2'>
                <Select onValueChange={(value) => setMonth(value)}>
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
                <Select onValueChange={(value) => setYear(value)}>
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
            <Label className='flex flex-col gap-2'>
              Link to Watch
              <Input id='linkTeaser' name='linkTeaser' className='lg:max-w-2xl' placeholder='Enter the link of your project preview'/>
            </Label>
          </div>
          <DialogFooter>
            <DialogClose asChild className='hidden'>
              <Button id='close-modal-project'>close</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
        
      </DialogContent>
    </Dialog>
  )
}

export default ModalCreateProject
