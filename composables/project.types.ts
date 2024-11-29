import { IProjectCategories } from "./project-categories.type";

export type ProjectDetailType = {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  category_label: string;
  role: string;
  client_name: string;
  date_month_project: string;
  link_teaser: string;
  is_video_istrailer: boolean;
  cover_image_url: string;
  banner_url: string;
  position: number;
  created_at: Date;
  updated_at: Date;
  additional_fields: string;
  banner_Yaxis: number;
  banner_Xaxis: number;

  project_categories: IProjectCategories[];
}
