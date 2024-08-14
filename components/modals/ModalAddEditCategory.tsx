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
// import { MonthPicker, MonthInput } from 'react-lite-month-picker';
import { Icon } from '@iconify/react';
import { Button } from '../ui/button'
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface ModalAddEditCategoryType {
  isEdit?: boolean
}
const ModalAddEditCategory: React.FC<ModalAddEditCategoryType> = ({ isEdit }) => {

  const [isMounted, setIsMounted] = useState(false);
  const [selectedMonthData, setSelectedMonthData] = useState({
    month: 9,
    year: 2023,
  });


  const [isPickerOpen, setIsPickerOpen] = useState(false);


  useEffect(() => {
    setIsMounted(true); // Ensure component mounts on the client
  }, []);

  // Return null if not mounted to avoid server-client mismatch
  if (!isMounted) return null;

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
        <div className='flex flex-col gap-5'>
          <Label className='flex flex-col gap-2'>
            Category Name
            <Input className='lg:max-w-2xl' placeholder='Enter your category name'/>
          </Label>
          <Label className='flex flex-col gap-2'>
            Category Slug (auto-generated)
            <Input className='lg:max-w-2xl' placeholder='Enter your slug name'/>
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalAddEditCategory
