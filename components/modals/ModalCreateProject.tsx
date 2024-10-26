"use client";

import React, { useEffect, useState, ChangeEvent } from 'react'
import { MONTH_LIST, YEAR_LIST } from '@/common/date-config';
import { ErrorInputTag } from '@/composables/validation.types';
import { cn } from '@/lib/utils';
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
import { createClient } from "@/utils/supabase/client";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from '../ui/button'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { createProject } from '@/app/projects/action';
import UploadImage from '../UploadImage';
import { Icon } from '@iconify/react';
import { CategoryDropdownType } from '@/composables/category.types';

const ModalCreateProject = ({ categories }: { categories: CategoryDropdownType[] }) => {
  const { toast } = useToast()
  const supabase = createClient();

  const categoriesOpt = categories?.map((category) => { 
    return {
      label: category?.name,
      value: category?.slug
    }
   })

  const [isMounted, setIsMounted] = useState(false);
  const [submitState, setSubmitState] = useState<'loading' | 'idle'>('idle');
  const [hoverUploadPhoto, setHoverUploadPhoto] = useState<boolean>(false);

  const [coverProject, setCoverProject] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const [imageUploadState, setImageUploadState] = useState<"loading" | "idle">('idle')
  const [errorFeedback, setErrorFeedback] = useState<ErrorInputTag[]>([]);
  const [errorUploadPhoto, setErrorUploadPhoto] = useState<string>('');

  useEffect(() => {
    setIsMounted(true); // Ensure component mounts on the client
  }, []);

  console.log({isMounted})
  // Return null if not mounted to avoid server-client mismatch
  if (!isMounted) return null;

  async function onSubmit(formData: FormData) {
    setSubmitState('loading')
    const closeButton = document.getElementById("close-modal-project");
    const errors = []
    const title = formData.get('title') as string;
    const role = formData.get('role') as string;
    const clientName = formData.get('clientName') as string;
    const linkTeaser = formData.get('linkTeaser') as string;
    console.log({title, role})
    if (!coverProject) {
      errors.push({
        id: "coverProject",
        message: "Cover Project is required.",
      });
    }
    if (!title) {
      errors.push({
        id: "title",
        message: "Project Name is required.",
      });
    }
    // if (!categoryIds || !categoryIds.length) {
    //   errors.push({
    //     id: "categoryId",
    //     message: "Project Category is required.",
    //   });
    // }
    if (!role) {
      errors.push({
        id: "role",
        message: "Project Role is required.",
      });
    }
    if (!clientName) {
      errors.push({
        id: "clientName",
        message: "Client is required.",
      });
    }
    if (!month || !year) {
      errors.push({
        id: "dateOfProject",
        message: "Date of Project is required.",
      });
    }
    if (!linkTeaser) {
      errors.push({
        id: "linkTeaser",
        message: "Link To Watch is required.",
      });
    }
    console.log({errors})
    if (errors.length) {
      setErrorFeedback([...errors]);
      setSubmitState('idle');
      return
    }
    
    setErrorFeedback([])

    formData.set('categoryIds', JSON.stringify(categoryIds));
    formData.set('month', month);
    formData.set('year', year);
    formData.set('coverImageUrl', coverProject);

    let id = "";
    try {
      const data = await createProject(formData);
      id = data?.[0].id

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
    } finally {
      setSubmitState('idle');

      window.location.replace(`/projects/${id}`)
    }
  }

  const handleCleanUp = () => {
    setCoverProject('');
    setCategoryId('');
    setMonth('');
    setYear('')
    setErrorFeedback([]);
    setErrorUploadPhoto('')
  };

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setImageUploadState('loading')
      let errorUpload = null;

      const files = event.target.files;
      let fileImg = null;

      if (files && files.length > 0) {
        if (!["image/png", "image/jpg", "image/jpeg"].includes(files[0].type)) {
          errorUpload = 'Image should be either png, jpg, or jpeg.'
        } else if (files[0].size > 10000000) {
          errorUpload = 'Image cannot be more than 10mb.'
        } else {
          fileImg = files[0];
        }
      }

      if (errorUpload) {
        setErrorUploadPhoto(errorUpload);
        return
      }

      setErrorUploadPhoto('');

      if (!fileImg) throw new Error('No file selected');

      const formData = new FormData();
      formData.append('file', fileImg);

      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
        duplex: 'half',
      } as RequestInit);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const getImage = supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_STORAGE!)
      .getPublicUrl(data.url).data.publicUrl;

      setCoverProject(getImage)
    } catch (error: any) {
      console.error(error.message)
      // alert(error.message);
    } finally {
      setImageUploadState('idle')
    }
  };

  return (
    <Dialog onOpenChange={handleCleanUp}>
      <DialogTrigger>
        <Button variant={"outline"} className='flex gap-1'>
          <Icon icon="gridicons:add-outline" className='text-xl'/> Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[700px] max-h-[90vh] overflow-scroll'>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            This action is used for save the project information. You can add the showcase photo / video or edit the project information later.
          </DialogDescription>
        </DialogHeader>
        <hr />        
        <form action={onSubmit}>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Cover Project</p>
              <div
                className="flex gap-4 relative w-[12rem] h-[7rem]"
                onMouseEnter={() => setHoverUploadPhoto(true)}
                onMouseLeave={() => setHoverUploadPhoto(false)}
              >
                {coverProject ? (
                  <img
                    src={coverProject}
                    className={cn(
                      'w-[12rem] h-[7rem] bg-slate-100 rounded-lg object-cover',
                      hoverUploadPhoto && 'brightness-50'
                    )}
                  />
                ) : <div className={cn(
                  'w-[12rem] h-[7rem] bg-slate-50 rounded-lg',
                  hoverUploadPhoto && 'brightness-50'
                )}></div>
                }
                <div
                  className="flex flex-col gap-2 absolute"
                >
                  <UploadImage
                    id="hehe"
                    onImageUpload={uploadFile}
                    imageUploadState={imageUploadState}
                    disabled={false}
                    width='w-[12rem]'
                    height='h-[7rem]'
                  />
                </div>
              </div>
              {errorUploadPhoto && (
                <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {errorUploadPhoto}
                </small>
              )}
              {errorFeedback?.find((err) => err.id === 'coverProject') && (
                <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {errorFeedback.find((err) => err.id === "coverProject")?.message }
                </small>
              )}
            </div>

            <Label className='flex flex-col gap-2'>
              Project Name
              <Input id='title' name='title' className='lg:max-w-2xl' placeholder='Enter your project name'/>
              {errorFeedback?.find((err) => err.id === 'title') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "title")?.message }
                </small>
              )}
            </Label>
            <Label className='flex flex-col gap-2'>
              Project Type
              <MultiSelect
                options={categoriesOpt!}
                onValueChange={(val) => setCategoryIds(val)}
                defaultValue={categoryIds}
                placeholder="Select Category"
                variant="inverted"
                animation={2}
                maxCount={3}
                className="lg:max-w-2xl z-[9999999999]"
              />

              {/* <Select onValueChange={(value) => setCategoryId(value)}>
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
              </Select> */}
              {errorFeedback?.find((err) => err.id === 'categoryId') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "categoryId")?.message }
                </small>
              )}
            </Label>
            <Label className='flex flex-col gap-2'>
              Role
              <Input id='role' name='role' className='lg:max-w-2xl' placeholder='Enter your role in this project'/>
              {errorFeedback?.find((err) => err.id === 'role') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "role")?.message }
                </small>
              )}
            </Label>
            <Label className='flex flex-col gap-2'>
              Client
              <Input id='clientName' name='clientName' className='lg:max-w-2xl' placeholder='Enter your client name'/>
              {errorFeedback?.find((err) => err.id === 'clientName') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "clientName")?.message }
                </small>
              )}
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
              {errorFeedback?.find((err) => err.id === 'dateOfProject') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "dateOfProject")?.message }
                </small>
              )}
            </Label>
            <Label className='flex flex-col gap-2'>
              Link to Watch
              <Input id='linkTeaser' name='linkTeaser' className='lg:max-w-2xl' placeholder='Enter the link of your project preview'/>
              {errorFeedback?.find((err) => err.id === 'linkTeaser') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "linkTeaser")?.message }
                </small>
              )}
            </Label>
          </div>
          <DialogFooter className='mt-5'>
            <DialogClose asChild className='hidden'>
              <Button id='close-modal-project'>close</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={submitState === 'loading'}>{submitState === 'loading' ? "Saving...": "Save"}</Button>
          </DialogFooter>
        </form>
        
      </DialogContent>
    </Dialog>
  )
}

export default ModalCreateProject
