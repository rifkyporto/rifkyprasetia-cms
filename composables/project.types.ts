import { IProjectCategories } from "./project-categories.type";

export type ProjectDetailType = {
  id: string;
  title: string;
  category_id: string;
  role: string;
  client_name: string;
  date_month_project: string;
  link_teaser: string;
  cover_image_url: string;
  banner_url: string;
  position: number;
  created_at: Date;
  updated_at: Date;

  project_categories: IProjectCategories[];
}
