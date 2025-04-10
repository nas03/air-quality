import { clsx, type ClassValue } from "clsx";
import proj4 from "proj4";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const convertCoordinate = (from: string, to: string, coordinate: [number, number] | undefined) => {
    if (!coordinate) return null;
    const [lon, lat] = proj4(from, to, coordinate);
    return [lat.toFixed(3), lon.toFixed(3)];
};

export const getRelativeTime = (timestamp: Date | string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

    if (diffInDays <= 31) {
        return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
};
