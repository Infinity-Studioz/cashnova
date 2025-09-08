# Recommended public/ directory structure for CDN optimization

public/
├── images/
│   ├── logos/
│   │   ├── cashnova-logo.svg          # Vector for scalability
│   │   ├── cashnova-icon.png          # Multiple sizes
│   │   └── cashnova-favicon.ico
│   ├── ui/
│   │   ├── placeholder-avatar.webp    # Modern format
│   │   ├── empty-state-goals.webp
│   │   └── nigerian-context/
│   │       ├── naira-symbol.svg
│   │       └── lagos-skyline.webp
│   └── onboarding/
│       ├── dashboard-preview.webp
│       └── feature-highlights.webp
├── fonts/
│   ├── inter-var.woff2               # Variable font for performance
│   └── inter-fallback.woff2
├── icons/
│   ├── manifest-192.png              # PWA icons
│   ├── manifest-512.png
│   └── apple-touch-icon.png
└── static/
    ├── robots.txt
    ├── sitemap.xml
    └── security.txt

# File naming convention for cache busting:
# Use descriptive names + version/hash when needed
# Example: cashnova-logo-v2.svg, dashboard-bg-2024.webp