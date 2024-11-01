"use client";

import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/toast';
import { useRouter } from 'next/navigation';
import { socialAction } from '@/app/social/action';
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
import { ErrorInputTag } from '@/composables/validation.types';
import { Social } from '@/composables/social.types';
import { ProjectDetailType } from '@/composables/project.types';
import { deleteProject } from '@/app/projects/action';

interface ModalAddEditSocialType {
  data?: Partial<ProjectDetailType>;
}
const ModalDeleteProject: React.FC<ModalAddEditSocialType> = ({ data }) => {
  const { toast } = useToast()
  const router = useRouter()
  const [loadingState, setLoadingState] = useState<'loading'|'idle'>('idle');

  const onSubmit = async () => {
    try {
      setLoadingState('loading');
      const errors = [];
      const closeButton = document.getElementById("close-modal-social");

      data?.id && await deleteProject(data.id);
      toast({
        title: "Success delete project",
      })

      closeButton?.click();

      router.refresh()
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        toast({
          variant: "destructive",
          title: `Error delete project`,
          description: error?.message
        })
      } else {
        console.error("Unexpected error:", error);
        toast({
          variant: "destructive",
          title: `Error delete project`,
        })
      }
    } finally {
      setLoadingState('idle')
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={'destructive'} className="flex gap-1 items-center w-[10rem]">
          <Icon icon="tabler:trash" className="text-xl"/>
          Delete Project
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <hr />
        <p>
          Are you sure want to delete project <strong>{data?.title}</strong>?
          This action cannot be undone & all the project data will be deleted permanently.
        </p>
        <DialogFooter className='mt-5'>
          <DialogClose asChild className='hidden'>
            <Button id='close-modal-social'>close</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>
          <form action={onSubmit}>
            <Button type='submit' variant={'destructive'} disabled={loadingState === 'loading'}>
              {loadingState === 'loading' ? "Deleted..." : "Delete"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalDeleteProject
