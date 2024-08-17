"use client";

import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/toast';
import { useRouter } from 'next/navigation';
import { socialAction } from '@/app/social/action';
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
interface ModalAddEditSocialType {
  isEdit?: boolean;
  data?: Partial<Social>;
}
const ModalAddEditSocial: React.FC<ModalAddEditSocialType> = ({ isEdit, data }) => {
  const { toast } = useToast()
  const router = useRouter()
  const [errorFeedback, setErrorFeedback] = useState<ErrorInputTag[]>([])
  const [isMounted, setIsMounted] = useState(false);
  const [loadingState, setLoadingState] = useState<'loading'|'idle'>('idle');
  const [social, setSocial] = useState<string>(data?.key || '');

  useEffect(() => {
    setIsMounted(true); // Ensure component mounts on the client
  }, []);

  // Return null if not mounted to avoid server-client mismatch
  if (!isMounted) return null;

  const onSubmit = async (formData: FormData) => {
    try {
      setLoadingState('loading');
      const errors = [];
      const closeButton = document.getElementById("close-modal-social");
      const username = formData.get('username') as string;

      if (!username) {
        errors.push({ message: 'Username is required', id: 'username' });
      }
      if (!social) {
        errors.push({ message: 'Social media is required', id: 'social' });
      }
      console.log({social, username})
      if (errors.length) {
        console.log("error", errors)
        setErrorFeedback(errors);
        return
      }

      setErrorFeedback([]);

      formData.set('key', social)

      if (isEdit && data?.id) {
        // Update existing category
        formData.set('id', data?.id);

        await socialAction(formData);
        toast({
          title: "Success edit social media",
        })

        closeButton?.click();
      } else {
        await socialAction(formData);
        toast({
          title: "Success create social media",
        })

        closeButton?.click();
      }

      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        toast({
          variant: "destructive",
          title: `Error create / edit social media`,
          description: error?.message
        })
      } else {
        console.error("Unexpected error:", error);
        toast({
          variant: "destructive",
          title: `Error create / edit social media`,
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
          : <><Button variant={"outline"}>Add Social Media</Button></>
        }
      </DialogTrigger>
      <DialogContent className='min-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Social Media</DialogTitle>
        </DialogHeader>
        <hr />
        <form action={onSubmit}>
          <div className='flex flex-col gap-5'>
            <Label className='flex flex-col gap-2'>
              Social Media
              <Select onValueChange={(val) => setSocial(val)} defaultValue={data?.key}>
                <SelectTrigger className="lg:max-w-2xl outline-none focus:shadow-outline p-2 placeholder:text-gray-400 flex">
                  <SelectValue placeholder="Select social media" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIALLIST?.map((social) => (
                    <SelectItem value={social.socialKey}>
                      <div className='flex items-center gap-2'>
                        <Icon icon={social.logo} className={`${social.color} text-lg`}/>
                        <p>{social.socialName}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errorFeedback?.find((err) => err.id === 'social') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "social")?.message }
                </small>
              )}
            </Label>
            <Label className='flex flex-col gap-2'>
              Social Media Username
              <Input id='username' name='username' defaultValue={data?.username} className='lg:max-w-2xl' placeholder='Enter your social username'/>
              {errorFeedback?.find((err) => err.id === 'username') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "username")?.message }
                </small>
              )}
            </Label>
          </div>
          <DialogFooter className='mt-5'>
            <DialogClose asChild className='hidden'>
              <Button id='close-modal-social'>close</Button>
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

export default ModalAddEditSocial
