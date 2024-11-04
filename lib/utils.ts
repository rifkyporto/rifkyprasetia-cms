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

export const capitalizeFirstLetter = (string: string) => string?.charAt(0).toUpperCase() + string?.slice(1);
export function isValidEmail(email: string) {
  // eslint-disable-next-line
  const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}
