# Temu Affiliate Links Hub

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- A landing page themed around "How I Make Passive Income Using Only My Phone"
- Hero section with headline and subheadline about phone-based passive income
- Affiliate product grid showcasing Temu product recommendations (phone/setup accessories)
- Each product card shows: image placeholder, product name, short description, price, and a CTA button linking to an affiliate URL
- Admin panel (password-protected) to add, edit, and remove affiliate product listings
- Each product has: name, description, price, affiliate URL, image URL, category
- Category filter tabs to browse products by type (e.g. Phone Accessories, Desk Setup, Lighting, etc.)
- "My Recommendations" intro section with a short bio/pitch

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Store affiliate product listings (name, description, price, affiliateUrl, imageUrl, category, isActive). Admin CRUD operations with a simple password check. Public read for active products.
2. Frontend: Public-facing page with hero, bio intro, category filter tabs, product card grid with affiliate link buttons. Admin page with login, product list management, add/edit/delete forms.
