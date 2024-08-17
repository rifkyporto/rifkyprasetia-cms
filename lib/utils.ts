import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ShowcaseType } from "@/composables/showcase.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const reorderDragNDrop = (list: Partial<ShowcaseType>[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
