"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import { createProject } from "@/app/projects/action";
import { MONTH_LIST, YEAR_LIST } from '@/common/date-config';
import React, { useState, useRef, ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from "../ui/toast";
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
import { ErrorInputTag } from "@/composables/validation.types";
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/components/ui/multi-select";
import UploadImage from '../UploadImage';
import { CategoryDropdownType } from "@/composables/category.types";

interface InformationProp {
  categories: CategoryDropdownType[] | null
}
const CreateProject: React.FC<InformationProp> = ({ categories }) => {
  const supabase = createClient();
  const { toast } = useToast()
  const router = useRouter();

  const categoriesOpt = categories?.map((category) => { 
    return {
      label: category?.name,
      value: category?.slug
    }
  })

  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [coverProject, setCoverProject] = useState<string>('');

  const [hoverUploadPhoto, setHoverUploadPhoto] = useState<boolean>(false);
  const [imageUploadState, setImageUploadState] = useState<"loading" | "idle">('idle');
  const [errorUploadPhoto, setErrorUploadPhoto] = useState<string>('');

  const formRef = useRef<HTMLFormElement>(null);
  const [errorFeedback, setErrorFeedback] = useState<ErrorInputTag[]>([]);
  const [submitState, setSubmitState] = useState<'loading' | 'idle'>('idle');

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

  async function onSubmit(formData: FormData) {
    console.log("hhh")
    setSubmitState('loading')
    const errors = []
    const title = formData.get('title') as string;
    const role = formData.get('role') as string;
    const clientName = formData.get('clientName') as string;
    const linkTeaser = formData.get('linkTeaser') as string;

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
    if (!categoryIds || !categoryIds.length) {
      errors.push({
        id: "categoryId",
        message: "Project Category is required.",
      });
    }
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
    // if (!linkTeaser) {
    //   errors.push({
    //     id: "linkTeaser",
    //     message: "Link To Watch is required.",
    //   });
    // }
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
    
    let id = '';
    try {
      const data = await createProject(formData);
      id = data?.[0].id

      toast({
        title: "Success add project",
      })

      router.refresh()
    } catch (error) {
      console.error('Failed to create project:', error);
      formRef.current?.reset();
      toast({
        variant: "destructive",
        title: "Failed to edit project",
        description: "Please try again or contact the support team.",
      })
    } finally {
      setSubmitState('idle');

      setTimeout(() => {
        window.location.replace(`/projects/${id}`)
      }, 5000)
    }
  }

  return (
    <div className='flex flex-col w-full gap-5'>
      <form action={onSubmit} ref={formRef} className='flex flex-col w-full gap-5'>
        <div className='flex justify-between lg:max-w-2xl'>
          <p className='text-2xl'>Project Information</p>
          <div className='flex gap-3'>
            <Button type="submit" disabled={submitState === 'loading'}>{submitState === 'loading' ? "Saving..." : "Save"}</Button>
          </div>
        </div>

        <hr className='lg:max-w-2xl'/>
        
        <div className='flex flex-col gap-3'>
          Project Image
          <div
            className="flex gap-4 relative w-[300px] h-[157px]"
            onMouseEnter={() => setHoverUploadPhoto(true)}
            onMouseLeave={() => setHoverUploadPhoto(false)}
          >
            {coverProject && (
              <img
                src={coverProject}
                // src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
                alt="Vercel Logo"
                // fill
                // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
                // width={320}
                // height={100}
                // priority
                className={cn(
                  "w-[300px] rounded-lg object-cover",
                  hoverUploadPhoto && 'brightness-50'
                )}
              />
            )}
            
            <div
              className="flex flex-col gap-2 absolute"
            >
              <UploadImage
                id="hehe"
                onImageUpload={uploadFile}
                imageUploadState={imageUploadState}
                disabled={false}
                width="w-[300px]"
                height="h-[157px]"
              />
            </div>
          </div>
          {errorUploadPhoto && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorUploadPhoto}
            </small>
          )}
          {errorFeedback?.find((err) => err.id === "coverProject") && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorFeedback?.find((err) => err.id === "coverProject")?.message}
            </small>
          )}
        </div>
        <Label className='flex flex-col gap-3'>
          Project Name
          <Input
            id='title'
            name='title'
            placeholder='Enter project name'
            className='lg:max-w-2xl'
            // defaultValue={project?.title}
          />
          {errorFeedback?.find((err) => err.id === "title") && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorFeedback?.find((err) => err.id === "title")?.message}
            </small>
          )}
        </Label>
        <Label className='flex flex-col gap-3'>
          Project Type

          <MultiSelect
            options={categoriesOpt!}
            onValueChange={(val) => {
              setCategoryIds(val);
            }}
            // defaultValue={categoryIds}
            placeholder="Select Category"
            variant="inverted"
            animation={2}
            maxCount={3}
            className="lg:max-w-2xl"
          />

          {errorFeedback?.find((err) => err.id === "categoryId") && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorFeedback?.find((err) => err.id === "categoryId")?.message}
            </small>
          )}
        </Label>
        <Label className='flex flex-col gap-3'>
          Project Category Label
          <Input
            id='categoryLabel'
            name='categoryLabel'
            placeholder='Enter category project label'
            className='lg:max-w-2xl'
            // defaultValue={project?.category_label}
            // onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Role
          <Input
            id="role"
            name="role"
            placeholder='Enter your role'
            className='lg:max-w-2xl'
            // defaultValue={project?.role}
          />
          {errorFeedback?.find((err) => err.id === "role") && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorFeedback?.find((err) => err.id === "role")?.message}
            </small>
          )}
        </Label>
        <Label className='flex flex-col gap-3'>
          Client
          <Input
            id="clientName"
            name="clientName"
            placeholder='Enter your client'
            className='lg:max-w-2xl'
            // defaultValue={project?.client_name}
          />

          {errorFeedback?.find((err) => err.id === "clientName") && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorFeedback?.find((err) => err.id === "clientName")?.message}
            </small>
          )}
        </Label>
        <Label className='flex flex-col gap-3'>
          Date Project
          {/* <Input placeholder='Enter date project' className='lg:max-w-2xl' /> */}
          <div className='flex gap-2 lg:max-w-2xl'>
            <Select
              // defaultValue={month}
              onValueChange={(value) => {
                setMonth(value);
              }}
            >
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
            <Select
              // defaultValue={year}
              onValueChange={(value) => {
                setYear(value)
              }}
            >
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

          {errorFeedback?.find((err) => err.id === "dateOfProject") && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorFeedback?.find((err) => err.id === "dateOfProject")?.message}
            </small>
          )}
        </Label>
        <Label className='flex flex-col gap-3'>
          Link to Watch
          <Input
            id="linkTeaser"
            name="linkTeaser"
            placeholder='Enter the link'
            className='lg:max-w-2xl'
            // defaultValue={project?.link_teaser}
          />
        </Label>
      </form>
    </div>
  )
}

export default CreateProject;
