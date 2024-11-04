"use client";

import React, { FC, useState } from 'react'
import { createClient } from '@/utils/supabase/client';
import { useToast } from './ui/toast';
import { Label } from '@/components/ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { IProfile } from '@/composables/profile.types';
import { ErrorInputTag } from '@/composables/validation.types';
import { isValidEmail } from '@/lib/utils';
import { UploadButton } from '@/utils/uploadthing';
import { deleteImageUploadthing } from '@/app/projects/action';

const ProfileClient = ({ profile }: { profile: IProfile }) => {
  const supabase = createClient();
  const { toast } = useToast()
  const [errorFeedback, setErrorFeedback] = useState<ErrorInputTag[]>([]);
  const [profileData, setProfileData] = useState<IProfile>(profile);
  const [profileImg, setProfileImg] = useState<string | ''>(profile?.profile_img || '')
  const [loadingSubmit, setLoadingSubmit] = React.useState<'loading' | 'idle'>('idle');
  const [errorUploadPhoto, setErrorUploadPhoto] = useState<string>('');

  const onSubmit = async (formData: FormData) => {
    try {
      setLoadingSubmit('loading');
      const errors = [];
      const closeButton = document.getElementById("close-modal-category");

      const display_name = formData.get('display_name') as string;
      const email = formData.get('email') as string;
      const mobile = formData.get('mobile') as string;
      const about = formData.get('about') as string;
      const copyright = formData.get('copyright') as string;

      if (!display_name) {
        errors.push({ message: 'Name is required', id: 'display_name' });
      }
      if (!email || !isValidEmail(email)) {
        errors.push({ message: 'Email is required and must be a valid email format', id: 'email' });
      }
      if (!mobile) {
        errors.push({ message: 'Mobile is required', id: 'mobile' });
      }
      if (!about) {
        errors.push({ message: '"About" description is required', id: 'about' });
      }
      if (!copyright) {
        errors.push({ message: 'Copyright is required', id: 'copyright' });
      }

      if (errors.length) {
        console.log("error", errors)
        setErrorFeedback(errors);
        return
      }

      if (!profile) {
        const { data, error } = await supabase
          .from('profile')
          .insert({
            id: process.env.NEXT_PUBLIC_SUPABASE_USER_ID,
            display_name,
            email,
            mobile,
            about,
            copyright
          })
          .select();

        setProfileData(data?.[0])
        toast({
          title: "Success create profile data",
        })
      } else {
        const { data, error } = await supabase
          .from('profile')
          .update({
            display_name,
            email,
            mobile,
            about,
            copyright
          })
          .eq('id', profile?.id).select()

        setProfileData(data?.[0])
        toast({
          title: "Success edit profile data",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error create / update data. hayo kenapa y xixi",
      })
    } finally {
      setLoadingSubmit('idle')
    }
  }

  const uploadProfileImg = async (res: any) => {
    const currentBanner = profileImg || '';
    setProfileImg(res?.url)
    await supabase
      .from('profile')
      .update({
        profile_img: res?.url,
        updated_at: new Date()
      })
      .eq('id', process.env.NEXT_PUBLIC_SUPABASE_USER_ID)
    
    const currentId = currentBanner ? currentBanner.split('/').pop() : null
    currentBanner && currentId && await deleteImageUploadthing(currentId)
  }

  return (
    <form action={onSubmit} className='flex flex-col w-full gap-5'>
      <div className='flex flex-col gap-3 lg:max-w-2xl'>
        <span className="font-[600]">Profile Image</span>
        <div className="flex flex-col gap-1 w-[300px] items-start">
          {profileImg && (
            <img
              src={profileImg}
              // src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
              alt="Vercel Logo"
              // fill
              // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
              // width={320}
              // height={100}
              // priority
              className="w-[300px] h-[157px] rounded-lg object-cover"
            />
          )}

          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              uploadProfileImg(res[0])
              // alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
              console.log({error: error.message})
              setErrorUploadPhoto("Failed to upload profile image. knp hayo xixi")
            }}
          />
        </div>
        {/* <small className="text-gray-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          *Note: this image will appear on project detail as a banner image. if you keep this custom banner empty, system will use project thumbnail as a banner image
        </small> */}
        {errorUploadPhoto && (
          <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {errorUploadPhoto}
          </small>
        )}
      </div>
      <Label className='flex flex-col gap-3'>
        Display Name
        <Input
          id='display_name'
          name='display_name'
          placeholder='Enter display name'
          className='lg:max-w-2xl'
          defaultValue={profileData?.display_name}
        />
        {errorFeedback?.find((err) => err.id === "display_name") && (
          <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {errorFeedback?.find((err) => err.id === "display_name")?.message}
          </small>
        )}
      </Label>
      <Label className='flex flex-col gap-3'>
        Email
        <Input
          id='email'
          name='email'
          placeholder='Enter your email'
          className='lg:max-w-2xl'
          defaultValue={profileData?.email}
        />
        {errorFeedback?.find((err) => err.id === "email") && (
          <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {errorFeedback?.find((err) => err.id === "email")?.message}
          </small>
        )}
      </Label>
      <Label className='flex flex-col gap-3'>
        Phone Number
        <Input
          id='mobile'
          name='mobile'
          placeholder='Enter your phone number'
          className='lg:max-w-2xl'
          defaultValue={profileData?.mobile}
        />
        {errorFeedback?.find((err) => err.id === "mobile") && (
          <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {errorFeedback?.find((err) => err.id === "mobile")?.message}
          </small>
        )}
      </Label>
      <Label className='flex flex-col gap-3'>
        Social Media Contact
        <Input
          id='title'
          name='title'
          placeholder='Enter your phone number'
          className='lg:max-w-2xl'
          // defaultValue={project?.title}
        />
        {/* {errorFeedback?.find((err) => err.id === "title") && (
          <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {errorFeedback?.find((err) => err.id === "title")?.message}
          </small>
        )} */}
      </Label>
      <Label className='flex flex-col gap-3'>
        About
        <Textarea
          id='about'
          name='about'
          placeholder='Who are you?'
          className='lg:max-w-2xl'
          defaultValue={profileData?.about}
        />
        {errorFeedback?.find((err) => err.id === "about") && (
          <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {errorFeedback?.find((err) => err.id === "about")?.message}
          </small>
        )}
      </Label>
      <Label className='flex flex-col gap-3'>
        Copyright
        {/* <div className='flex gap-1'>
          <Input className='' defaultValue={''}><p>&copy;</p></Input>
          <Input
            id='copyright'
            name='copyright'
            placeholder='Enter your copyright footer'
            className='lg:max-w-2xl'
            defaultValue={profileData?.copyright}
          />
        </div> */}
        <div className="relative lg:max-w-2xl">
          <div className="absolute left-3 top-1/2 -translate-y-1/2" dangerouslySetInnerHTML={{ __html: '&copy;' }} />
          <Input
            className="pl-8"
            // defaultValue=""
            id='copyright'
            name='copyright'
            placeholder='Enter your copyright footer'
            // className='lg:max-w-2xl'
            defaultValue={profileData?.copyright}
          />
        </div>
        {errorFeedback?.find((err) => err.id === "copyright") && (
          <small className="text-red-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {errorFeedback?.find((err) => err.id === "copyright")?.message}
          </small>
        )}
      </Label>
      <div className='lg:max-w-2xl flex justify-end'>
        <Button type="submit" disabled={loadingSubmit === 'loading'}>
          {loadingSubmit === 'loading' ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

export default ProfileClient;
