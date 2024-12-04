"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, ChangeEvent } from 'react'
import { capitalizeFirstLetter, cn } from '@/lib/utils';
import { useToast } from '../ui/toast';
import { useRouter } from 'next/navigation';
import { showcaseAction } from '@/app/projects/action';
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
// import { MonthPicker, MonthInput } from 'react-lite-month-picker';
import { Icon } from '@iconify/react';
import { Button } from '../ui/button'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ErrorInputTag } from '@/composables/validation.types';
import UploadImage from '../UploadImage';
import { ShowcaseType } from "@/composables/showcase.types";
import { handleFileDelete } from "@/lib/utils-client";

interface ModalAddEditSocialType {
  project_id: string;
}
const ModalAddBulkPhotoShowcase: React.FC<ModalAddEditSocialType> = ({ project_id }) => {
  const { toast } = useToast()
  const supabase = createClient();
  const router = useRouter()
  const [errorFeedback, setErrorFeedback] = useState<ErrorInputTag[]>([])
  const [isMounted, setIsMounted] = useState(false);
  const [loadingState, setLoadingState] = useState<'loading'|'idle'>('idle');

  const [hoverUploadPhoto, setHoverUploadPhoto] = useState<boolean>(false);
  const [imageUploadState, setImageUploadState] = useState<"loading" | "idle">('idle')
  const [errorUploadPhoto, setErrorUploadPhoto] = useState<string>('');
  const [coverProject, setCoverProject] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true); // Ensure component mounts on the client
  }, []);

  // Return null if not mounted to avoid server-client mismatch
  if (!isMounted) return null;

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setImageUploadState('loading')
      let errorUpload = null;

      const files = event.target.files;
      let fileImg: File[] = [];

      console.log({files})

      // return
      if (files && files.length > 0) {
        const photosBulk = Array.from(files);

        photosBulk?.forEach((file) => {
          console.log({file})
          if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
            errorUpload = 'Image should be either png, jpg, or jpeg.'
          } else if (file.size > 10000000) {
            errorUpload = 'Image cannot be more than 10mb.'
          } else {
            fileImg.push(file);
          }
        })
      }

      // return

      if (errorUpload) {
        setErrorUploadPhoto(errorUpload);
        return
      }

      setErrorUploadPhoto('');

      if (!fileImg.length) throw new Error('No file selected');

      const srcImages: string[] = [];

      await Promise.all(
        fileImg?.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

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
          console.log({getImage})
          srcImages.push(getImage);
        })
      )
      srcImages?.length && setCoverProject([...coverProject, ...srcImages])

    } catch (error: any) {
      console.error(error.message)
      // alert(error.message);
    } finally {
      setImageUploadState('idle')
    }
  };
  // console.log({coverProject})
  // const onSubmit = async (formData: FormData, linkImage?: string) => {
  //   console.log({linkImage})
  //   formData.set('link', linkImage!)
  //   formData.set('showcaseType', 'photo')
  //   formData.set('project_id', project_id)

  //   setErrorFeedback([]);

  //   await showcaseAction(formData);
  // }

  const onSubmitForm = async (formData: FormData) => {
    if (!coverProject?.length) return
    try {
      setLoadingState('loading');

      const linkBulk = JSON.stringify(coverProject);

      formData.set('link_bulk', linkBulk!)
      formData.set('showcaseType', 'photo')
      formData.set('project_id', project_id)

      await showcaseAction(formData);

      toast({
        title: "Success insert bulk showcase project",
      })

      // closeButton?.click();

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        toast({
          variant: "destructive",
          title: `Error create / edit showcase project`,
          description: error?.message
        })
      } else {
        console.error("Unexpected error:", error);
        toast({
          variant: "destructive",
          title: `Error create / edit showcase project`,
        })
      }
    } finally {
      setLoadingState('idle')
    }
  }

  const deletePhoto = async (url: string) => {
    await handleFileDelete(url);
    const filterImages = coverProject?.filter((cover) => cover !== url);
    setCoverProject(filterImages);
  }

  const onCloseModal = async (isOpen: boolean) => {
    if (!isOpen && coverProject?.length) {
      await Promise.all(
        coverProject?.map( async (cover) => {
          await handleFileDelete(cover);
        })
      )
    }
  }

  return (
    <Dialog onOpenChange={onCloseModal}>
      <DialogTrigger>
        <Button variant={"outline"}>
          <Icon icon="ic:outline-add-to-photos" className="text-2xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Insert Bulk Photo Showcase</DialogTitle>
        </DialogHeader>
        <hr />
        <form action={onSubmitForm}>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Showcase Photo</p>
              {coverProject?.length ? (
                <div className="flex gap-2 flex-wrap mx-auto">
                  {coverProject?.map((cover) => {
                    return (
                      <div className="relative">
                        <img src={cover} alt="" className="w-[12rem] h-[7rem] object-cover" />
                        <button className="p-1 rounded-full bg-white absolute top-1 right-1" onClick={() => deletePhoto(cover)}>
                          <Icon icon="maki:cross" className="text-[0.7rem] text-red-500 hover:text-red-400" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : ""}
              
              <div
                className="flex gap-4 relative w-[20rem] h-[7rem] mx-auto my-5"
                onMouseEnter={() => setHoverUploadPhoto(true)}
                onMouseLeave={() => setHoverUploadPhoto(false)}
              >
                <div className={cn(
                  'w-[20rem] h-[7rem] bg-slate-50 rounded-lg text-sm text-slate-800 text-center flex items-start justify-center pt-3',
                  hoverUploadPhoto && 'brightness-50'
                )}>
                  Import your photos
                </div>
                <div
                  className="flex flex-col gap-2 absolute"
                >
                  <UploadImage
                    id="hehe"
                    onImageUpload={uploadFile}
                    imageUploadState={imageUploadState}
                    disabled={false}
                    width='w-[20rem]'
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
          </div>
          <div className="w-full flex gap-2">
            {/* <Button variant={"outline"} className="w-full" type="button">Cancel</Button> */}
            <Button className="w-full" disabled={!coverProject?.length} type="submit">Save</Button>
          </div>
          <DialogClose asChild className='hidden'>
            <Button id='close-modal-showcase'>close</Button>
          </DialogClose>
        </form>
        
      </DialogContent>
    </Dialog>
  )
}

export default ModalAddBulkPhotoShowcase;
