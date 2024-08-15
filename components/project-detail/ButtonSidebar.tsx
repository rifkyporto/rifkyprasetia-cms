"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button';

interface ButtonSidebar  {
  title: string;
  queryType: string;
}
const ButtonSidebar: React.FC<ButtonSidebar> = ({ queryType, title }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  return (
    <Button
      // key={item.href}
      // href={item.href}
      className={cn(
        buttonVariants({ variant: "default" }),
        type === queryType || (!type && queryType === "information")
          ? "bg-muted hover:bg-muted"
          :"hover:bg-transparent bg-transparent ",
        "justify-start text-black"
      )}
      onClick={() => {
        router.push(`?type=${queryType}`)
      }}
    >
      {title}
    </Button>
  )
}

export default ButtonSidebar