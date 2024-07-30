import React from 'react'
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const Layout = async ({ children, className }: LayoutProps ) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className={className}>
      <Navbar />
      <div className='mx-10'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout;
