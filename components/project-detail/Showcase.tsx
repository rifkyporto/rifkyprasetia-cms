"use client";

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Showcase = () => {
  return (
    <div className='flex flex-col w-full gap-5'>
      <p className='text-2xl'>Project Showcase</p>
      <hr className='lg:max-w-2xl'/>
      <Label className='flex flex-col gap-3'>
        Link Video
        <Input placeholder='Enter your link video of your project' className='lg:max-w-2xl' />
      </Label>
      
      <Label className='flex flex-col gap-3'>
        Photos
        <img
          src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
          alt="Vercel Logo"
          // fill
          // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
          // width={320}
          // height={100}
          // priority
          className="lg:max-w-2xl rounded-lg"
        />
        <img
          src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
          alt="Vercel Logo"
          // fill
          // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
          // width={320}
          // height={100}
          // priority
          className="lg:max-w-2xl rounded-lg"
        />
        <img
          src="https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"
          alt="Vercel Logo"
          // fill
          // className={`dark:invert ${isOverlayInspect && "grayscale"} transition-all duration-500 w-[100%] h-auto`}
          // width={320}
          // height={100}
          // priority
          className="lg:max-w-2xl rounded-lg"
        />
      </Label>
    </div>
  )
}

export default Showcase