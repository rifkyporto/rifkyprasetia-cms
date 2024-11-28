
import { createClient } from "@/utils/supabase/server";

export const isSupabaseUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    // Get the Supabase project URL from environment variable
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return false;

    // Check if the URL contains the Supabase storage path
    return url.includes(`${supabaseUrl}/storage/v1/object/public/`);
  } catch (error) {
    console.error('Error checking Supabase URL:', error);
    return false;
  }
};

export const getStoragePathFromUrl = (url: string): string | null => {
  try {
    if (!isSupabaseUrl(url)) return null;

    // Extract the path after "public/"
    const matches = url.match(/public\/(.*)/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Error extracting storage path:', error);
    return null;
  }
};

export const deleteFileFromSupabase = async (url: string): Promise<boolean> => {
  const supabase = createClient();

  try {
    if (!isSupabaseUrl(url)) {
      console.warn('Not a Supabase URL:', url);
      return false;
    }

    const path = getStoragePathFromUrl(url);
    if (!path) {
      console.warn('Could not extract storage path from URL:', url);
      return false;
    }
    console.log({path})
    // Get bucket name from path (first segment)
    const [bucket, ...remainingPath] = path.split('/');
    const filePath = remainingPath.join('/');
    console.log({bucket, filePath})
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFileFromSupabase:', error);
    return false;
  }
};

// Example usage in a Next.js component or API route
export const handleFileDelete = async (fileUrl: string) => {
  console.log({check: isSupabaseUrl(fileUrl)})
  if (isSupabaseUrl(fileUrl)) {
    const success = await deleteFileFromSupabase(fileUrl);
    if (success) {
      console.log('File successfully deleted from Supabase storage');
    } else {
      console.error('Failed to delete file from Supabase storage');
    }
  } else {
    console.log('URL is not from Supabase storage');
  }
};

export const revalidatePage = async (path: string) => {
  const responseRevalidate = await fetch(`https://rifkyprasetia-portfolio.vercel.app/api/revalidate?path=${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const responseRevalidateJson = await responseRevalidate.json()
  console.log({responseRevalidateJson})

  const responseRevalidate2 = await fetch(`https://rifkyprasetia.com/api/revalidate?path=${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const responseRevalidateJson2 = await responseRevalidate2.json()
  console.log({responseRevalidateJson2})
}
