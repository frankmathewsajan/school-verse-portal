import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to handle file downloads
export function downloadFile(url: string, filename?: string) {
  if (!url) {
    console.error('No file URL provided');
    return;
  }

  try {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    
    // Set download attribute to suggest filename
    if (filename) {
      link.download = filename;
    }
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Fallback to opening in new tab
    window.open(url, '_blank');
  }
}
