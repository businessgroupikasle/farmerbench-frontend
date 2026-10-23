# AgriEra (P2) - Jira status + comments

Status to set: **Done** unless marked otherwise. All changes are uncommitted in the working folder.

| Issue | Status | Comment |
| :--- | :--- | :--- |
| P2-1 | Done | Weather card now opens new /weather page (live Coimbatore forecast). Calendar and Market Price links verified. |
| P2-2 | Done | Products page now takes category/search from the URL only, so stale filters no longer affect results. |
| P2-3 | Done | Removed the extra "Menu" pill from the dashboard bar; header hamburger is the only Menu. |
| P2-4 | Done | Compare bar moved above the mobile bottom nav and AgriEra AI button. |
| P2-5 | Done | Compare bar no longer overlaps category tabs / AI button on desktop and mobile. |
| P2-6 | Done | Coupon / Promo input with Apply moved above Total Payable on Checkout; discount shown separately. |
| P2-7 | Done | All active menu items use the same highlighted-box style. |
| P2-8 | Done | Category arrows removed; top padding added so cards are not clipped. |
| P2-9 | Done | Browser built-in clear icon hidden, only the custom X remains. |
| P2-10 | Done | Footer "All Products" opens all products (stale category filter fixed). |
| P2-11 | Done | Fixed broken tel: link; address is a Maps link. |
| P2-12 | Done | Learn More now goes to /services. |
| P2-13 | Done | Effective dates are now configurable in Admin > Settings > Shipping (new DB columns + migration 20261023120000). Pages read them from the API. Backend restart + prisma migrate deploy required. |
| P2-14 | Done | Backend returns "No account found with this email. Create an account to continue." for unknown emails. |
| P2-15 | Done (config needed) | Signup OTP calls now use VITE_API_BASE_URL instead of localhost. Set it to the deployed API in the production build. |
| P2-16 | Done | Header actions never clip; compact layout for translated labels; language selector excluded from translation. |
| P2-17 | Done | Visible Sign Out button in header when logged in; Login / Register when logged out. |
| P2-18 | **Keep open** | Code reads VITE_YOUTUBE_URL; real channel URL still to be set. |
| P2-19 | Done | "???" replaced with an em dash. |
| P2-20 | Done | FAQ search also matches category, so "services" shows all 3. |
| P2-21 | Done | CTA renamed "Request a Callback"; success message states 15 minutes. |
| P2-22 | Done | Location becomes a dropdown when a pincode has several localities. |
| P2-23 | Done | Broken characters removed below Pincode field. |
| P2-24 | Done | Terms/declaration validation now shows an AgriEra-styled modal instead of the browser alert. |
| P2-25 | Done | Follow-Up date is dynamic (request date + 7 days). |
| P2-26 | Done | Removed redundant sidebar cards from Crop Doctor. |
| P2-27 | Done | Uploaded photos show as thumbnails with remove option. |
| P2-28 | Done | CLS fixed by reserving page height during lazy load (about 0.65 to 0.001). |
| P2-29 | **Not done** | Crop Calendar hero banner restyle not implemented. |
| P2-30 | Done | Google Maps link opens the full saved address. |
| P2-31 | **Keep open** | Needs pincode-based delivery rates in the backend; only flat fee exists. |
| P2-32 | Done | Shows "Item saved for later"; duplicate "removed" toast removed. |
| P2-33 | Done | Wishlist link added to user menu and mobile drawer. |
| P2-34 | Done | Hero no longer hidden behind the fixed search bar on mobile. |
| P2-35 | Done | Steps 1-4 all visible on mobile. |
| P2-36 | Done | Footer has bottom padding above the mobile nav. |
| P2-37 to P2-42 | Done | Garbled characters fixed; dashboard date is dynamic; invoice toast and payment status updated (P2-39/40). |
| P2-43 | Done | Customer status shown once. |
| P2-44 | Done | Customer search is null-safe and matches name/email/phone/location. |
| P2-45 | Done | Call Agronomist dials the number or shows "contact number is not available". |
| P2-46 | Done | Mobile number field added to Register Agronomist. |
| P2-47 | Done | Neutral default avatar. |
| P2-48 | Done | Duplicate place names removed from location. |
| P2-49 to P2-52 | Done | Garbled separators/icons fixed. |
