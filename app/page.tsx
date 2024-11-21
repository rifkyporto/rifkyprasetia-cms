import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Projects from "@/components/Projects";
import Categories from "@/components/Categories";
import Socials from "@/components/Socials";
import Profile from "@/components/Profile";

export const dynamic = "force-dynamic";

export default async function Index({ searchParams }: { searchParams: { search?: string } }) {
  return (
    <Layout className="w-full flex flex-col gap-10 ">

      <div className="flex flex-col gap-20 px-3">
      <Tabs defaultValue="project" className="w-full">
        <TabsList>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="socials">Socials</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="project">
          <Projects searchParams={searchParams} />
        </TabsContent>
        <TabsContent value="category">
          <Categories />
        </TabsContent>
        <TabsContent value="socials">
          <Socials />
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
      </Tabs>
      </div>

    </Layout>
  );
}
 