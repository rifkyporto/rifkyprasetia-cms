"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import { createProject, deleteImageUploadthing } from "@/app/projects/action";
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
import { Slider } from "@/components/ui/slider"
import { CategoryDropdownType } from "@/composables/category.types";
import { Icon } from "@iconify/react";
import ModalDeleteProject from "../modals/ModalDeleteProject";
import { handleFileDelete } from "@/lib/utils-client";
import { UploadButton } from "@/utils/uploadthing";
import { nanoid } from "nanoid";
import { Card, CardContent } from "../ui/card";
import ModalPreviewBannerProject from "../modals/ModalPreviewBannerProject";
import { Textarea } from "../ui/textarea";

interface InformationProp {
  id: string;
  project: ProjectDetailType | null
  categories: CategoryDropdownType[] | null
}
const Information: React.FC<InformationProp> = ({ id, project, categories }) => {
  const supabase = createClient();
  const { toast } = useToast()
  const router = useRouter();
  console.log({cc: project?.project_categories})
  const categoriesOpt = categories?.map((category) => { 
    return {
      label: category?.name,
      value: category?.slug
    }
   })

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [month, setMonth] = useState<string>(project?.date_month_project?.split(" ")?.[0] || '');
  const [year, setYear] = useState<string>(project?.date_month_project?.split(" ")?.[1] || '');
  const [categoryId, setCategoryId] = useState<string>(project?.category_id || '');
  const [categoryIds, setCategoryIds] = useState<string[]>(
    project?.project_categories?.map((cat) => {
      return cat?.category?.slug
    }) || []
  );
  const [coverProject, setCoverProject] = useState<string>(project?.cover_image_url || '');
  console.log({coverProject})
  const [bannerProject, setBannerProject] = useState<string>(project?.banner_url || '');
  const [hoverUploadPhoto, setHoverUploadPhoto] = useState<boolean>(false);
  const [imageUploadState, setImageUploadState] = useState<"loading" | "idle">('idle');
  const [bannerX, setBannerX] = useState<number>(project?.banner_Xaxis || 50);
  const [bannerY, setBannerY] = useState<number>(project?.banner_Yaxis || 50);
  const [errorUploadPhoto, setErrorUploadPhoto] = useState<string>('');

  const formRef = useRef<HTMLFormElement>(null);
  const [errorFeedback, setErrorFeedback] = useState<ErrorInputTag[]>([]);
  const [submitState, setSubmitState] = useState<'loading' | 'idle'>('idle');

  const [additionalFields, setAdditionalFields] = useState<{ id: string, label: string, value: string }[]>(
    project?.additional_fields ? JSON.parse(project?.additional_fields) : []
  )
  const [additionalLabel, setAdditionalLabel] = useState<string>("")

  const handleCancel = (e: any) => {
    e.preventDefault()
    formRef.current?.reset(); // Reset the form to its default values
    setIsEdit(false)
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

      coverProject && await handleFileDelete(coverProject);

      const getImage = supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_STORAGE!)
      .getPublicUrl(data.url).data.publicUrl;

      setCoverProject(getImage)
      await supabase
        .from('projects')
        .update({
          cover_image_url: getImage,
          updated_at: new Date()
        })
        .eq('id', id)

      // setIsEdit(true)
    } catch (error: any) {
      console.error(error.message)
      // alert(error.message);
    } finally {
      setImageUploadState('idle')
    }
  };

  const uploadBanner = async (res: any) => {
    const currentBanner = bannerProject || '';
    setBannerProject(res?.url)
    await supabase
      .from('projects')
      .update({
        banner_url: res?.url,
        updated_at: new Date()
      })
      .eq('id', id)
    
    const currentId = currentBanner ? currentBanner.split('/').pop() : null
    currentBanner && currentId && await deleteImageUploadthing(currentId)
  }

  async function onSubmit(formData: FormData) {
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
    if (!categoryId) {
      errors.push({
        id: "categoryId",
        message: "Project Category is required.",
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
    // if (!clientName) {
    //   errors.push({
    //     id: "clientName",
    //     message: "Client is required.",
    //   });
    // }
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

    formData.set('id', id);
    formData.set('categoryId', categoryId);
    formData.set('categoryIds', JSON.stringify(categoryIds));
    formData.set('month', month);
    formData.set('year', year);
    formData.set('coverImageUrl', coverProject);
    formData.set('additional_fields', JSON.stringify(additionalFields))
    formData.set('banner_Xaxis', String(bannerX));
    formData.set('banner_Yaxis', String(bannerY));
    try {
      await createProject(formData);
      toast({
        title: "Success edit project",
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
      setIsEdit(false);
    }
  }
  console.log({additionalFields})
  return (
    <div className='flex flex-col w-full gap-5'>
      <form action={onSubmit} ref={formRef} className='flex flex-col w-full gap-5'>
        <div className='flex justify-between lg:max-w-2xl'>
          <p className='text-2xl'>Project Information</p>
          <div className='flex gap-3'>
            <Button variant={'outline'} disabled={!isEdit} onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={!isEdit || submitState === 'loading'}>{submitState === 'loading' ? "Saving..." : "Save"}</Button>
          </div>
        </div>

        <hr className='lg:max-w-2xl'/>
        
        <div className='flex flex-col gap-3 lg:max-w-2xl'>
          <span className="font-[600]">Project Image</span>
          <div
            className="flex gap-4 relative w-[300px] h-[157px]"
            onMouseEnter={() => setHoverUploadPhoto(true)}
            onMouseLeave={() => setHoverUploadPhoto(false)}
          >
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
          <small className="text-gray-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            *Note: changing this image will automatically update the project's thumbnail on public page, also will delete the previous image thumbnail forever
          </small>
          {errorUploadPhoto && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorUploadPhoto}
            </small>
          )}
        </div>
        <div className='flex flex-col gap-3 lg:max-w-2xl'>
          <span className="font-[600]">Project Banner Image</span>
          <div className="flex flex-col gap-1 w-[300px] items-start">
            {bannerProject && (
              <img
                src={bannerProject}
                // src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
                alt="Vercel Logo"
                // fill
                // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
                // width={320}
                // height={100}
                // priority
                className={cn(
                  "w-[300px] h-[157px] rounded-lg object-cover",
                  // hoverUploadPhoto && 'brightness-50'
                )}
              />
            )}

            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                uploadBanner(res[0])
                // alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <small className="text-gray-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            *Note: this image will appear on project detail as a banner image. if you keep this custom banner empty, system will use project thumbnail as a banner image
          </small>
          {errorUploadPhoto && (
            <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {errorUploadPhoto}
            </small>
          )}
        </div>
        <Label className='flex flex-col gap-3 lg:max-w-2xl'>
          Banner Point Of Interest
          <Card className="flex flex-col gap-2">
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="flex gap-5 items-center">
                  X Axis
                  <span className="italic text-sm text-gray-400">{bannerX}% from left (0%) to right (100%)</span>
                </p>
                <Slider
                  defaultValue={[bannerX]}
                  max={100}
                  step={1}
                  onChange={((e) => {
                    {/* @ts-ignore */}
                    setBannerX(e.target?.value)
                    !isEdit && setIsEdit(true)
                  })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="flex gap-5 items-center">
                  Y Axis
                  <span className="italic text-sm text-gray-400">{bannerY}% from top (0%) to bottom (100%)</span>
                </p>
                <Slider
                  defaultValue={[bannerY]}
                  max={100}
                  step={1}
                  onChange={((e) => {
                    {/* @ts-ignore */}
                    setBannerY(e.target?.value)
                    !isEdit && setIsEdit(true)
                  })}
                />
              </div>
              {/* <Button type="button" variant={'outline'}>Preview Mobile Banner</Button> */}
              <div className="w-full flex gap-2">
                <ModalPreviewBannerProject url={bannerProject || coverProject} bgPosition={`${bannerX}% ${bannerY}%`} device="mobile" />
                <ModalPreviewBannerProject url={bannerProject || coverProject} bgPosition={`${bannerX}% ${bannerY}%`} device="desktop" />
              </div>
            </CardContent>
          </Card>
          
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

          <MultiSelect
            options={categoriesOpt!}
            onValueChange={(val) => {
              setCategoryIds(val);
              !isEdit && setIsEdit(true)
            }}
            defaultValue={categoryIds}
            placeholder="Select Category"
            variant="inverted"
            animation={2}
            maxCount={3}
            className="lg:max-w-2xl"
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Project Category Label
          <Input
            id='categoryLabel'
            name='categoryLabel'
            placeholder='Enter category project label'
            className='lg:max-w-2xl'
            defaultValue={project?.category_label}
            onChange={() => !isEdit && setIsEdit(true)}
          />
          <small className="text-gray-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            *Note: if category label is filled, it will override the exact project category on project detail information
          </small>
        </Label>
        <Label className='flex flex-col gap-3'>
          Role
          <Textarea
            id="role"
            name="role"
            placeholder='Enter your role'
            className='lg:max-w-2xl'
            defaultValue={project?.role}
            onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Client
          <Input
            id="clientName"
            name="clientName"
            placeholder='Enter your client'
            className='lg:max-w-2xl'
            defaultValue={project?.client_name}
            onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
        <Label className='flex flex-col gap-3'>
          Date Project
          {/* <Input placeholder='Enter date project' className='lg:max-w-2xl' /> */}
          <div className='flex gap-2 lg:max-w-2xl'>
            <Select
              defaultValue={month}
              onValueChange={(value) => {
                setMonth(value);
                !isEdit && setIsEdit(true)
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
              defaultValue={year}
              onValueChange={(value) => {
                setYear(value)
                !isEdit && setIsEdit(true)
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
        </Label>
        <Label className='flex flex-col gap-3'>
          Link to Watch
          <Input
            id="linkTeaser"
            name="linkTeaser"
            placeholder='Enter the link'
            className='lg:max-w-2xl'
            defaultValue={project?.link_teaser}
            onChange={() => !isEdit && setIsEdit(true)}
          />
        </Label>
        <hr />
        <h2 className="text-xl">Additional Field</h2>
        {additionalFields?.map((addition, idx) => {
          return (
            <div className="flex flex-col gap-2 lg:max-w-2xl">
              <Label key={idx} className='flex flex-col gap-3'>{addition?.label}</Label>
              <div className="w-full flex gap-2">
                <Textarea
                  id={addition?.label}
                  name={addition?.label}
                  placeholder={`Enter ${addition?.label}`}
                  className='w-full'
                  defaultValue={addition?.value || ""}
                  onChange={(e) => {
                    !isEdit && setIsEdit(true)
                    const mapAddition = additionalFields?.map((add) => {
                      if (add.id === addition.id) {
                        return {
                          ...add,
                          value: e?.target?.value
                        }
                      }
                      
                      return add
                    })
                    setAdditionalFields(mapAddition)
                  }}
                />
                <Button
                  variant={'destructive'}
                  type="button"
                  className=""
                  onClick={() => {
                    const filteredAdditionals = additionalFields?.filter((additionData) => {
                      return additionData.id !== addition.id
                    })

                    setAdditionalFields(filteredAdditionals || [])
                    console.log({filteredAdditionals})
                  }}
                >
                  <Icon icon="tabler:trash" className="text-xl"/>
                </Button>
              </div>
            </div>
          )
        })}
        <div className="flex gap-2 lg:max-w-2xl">
          <Input 
            className="w-full"
            onChange={(e) => setAdditionalLabel(e?.target?.value)}
            value={additionalLabel}
            placeholder="Add new label"
          />
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              setAdditionalFields([...additionalFields, { id: nanoid(), label: additionalLabel, value: "" }])
              setAdditionalLabel("")
            }}
          >+</Button>
        </div>
      </form>
      <div className="flex justify-end lg:max-w-2xl my-5">
        <ModalDeleteProject data={project!} />
      </div>
    </div>
  )
}

export default Information;
