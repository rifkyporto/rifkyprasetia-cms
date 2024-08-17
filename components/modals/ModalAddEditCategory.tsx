"use client";

import { createClient } from "@/utils/supabase/client"
import React, { ChangeEvent } from 'react'
import { useRouter } from "next/navigation";
import { ErrorInputTag } from "@/composables/validation.types";
import { CategoryDropdownType } from '@/composables/category.types';
import { categoryAction } from '@/app/category/action';
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
import { useToast } from "@/components/ui/toast"
import { Icon } from '@iconify/react';
import { Button } from '../ui/button'
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface ModalAddEditCategoryType {
  isEdit?: boolean
  data?: CategoryDropdownType
}
const ModalAddEditCategory: React.FC<ModalAddEditCategoryType> = ({ isEdit, data }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [inputValue, setInputValue] = React.useState<string>(data?.slug || '');
  const [errorFeedback, setErrorFeedback] = React.useState<ErrorInputTag[]>([]);
  const [loadingSubmit, setLoadingSubmit] = React.useState<'loading' | 'idle'>('idle');

  async function handleSave (formData: FormData) {
    try {
      console.log("hhh")
      setLoadingSubmit('loading');
      const errors = [];
      const closeButton = document.getElementById("close-modal-category");
      const name = formData.get('name') as string;

      if (!name) {
        errors.push({ message: 'Name is required', id: 'name' });
      }

      if (errors.length) {
        console.log("error", errors)
        setErrorFeedback(errors);
        return
      }

      setErrorFeedback([]);

      if (isEdit) {
        // Update existing category
        console.log("edit")
        formData.set('slug', data?.slug!)
        await categoryAction(formData, isEdit);
        toast({
          title: "Success edit category",
        })

        closeButton?.click();
        router.refresh()
      } else {
        await categoryAction(formData, false);
        toast({
          title: "Success create category",
        })

        closeButton?.click();
        router.refresh()
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        toast({
          variant: "destructive",
          title: `Error create / edit category`,
          description: error?.message
        })
      } else {
        console.error("Unexpected error:", error);
        toast({
          variant: "destructive",
          title: `Error create / edit category`,
        })
      }
    } finally {
      setLoadingSubmit('idle')
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value
      .toLowerCase()
      .replace(/ /g, '-')          // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove any character that's not a lowercase letter, number, or a hyphen

    // Update the state with the modified value
    setInputValue(value);
  };


  return (
    <Dialog>
      <DialogTrigger>
        {isEdit ? 
          <Icon icon="lucide:edit" className='text-xl cursor-pointer' />
          : <><Button variant={"outline"}>Add Category</Button></>
        }
      </DialogTrigger>
      <DialogContent className='min-w-[700px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Category</DialogTitle>
          {/* <DialogDescription>
            This action is used for save the project information. You can add the showcase photo / video or edit the project information later.
          </DialogDescription> */}
        </DialogHeader>
        <hr />
        <form action={handleSave}>
          <div className='flex flex-col gap-5'>
            <Label className='flex flex-col gap-2'>
              Category Name
              <Input id="name" name="name" className='lg:max-w-2xl' placeholder='Enter your category name' defaultValue={data?.name}/>
              {errorFeedback?.find((err) => err.id === 'name') && (
                <small className="text-red-500">
                  {errorFeedback.find((err) => err.id === "name")?.message }
                </small>
              )}
            </Label>
            {!isEdit && (
              <Label className='flex flex-col gap-2'>
                Category Slug (auto-generated)
                <Input id="slug" name="slug" onChange={handleInputChange} value={inputValue} className='lg:max-w-2xl' placeholder='Enter your slug name' defaultValue={data?.slug}/>
                <small className="">
                  You cannot edit this field once its already created
                </small>
                <small className="">
                  It will be auto-generated if this field is empty
                </small>
              </Label>
            )}
          </div>
          <DialogFooter className="mt-3">
            <DialogClose asChild className='hidden'>
              <Button id='close-modal-category'>close</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loadingSubmit === 'loading'}>
              {loadingSubmit === 'loading' ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalAddEditCategory
