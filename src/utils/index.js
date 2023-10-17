import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const hideString = (input, first = 15, second = -10) => {
	return `${input.slice(0, first)}…${input.slice(second)}`;
};
