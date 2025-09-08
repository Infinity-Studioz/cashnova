// lib/cdn-utils.ts
export class CDNManager {
  private static baseUrl = process.env.CDN_URL || '';
  private static cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
  private static apiToken = process.env.CLOUDFLARE_API_TOKEN;

  // Generate optimized asset URLs
  static getAssetUrl(path: string): string {
    if (process.env.NODE_ENV === 'development') {
      return path;
    }
    
    // Remove leading slash and prepend CDN URL
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseUrl}/${cleanPath}`;
  }

  // Generate responsive image URLs for different screen sizes
  static getResponsiveImageUrls(imagePath: string) {
    const breakpoints = [640, 768, 1024, 1280, 1920];
    
    return {
      src: this.getAssetUrl(imagePath),
      srcSet: breakpoints
        .map(width => `${this.getAssetUrl(imagePath)}?w=${width} ${width}w`)
        .join(', '),
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    };
  }

  // Purge cache for specific URLs (useful for updates)
  static async purgeCache(urls: string[]): Promise<boolean> {
    if (!this.apiToken || !this.cloudflareZoneId) {
      console.warn('Cloudflare credentials not configured for cache purging');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.cloudflareZoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: urls }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Cache purge failed:', error);
      return false;
    }
  }

  // Preload critical assets for Nigerian users
  static preloadCriticalAssets() {
    const criticalAssets = [
      '/images/logos/cashnova-logo.svg',
      '/fonts/inter-var.woff2',
      '/_next/static/css/app.css' // Your main CSS bundle
    ];

    if (typeof window !== 'undefined') {
      criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = this.getAssetUrl(asset);
        
        // Set appropriate 'as' attribute
        if (asset.includes('.woff')) link.as = 'font';
        else if (asset.includes('.css')) link.as = 'style';
        else if (asset.includes('.js')) link.as = 'script';
        
        if (link.as === 'font') {
          link.crossOrigin = 'anonymous';
        }
        
        document.head.appendChild(link);
      });
    }
  }
}

// Helper function for Next.js Image component
export function getOptimizedImageProps(src: string, alt: string) {
  return {
    src: CDNManager.getAssetUrl(src),
    alt,
    loading: 'lazy' as const,
    ...CDNManager.getResponsiveImageUrls(src)
  };
}