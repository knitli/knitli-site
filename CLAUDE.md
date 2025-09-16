# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static marketing website for Knitli Inc., built with vanilla HTML, CSS, and JavaScript. The site showcases Knitli's upcoming AI development tools: CodeWeaver (a model context protocol server) and Thread (a codebase intelligence tool).

## Architecture

### Project Structure
```
knitli-marketing/
├── package.json              # Project metadata and dependencies
├── frontend/                 # Main website files
│   ├── index.html           # Single-page marketing site
│   ├── assets/              # Compiled/optimized assets
│   │   ├── main.css        # Main stylesheet (Carrd-generated)
│   │   ├── main.js         # Interactive JavaScript (Carrd-generated)
│   │   ├── noscript.css    # Fallback styles for no-JS
│   │   ├── icons.svg       # SVG sprite for icons
│   │   └── images/         # Optimized web images
│   └── asset_production/    # Source files for asset creation
│       ├── *.xcf           # GIMP project files
│       └── *.svg           # Source SVG files
└── favicon files            # Web app icons and manifests
```

### Technology Stack
- **Frontend Framework**: Vanilla HTML5/CSS3/JavaScript (Carrd-generated)
- **Analytics**: PostHog (client-side tracking)
- **Email Signup**: ConvertKit integration
- **Icons**: SVG sprite system
- **Images**: Multi-format optimization (WebP, PNG, JPG)

### Key Technical Details

#### Static Site Architecture
- Single-page application with scroll-based sections
- Progressive image loading with base64 placeholders
- Client-side form handling with PostHog event tracking
- Responsive design with mobile-first approach

#### Asset Management
- **Production Assets**: `/frontend/assets/` - optimized for web delivery
- **Source Assets**: `/frontend/asset_production/` - GIMP/SVG source files for design iteration
- **Image Optimization**: Multiple formats (WebP, PNG, JPG) with appropriate fallbacks
- **Icon System**: SVG sprite (`icons.svg`) for scalable vector graphics

#### External Integrations
- **PostHog Analytics**: Configured with public key for user tracking
- **ConvertKit Email**: Form integration for newsletter signup
- **Social Links**: X/Twitter, LinkedIn, GitHub profiles

## Development Workflow

### Local Development
```bash
# Option 1: Use npm script (recommended)
npm run dev              # Uses npx serve on port 3000
npm start               # Alias for npm run dev

# Option 2: Python server (alternative)
npm run dev:python      # Uses Python's http.server on port 3000

# Option 3: Manual commands
cd frontend && python3 -m http.server 3000    # Python 3
npx serve frontend -l 3000                    # Node.js serve package
```

The site will be available at http://localhost:3000

### Testing
```bash
npm test  # Currently returns "no test specified" error
```
Note: No formal testing framework is configured. Testing is manual through browser testing.

### Asset Creation Workflow
1. Edit source files in `frontend/asset_production/`
2. Export optimized versions to `frontend/assets/`
3. Update references in `index.html` if needed

## Content Management

### Site Content Structure
The site follows a storytelling marketing structure:
1. **Hero Section**: "Save the tokens" value proposition
2. **Problem Definition**: AI context/token waste explanation
3. **Solution Preview**: Upcoming tools (CodeWeaver & Thread)
4. **Email Signup**: ConvertKit integration for lead capture

### Marketing Copy Guidelines
- Focus on developer pain points with AI token costs
- Technical accuracy about AI context limitations
- Open-source-first messaging
- Clear product differentiation (CodeWeaver vs Thread)

### Brand Elements
- **Primary Colors**: Purple/blue theme with yellow accents
- **Typography**: IBM Plex Sans, Geist Mono, Special Elite fonts
- **Voice**: Technical but accessible, developer-focused
- **Imagery**: Robot/AI themed illustrations, code/development visuals

## Dependencies

### Runtime Dependencies
- `posthog-js`: Client-side analytics and event tracking

### External Resources
- Google Fonts (IBM Plex Sans, Geist Mono, Special Elite, Inconsolata)
- ConvertKit forms API for email collection
- PostHog US instance for analytics

## Important Notes

- **No Build System**: This is a static site with no compilation step
- **Carrd Generated**: The HTML/CSS/JS structure follows Carrd's patterns
- **Single Page**: All content is in one HTML file with scroll-based navigation
- **Mobile Responsive**: Designed mobile-first with breakpoint optimizations
- **SEO Optimized**: Includes proper meta tags, Open Graph, and structured data

## Deployment to Cloudflare Pages

### Pre-Deployment Checklist
✅ **JavaScript Issues Fixed**: PostHog module import, exports errors resolved
✅ **Images Working**: All robot images (confused, hamster, happy) displaying correctly
✅ **Background Isolated**: Typewriter background only on hero section
✅ **Text Readability**: Clean hero section with readable title and CTA
✅ **Mobile Responsive**: Responsive design tested and working

### Cloudflare Pages Setup
1. **Repository Connection**: Connect your GitHub repository to Cloudflare Pages
2. **Build Settings**:
   - **Build command**: `(none)` - No build step required
   - **Build output directory**: `frontend/`
   - **Root directory**: Leave empty or set to `/`
3. **Custom Domain**: Configure your custom domain in Cloudflare Pages settings
4. **Environment Variables**: None required for this static site

### Deployment Files
All files in the `frontend/` directory are ready for deployment:
- `index.html` - Main site file (17KB)
- `assets/` - CSS, JS, and optimized images (~5MB total)
- `favicon.*` - App icons and web manifest files

### Post-Deployment Verification
- [ ] Site loads without JavaScript errors
- [ ] All images display correctly
- [ ] PostHog analytics working
- [ ] ConvertKit form submission working
- [ ] Mobile responsive design functioning
- [ ] All internal scroll links working

## Future Development Considerations

- Consider implementing a proper testing framework for JavaScript functionality
- Potential migration to a static site generator (e.g., Next.js, Astro) for better maintainability
- Image optimization automation could be beneficial for the asset workflow
- A/B testing framework integration for marketing optimization