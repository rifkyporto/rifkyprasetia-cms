"use client"; // This makes the component a client component

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace(`/?search=${searchQuery}`);
    }, 300); // Update the URL 300ms after the user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, router]);

  return (
    <Input
      className="mb-5 focus:border-0"
      placeholder="Search project by name"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};

export default SearchInput;
