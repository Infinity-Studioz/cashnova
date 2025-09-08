// cloudflare-loader.ts
import { ImageLoaderProps } from 'next/image'

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps): string {
  const params = [
    `f=auto`,
    `w=${width}`,
    quality && `q=${quality}`
  ].filter(Boolean).join(',');
  
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL || '';
  
  if (src.startsWith('/')) {
    return `${baseUrl}/cdn-cgi/image/${params}${src}`;
  }
  
  return src;
}