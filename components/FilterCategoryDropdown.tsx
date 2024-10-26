"use client";

import React, { useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryDropdownType } from '@/composables/category.types';

const FilterCategoryDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("type") || "");
  const supabase = createClient();

  const [projectCategories, setProjectCategories] = useState<Partial<CategoryDropdownType>[]>([])

  const fetchCategory = async () => {
    const { data: categories, error } = await supabase
      .from('category') // Adjust this to your table name
      .select(`
        name,
        slug
      `)
      .eq("user_id", `${process.env.NEXT_PUBLIC_SUPABASE_USER_ID!}`)
      // .ilike("user_id", `${process.env.NEXT_PUBLIC_SUPABASE_USER_ID!}`)
    
    console.log({categories, uid: process.env.NEXT_PUBLIC_SUPABASE_USER_ID})

    if (categories) {
      setProjectCategories([
        { name: "All", slug: "all" },
        ...(categories?.map((category: Partial<CategoryDropdownType>) => category))
      ])
    }
    
    return categories;
  }

  useEffect(() => {
    // const paramSearch = searchParams.get("search")
    // const timeoutId = setTimeout(() => {
    //   router.replace(`/?search=${paramSearch}&type=${searchQuery}`);
    // }, 300); // Update the URL 300ms after the user stops typing
    // router.replace(`/?search=${paramSearch}&type=${searchQuery}`);
    router.replace(`/?type=${searchQuery}`);
    // return () => clearTimeout(timeoutId);
  }, [searchQuery, router]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SUPABASE_USER_ID) {
      const categories = fetchCategory()
      console.log({categories})
    }
    
  }, [])

  return (
    <Select
      onValueChange={(value) => {
        if (value === "all") setSearchQuery('')
        else setSearchQuery(value)
      }}
      defaultValue={searchQuery}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        {projectCategories?.map((category: Partial<CategoryDropdownType>) => (
          <SelectItem value={category.slug!}>{category.name}</SelectItem>
        ))}
        {/* <SelectItem value="all">All</SelectItem>
        <SelectItem value="short-movie">Short Movie</SelectItem>
        <SelectItem value="music-video">Music Video</SelectItem>
        <SelectItem value="commercial">Commercial</SelectItem>
        <SelectItem value="fashion">Fashion</SelectItem>
        <SelectItem value="others">Others</SelectItem> */}
      </SelectContent>
    </Select>
  )
}

export default FilterCategoryDropdown;
