---
name: wire-endpoint
description: Connect a Next.js page to a Laravel client API using the backend Postman mapping. Use when replacing mock data, adding a fetch, or aligning forms with API request bodies.
---

# Wire a Next.js endpoint

1. Open `../backend/postman/FRONTEND-MAPPING.md` and find the page.
2. Open the matching Postman collection under `../backend/postman/collections/` for method, query, body, and example `data` shape.
3. Add or update a helper in `src/lib/api/` that calls `apiServiceCall` with `Accept-Language` and optional Bearer.
4. Replace mock arrays (`mockData.ts`, hardcoded page arrays, localStorage packages/wallet) with that helper.
5. Keep AR/EN rendering from API localized fields (Resource already returns the active locale string plus `*_ar`/`*_en` when needed).
6. If the form fields do not match Postman, stop and update **all four surfaces**: Filament, FormRequest/Resource, Postman, this page.

## Legacy paths to stop using

| Stop calling | Use instead |
|--------------|-------------|
| `home` still unused in UI | `GET home` and pass props into sections |
| `user/services` | `GET my/properties` |
| `user/create/services` | `POST my/properties` |
| `blog-posts` | `GET blogs` |
| `all-settings` | `GET general-settings` + dedicated about/terms/privacy |
| `auth/me` / `getProfile` | `GET profile` |
| `activate` | `POST auth/verify-otp` |
