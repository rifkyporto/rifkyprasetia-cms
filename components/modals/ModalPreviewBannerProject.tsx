import React from 'react'
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
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { capitalizeFirstLetter } from '@/lib/utils'
import { Icon } from '@iconify/react'

const ModalPreviewBannerProject = ({ url, bgPosition, device }: { url: string, bgPosition: string, device: 'mobile' | 'desktop' }) => {
  console.log({bgPosition})
  return (
    <Dialog>
      <DialogTrigger className='w-full'>
        <Button type="button" variant={'outline'} className='w-full flex gap-2'>
          Preview {capitalizeFirstLetter(device)} Banner
          <Icon icon={device === "mobile" ? "fa:mobile" : "fa6-solid:desktop"} />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        '!w-[90%] overflow-y-scroll h-[95%]',
        device === "desktop" && "max-w-[90%]",
        device === "mobile" && '!sm:w-[440px] sm:max-w-[440px] max-w-[90%]'
      )}>
        <DialogHeader>
          <DialogTitle>Preview Banner Image</DialogTitle>
        </DialogHeader>
        <hr />
        <div 
          className={`h-[50rem] w-full bg-no-repeat bg-cover ${bgPosition} overflow-y-scroll`}
          style={{
            backgroundImage: `url("${url}")`,
            backgroundPosition: bgPosition
          }}
        >

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalPreviewBannerProject