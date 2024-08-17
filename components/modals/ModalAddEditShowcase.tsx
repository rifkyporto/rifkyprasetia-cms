"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState, ChangeEvent } from 'react'
import { cn } from '@/lib/utils';
import { useToast } from '../ui/toast';
import { useRouter } from 'next/navigation';
import { socialAction } from '@/app/social/action';
import { showcaseAction } from '@/app/projects/action';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { SOCIALLIST } from '@/common/socials';
import { ErrorInputTag } from '@/composables/validation.types';
import { Social } from '@/composables/social.types';
import UploadImage from '../UploadImage';
import { ShowcaseType } from "@/composables/showcase.types";

interface ModalAddEditSocialType {
  isEdit?: boolean;
  data?: Partial<ShowcaseType>;
  project_id: string;
}
const ModalAddEditShowcase: React.FC<ModalAddEditSocialType> = ({ isEdit, data, project_id }) => {
  const { toast } = useToast()
  const supabase = createClient();
  const router = useRouter()
  const [errorFeedback, setErrorFeedback] = useState<ErrorInputTag[]>([])
  const [isMounted, setIsMounted] = useState(false);
  const [loadingState, setLoadingState] = useState<'loading'|'idle'>('idle');
  const [showcaseType, setShowcaseType] = useState<string>(
    data?.is_video === true ? 'video' : 'photo'
  );

  const [hoverUploadPhoto, setHoverUploadPhoto] = useState<boolean>(false);
  const [imageUploadState, setImageUploadState] = useState<"loading" | "idle">('idle')
  const [errorUploadPhoto, setErrorUploadPhoto] = useState<string>('');
  const [coverProject, setCoverProject] = useState<string>('');

  const [linkYoutube, setLinkYoutube] = useState<string>(data?.is_video && data?.link ? data?.link : '');


  console.log({project_id})
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

  const onSubmit = async (formData: FormData) => {
    try {
      setLoadingState('loading');
      const errors = [];
      const closeButton = document.getElementById("close-modal-showcase");
      const link = formData.get('link') as string;

      if (!link && showcaseType === 'video') {
        errors.push({ message: 'Showcase link is required', id: 'link' });
      }
      if (!coverProject && showcaseType === 'photo') {
        errors.push({ message: 'Showcase photo is required', id: 'link' });
      }
      if (!showcaseType) {
        errors.push({ message: 'Showcase type is required', id: 'showcaseType' });
      }
      console.log({showcaseType, link})
      if (errors.length) {
        console.log("error", errors)
        setErrorFeedback(errors);
        return
      }

      if (showcaseType === 'photo') formData.set('link', coverProject)
      formData.set('showcaseType', showcaseType)
      formData.set('project_id', project_id)

      setErrorFeedback([]);

      // formData.set('key', social)

      if (isEdit && data?.id) {
        // Update existing category
        formData.set('id', data?.id);

        await showcaseAction(formData);
        toast({
          title: "Success edit showcase project",
        })

        closeButton?.click();
      } else {
        await showcaseAction(formData);
        toast({
          title: "Success create showcase project",
        })

        closeButton?.click();
      }

      router.refresh()
    } catch (error: unknown) {
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

  return (
    <Dialog>
      <DialogTrigger>
        {isEdit ? 
          <Icon icon="lucide:edit" className='text-xl cursor-pointer' />
          : <><Button variant={"outline"}>Add Showcase</Button></>
        }
      </DialogTrigger>
      <DialogContent className='min-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Showcase</DialogTitle>
        </DialogHeader>
        <hr />
        <form action={onSubmit}>
          <div className='flex flex-col gap-5'>
            <Label className='flex flex-col gap-2'>
              Showcase Type
              <Select onValueChange={(val) => setShowcaseType(val)} defaultValue={showcaseType}>
                <SelectTrigger className="lg:max-w-2xl outline-none focus:shadow-outline p-2 placeholder:text-gray-400 flex">
                  <SelectValue placeholder="Select showcase project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              {errorFeedback?.find((err) => err.id === 'showcaseType') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "showcaseType")?.message }
                </small>
              )}
            </Label>
            {showcaseType === 'video' && (
              <>
                <Label className='flex flex-col gap-2'>
                  Link Showcase
                  <Input id='link' name='link' defaultValue={data?.link}  className='lg:max-w-2xl' placeholder='Enter your link showcase'/>
                  {errorFeedback?.find((err) => err.id === 'link') && (
                    <small className="text-red-500">
                      {errorFeedback.find((err) => err.id === "link")?.message }
                    </small>
                  )}
                </Label>
                {/* {linkYoutube && (
                  <iframe
                    width="500"
                    height="300"
                    src={`${linkYoutube}?rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className='m-0'
                  ></iframe>
                )} */}
              </>
            )}
            {showcaseType === 'photo' && (
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Showcase Photo</p>
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
            )}
          </div>
          <DialogFooter className='mt-5'>
            <DialogClose asChild className='hidden'>
              <Button id='close-modal-showcase'>close</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button type='submit' disabled={loadingState === 'loading'}>{loadingState === 'loading' ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
        
      </DialogContent>
    </Dialog>
  )
}

export default ModalAddEditShowcase
