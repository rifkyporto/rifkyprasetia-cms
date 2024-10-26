import { CategoryDropdownType } from "./category.types";
import { ProjectDetailType } from "./project.types";

export interface IProjectCategories {
  id: string;
  category_id: string;
  project_id: string;
  position: number;

  category: CategoryDropdownType;
  projects: ProjectDetailType;
}
