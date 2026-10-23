# AgriEra (P2) - Master Task & Bug Resolution Specification
> **Generated for:** Developer / Claude Codebase Correction  
> **Source:** Jira Project **AgriEra** (`P2`) at `https://ramyaikasle.atlassian.net`  
> **Total Tasks:** 52 Issues | **Status:** All in **To Do**  
> **Project Scope:** `farmer_frontend` & `farmer_backend`

---

## Instructions for Claude / Developer
When fixing each task:
1. Verify the exact file location mentioned under **File Pointers**.
2. Follow the **Expected Result** to ensure full compliance with the user's requirements.
3. Clean up broken UTF-8/latin1 mojibake characters (e.g. `â€”` to `—`, `âš¡` to lightning bolt, `â€¢` to `•`).
4. Validate responsive mobile layouts (375px - 768px) where specified.
5. Mark the task checkbox `[ ]` as `[x]` once resolved and tested.

---

## Executive Summary & Priority Matrix

| Priority | Count | Issue Keys |
| :--- | :---: | :--- |
| **Highest** | 1 | `P2-15` |
| **High** | 5 | `P2-5`, `P2-16`, `P2-17`, `P2-32`, `P2-35` |
| **Medium** | 29 | `P2-1`, `P2-2`, `P2-3`, `P2-4`, `P2-6`, `P2-8`, `P2-12`, `P2-13`, `P2-18`, `P2-23`, `P2-24`, `P2-25`, `P2-28`, `P2-33`, `P2-38`, `P2-39`, `P2-40`, `P2-41`, `P2-42`, `P2-43`, `P2-44`, `P2-45`, `P2-46`, `P2-47`, `P2-48`, `P2-49`, `P2-50`, `P2-51`, `P2-52` |
| **Low / Lowest** | 17 | `P2-7`, `P2-9`, `P2-10`, `P2-11`, `P2-14`, `P2-19`, `P2-20`, `P2-21`, `P2-22`, `P2-26`, `P2-27`, `P2-29`, `P2-30`, `P2-31`, `P2-34`, `P2-36`, `P2-37` |

---

## Quick Navigation Index

| Issue ID | Priority | Type | Summary | Target Module |
| :--- | :---: | :---: | :--- | :--- |
| [P2-1](#p2-1) | **Medium** | Bug | Home Page – Crop Calendar, Weather Update and Daily Market Price cards redirect to incorrect pages | Home Page |
| [P2-2](#p2-2) | **Medium** | Bug | Module: Product Catalogue – Search | Product Catalogue |
| [P2-3](#p2-3) | **Medium** | Bug | Module: Profile – Mobile View | Profile |
| [P2-4](#p2-4) | **Medium** | Bug | Module: Product Comparison – Mobile View | Product Comparison |
| [P2-5](#p2-5) | **High** | Bug | Module: Product Listing / Product Comparison | Product Listing / Product Comparison |
| [P2-6](#p2-6) | **Medium** | Bug | Module: Checkout – Coupon / Promo Code | Checkout |
| [P2-7](#p2-7) | **Lowest** | Bug | Module: Header Navigation – Active Menu State | Header Navigation |
| [P2-8](#p2-8) | **Medium** | Bug | Module: Home Page – Shop by Categories | Home Page |
| [P2-9](#p2-9) | **Lowest** | Bug | Module: Best Selling Products – Search Bar | Best Selling Products |
| [P2-10](#p2-10) | **Lowest** | Bug | Module: Footer – Categories Navigation | Footer |
| [P2-11](#p2-11) | **Low** | Bug | Module: Footer – Links / Cards | Footer |
| [P2-12](#p2-12) | **Medium** | Bug | Module: About - Learn More Button– Navigation | About - Learn More Button |
| [P2-13](#p2-13) | **Medium** | Bug | Module: Shipping Policy / Return Policy – Effective Date | Shipping Policy / Return Policy |
| [P2-14](#p2-14) | **Low** | Bug | Module: Login / Authentication | Login / Authentication |
| [P2-15](#p2-15) | **Highest** | Bug | Module: Sign Up – Send OTP | Sign Up |
| [P2-16](#p2-16) | **High** | Bug | Title: Language Selector Becomes Difficult to Access After Switching to Tamil | Header / UI |
| [P2-17](#p2-17) | **High** | Bug | Title: Login / Logout Option Not Visible in Header | Header / UI |
| [P2-18](#p2-18) | **Medium** | Bug | Module: Footer – Social Media Link(Youtube) | Footer |
| [P2-19](#p2-19) | **Lowest** | Bug | Module: Home Page – Hero Section | Home Page |
| [P2-20](#p2-20) | **Low** | Bug | Module: FAQ – Search Bar | FAQ |
| [P2-21](#p2-21) | **Low** | Bug | Module: About / Farm Development – Callback Request | About / Farm Development |
| [P2-22](#p2-22) | **Low** | Task | Module: Farm Development Form– location field  | Farm Development Form |
| [P2-23](#p2-23) | **Medium** | Task | Module: Farm Development Form– Pincode Validation | Farm Development Form |
| [P2-24](#p2-24) | **Medium** | Bug | Replace Default Browser Alert with Custom Validation UI for Terms Acceptance | General |
| [P2-25](#p2-25) | **Medium** | Bug | Module: Service -Farm Consultancy – Your Farm Action Plan | Service -Farm Consultancy |
| [P2-26](#p2-26) | **Low** | Bug | Module: Crop Doctor / Consultation Page | Crop Doctor / Consultation Page |
| [P2-27](#p2-27) | **Low** | Bug | Module: Crop Doctor / Photo Upload | Crop Doctor / Photo Upload |
| [P2-28](#p2-28) | **Medium** | Bug | Module: Farm Consultancy Page – Performance | Farm Consultancy Page |
| [P2-29](#p2-29) | **Low** | Bug | Module: Crop Calendar – Hero Banner | Crop Calendar |
| [P2-30](#p2-30) | **Low** | Task | Module: Contact Us  – Address / Map Link | Contact Us |
| [P2-31](#p2-31) | **Low** | Bug | Module: Shopping Cart – Delivery Charge | Shopping Cart |
| [P2-32](#p2-32) | **High** | Bug | Module: Shopping Cart – Save for Later | Shopping Cart |
| [P2-33](#p2-33) | **Medium** | Bug | Module: Products / Wishlist | Products / Wishlist |
| [P2-34](#p2-34) | **Low** | Task | Module: Farm Development – Mobile Responsive UI | Farm Development |
| [P2-35](#p2-35) | **High** | Task | Module: Crop Doctor – Mobile Responsive UI | Crop Doctor |
| [P2-36](#p2-36) | **Low** | Bug | Mobile Responsive – Footer / Bottom Navigation | General |
| [P2-37](#p2-37) | **Low** | Bug | Module: Admin Dashboard – Date Filter | Admin Dashboard |
| [P2-38](#p2-38) | **Medium** | Bug | Module: Admin Dashboard – Action Links | Admin Dashboard |
| [P2-39](#p2-39) | **Medium** | Bug | Module: Orders – Invoice Print | Orders |
| [P2-40](#p2-40) | **Medium** | Bug | Module: Orders – Invoice Summary | Orders |
| [P2-41](#p2-41) | **Medium** | Bug | Module: Admin – Categories | Admin |
| [P2-42](#p2-42) | **Medium** | Bug | Module: Admin Portal – Customers / Edit Farmer Profile | Admin Portal |
| [P2-43](#p2-43) | **Medium** | Bug | Module: Admin Portal – Customers | Admin Portal |
| [P2-44](#p2-44) | **Medium** | Bug | Module: Admin Portal – Customers | Admin Portal |
| [P2-45](#p2-45) | **Medium** | Bug | Module: Admin Portal – Experts | Admin Portal |
| [P2-46](#p2-46) | **Medium** | Bug | Module: Admin Portal – Experts / Register Agronomist | Admin Portal |
| [P2-47](#p2-47) | **Medium** | Bug | Module: Admin Portal – Experts | Admin Portal |
| [P2-48](#p2-48) | **Medium** | Bug | Module: Admin Portal – Service Booking / Agronomist Assignment | Admin Portal |
| [P2-49](#p2-49) | **Medium** | Bug | Module: Admin Portal – Service Booking / Agronomist Assignment | Admin Portal |
| [P2-50](#p2-50) | **Medium** | Bug | Module: Admin Portal – Settings | Admin Portal |
| [P2-51](#p2-51) | **Medium** | Bug | Module: Admin Portal – Blog | Admin Portal |
| [P2-52](#p2-52) | **Medium** | Bug | Module: Admin Portal – Users & Roles | Admin Portal |

---

## Detailed Issue Specifications

### <a id="p2-1"></a> P2-1: Home Page – Crop Calendar, Weather Update and Daily Market Price cards redirect to incorrect pages

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CropCalendarPage.tsx`
  - `src/pages/CropCalendarPage.css`

#### Description & Acceptance Criteria

## Actual Result

The last three cards on the Home Page — **Crop Calendar, Weather Update, and Daily Market Price** — are navigating to incorrect or unrelated pages when their respective action buttons are clicked.  

## Expected Result

Each Home Page card should navigate to its corresponding module:

* **View Calendar** → Crop Calendar page
* **Check Weather** → Weather Update / Farm Weather page
* **View Market Prices** → Daily Market Price page

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-2"></a> P2-2: Module: Product Catalogue – Search

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/ProductsPage.tsx`
  - `src/pages/CatalogPage.tsx`
  - `src/store/filterStore.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
The search bar is not working. Entering a product name and clicking **Search** does not update or filter the product results.

**Expected Result:**  
When the user enters a valid product name and clicks **Search**, only the matching products should be displayed.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-3"></a> P2-3: Module: Profile – Mobile View

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/DashboardPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
Two **Menu** buttons are displayed on the Profile page.

**Expected Result:**  
Only one **Menu** button should be displayed in the correct position.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-4"></a> P2-4: Module: Product Comparison – Mobile View

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/store/compareStore.ts`
  - `src/components/product/CompareDrawer.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
The **Product Comparison** section overlaps with the bottom navigation and AgriEra AI button, causing the content to be partially hidden.

**Expected Result:**  
The **Product Comparison** section should display fully above the bottom navigation without any overlap or hidden content.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-5"></a> P2-5: Module: Product Listing / Product Comparison

- **Status:** `To Do`
- **Priority:** **High**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/store/compareStore.ts`
  - `src/components/product/CompareDrawer.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
The **Product Comparison** bar is overlapping the category navigation and the **AgriEra AI** floating button. Some bottom-page content is partially hidden and difficult to access.

**Expected Result:**  
The Product Comparison bar should be positioned without overlapping category tabs, floating buttons, or page content. All controls should remain fully visible and clickable.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-6"></a> P2-6: Module: Checkout – Coupon / Promo Code

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CartPage.tsx`
  - `src/store/cartStore.ts`
  - `src/services/cart.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
The checkout page shows order subtotal, delivery charges, and total payable, but there is **no field or Apply button to enter the offer code**.

**Expected Result:**  
A **“Coupon / Promo Code”** input with an **Apply** button should be available in the Order Summary section, preferably **above the Total Payable**. After entering **AGRIERA2026**, the applicable ₹75 discount should be shown separately and deducted from the total.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-7"></a> P2-7: Module: Header Navigation – Active Menu State

- **Status:** `To Do`
- **Priority:** **Lowest**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/components/layout/Navbar.tsx`
  - `src/components/layout/Navbar.css`

#### Description & Acceptance Criteria

**Actual Result:**  
The **Home** menu is shown inside a highlighted box, while the **About** menu uses only green text for the active state. The active menu style is inconsistent between pages.

**Expected Result:**  
The active navigation style should be consistent across all pages. **Home, About, and other active menu items should use the same highlight style**

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-8"></a> P2-8: Module: Home Page – Shop by Categories

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/HomePage.tsx`
  - `src/pages/HomePage.css`

#### Description & Acceptance Criteria

**Actual Result:**  
Left and right navigation arrows are displayed on the category section.  
The category cards are **partially cut off at the top**, causing the card content to appear clipped.  
**Expected Result:**  
Remove both the **left and right navigation arrows** from the Shop by Categories section.  
All category cards should be **fully visible within the section** with proper top spacing and no clipping or overflow.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-9"></a> P2-9: Module: Best Selling Products – Search Bar

- **Status:** `To Do`
- **Priority:** **Lowest**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/ProductsPage.tsx`
  - `src/pages/CatalogPage.tsx`
  - `src/store/filterStore.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
Two **clear/cancel (X) icons** are displayed inside the search bar at the same time.  
**Expected Result:**  
Only one **clear/cancel (X) icon** should be displayed to clear the entered search text.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-10"></a> P2-10: Module: Footer – Categories Navigation

- **Status:** `To Do`
- **Priority:** **Lowest**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/ProductsPage.tsx`
  - `src/pages/CatalogPage.tsx`
  - `src/store/filterStore.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
Clicking **All Products** in the footer navigates to the **Farm Equipment** category page.

**Expected Result:**  
Clicking **All Products** should navigate to the **All Products / Product Listing** page and display products from all categories.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-11"></a> P2-11: Module: Footer – Links / Cards

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/components/layout/Footer.tsx`
  - `src/components/layout/Footer.css`

#### Description & Acceptance Criteria

**Actual Result:**  
The links/cards in the bottom section are displayed but are **not active/clickable**.

**Expected Result:**  
All footer links/cards should be **active and clickable**, and each should navigate to its respective page.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-12"></a> P2-12: Module: About - Learn More Button– Navigation

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AboutPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
Clicking the **Learn More** button navigates to the **Farm Equipment** page.

**Expected Result:**  
Clicking **Learn More** should navigate to the relevant information/details page for this section, not the Farm Equipment page.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-13"></a> P2-13: Module: Shipping Policy / Return Policy – Effective Date

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/ShippingPolicyPage.tsx`
  - `src/pages/ReturnPolicyPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
The **Effective Date** is displayed as **September 4, 2026** on both policy pages. It appears static and does not show any indication that it is dynamically managed.

**Expected Result:**  
The Effective Date should be **dynamically configurable from the backend/admin settings** and should update whenever the policy content is modified or a new effective date is set.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-14"></a> P2-14: Module: Login / Authentication

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/LoginPage.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/services/auth.service.ts`

#### Description & Acceptance Criteria

**Actual Result:** When an unregistered user tries to log in, the system only shows **“Invalid email or password.”**  
**Expected Result:** If the email is not registered, show a clearer message such as( **No account found with this email.** Create an account to continue)

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-15"></a> P2-15: Module: Sign Up – Send OTP

- **Status:** `To Do`
- **Priority:** **Highest**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/LoginPage.tsx`
  - `src/services/auth.service.ts`
  - `src/hooks/useAuth.ts`

#### Description & Acceptance Criteria

**Actual Result:** Send OTP API is calling `localhost:5000/api/auth/register-otp`, causing `ERR_CONNECTION_REFUSED` and showing **“Failed to fetch.”**  
**Expected Result:** Production frontend should call the deployed backend API domain/server URL, and OTP should be sent successfully.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-16"></a> P2-16: Title: Language Selector Becomes Difficult to Access After Switching to Tamil

- **Status:** `To Do`
- **Priority:** **High**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/context/LanguageContext.tsx`
  - `src/components/layout/Navbar.tsx`

#### Description & Acceptance Criteria

**Module:** Header / Language Switcher

**Actual Result:**  
After changing the website language from English to Tamil, the translated navbar labels take more horizontal space. Because of this, the right-side header items become partially hidden, and the user finds it difficult to access the language selector and switch back to English.  
**Expected Result:**  
The language selector should always remain clearly visible and accessible in all supported languages.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-17"></a> P2-17: Title: Login / Logout Option Not Visible in Header

- **Status:** `To Do`
- **Priority:** **High**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/LoginPage.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/services/auth.service.ts`

#### Description & Acceptance Criteria

**Module:** Header / Authentication (Tamil)

**Actual Result:**  
The Login / Logout option is not visible in the header, so the user cannot easily identify whether they are logged in or access the logout action.

**Expected Result:**  
When the user is logged out, the header should clearly show **Login / Register**.  
When the user is logged in, the header should clearly show the **user/profile option and Logout action**.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-18"></a> P2-18: Module: Footer – Social Media Link(Youtube)

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/components/layout/Footer.tsx`
  - `src/components/layout/Footer.css`

#### Description & Acceptance Criteria

**Actual Result:**  
Clicking the YouTube icon redirects the user to a general YouTube page / unrelated songs instead of AgriEra’s official YouTube content.

**Expected Result:**  
Clicking the YouTube icon should open the **official AgriEra YouTube channel**

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-19"></a> P2-19: Module: Home Page – Hero Section

- **Status:** `To Do`
- **Priority:** **Lowest**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/HomePage.tsx`
  - `src/pages/HomePage.css`

#### Description & Acceptance Criteria

**Actual Result:** Description text displays invalid characters `???` between “solutions” and “all in one place.”  
**Expected Result:** The text should display the intended punctuation/separator correctly without any invalid characters.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-20"></a> P2-20: Module: FAQ – Search Bar

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/ProductsPage.tsx`
  - `src/pages/CatalogPage.tsx`
  - `src/store/filterStore.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
There are 3 FAQ items available under the **Services** category, but when searching for **“services”**, only 1 FAQ item is displayed.

**Expected Result:**  
Searching for **“services”** should display all FAQ items related to the Services category/content, including all  relevant service FAQs.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-21"></a> P2-21: Module: About / Farm Development – Callback Request

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/FarmConsultancyPage.tsx`
  - `src/pages/FarmDevelopmentPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:** The CTA displays **“Request Immediate Call”**, but the actual response time is up to 15 minutes.

**Expected Result:** The CTA should accurately reflect the callback behavior, such as **“Request a Callback”**, and after submission the user should be informed that the team will contact them within 15 minutes.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-22"></a> P2-22: Module: Farm Development Form– location field 

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Task`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/FarmConsultancyPage.tsx`
  - `src/pages/FarmDevelopmentPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
After entering a pincode, multiple locality names are displayed together in the Location field instead of providing a selectable list.

**Expected Result:**  
When a pincode maps to multiple localities, the Location field should display a dropdown containing all matching areas so the user can select the correct locality.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-23"></a> P2-23: Module: Farm Development Form– Pincode Validation

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Task`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/FarmConsultancyPage.tsx`
  - `src/pages/FarmDevelopmentPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
After entering a valid pincode broken characters such as `âœ”` are displayed below the Pincode field along with the fetched location text.

**Expected Result:**  
No broken or encoded characters should be displayed below the Pincode field.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-24"></a> P2-24: Replace Default Browser Alert with Custom Validation UI for Terms Acceptance

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/HomePage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
When the user submits the form without accepting Terms & Privacy Policy, a default browser alert is displayed with `localhost:3000 says`.

**Expected Result:**  
The system should display a custom AgriEra-styled validation modal for example:

**Please accept the Terms & Privacy Policy to continue.**

It should use the website’s colors, spacing and buttons instead of the browser default alert.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-25"></a> P2-25: Module: Service -Farm Consultancy – Your Farm Action Plan

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/FarmConsultancyPage.tsx`
  - `src/pages/FarmDevelopmentPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
The Follow-Up Date displays/allows an old past date such as **20 May 2025** for a new consultation/action plan.

**Expected Result:**  
For a new consultation, the Follow-Up Date should not be earlier than the consultation/request date. It should allow only the current or future date based on the follow-up schedule.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-26"></a> P2-26: Module: Crop Doctor / Consultation Page

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CropDoctorPage.tsx`
  - `src/pages/CropDoctorPage.css`

#### Description & Acceptance Criteria

**Actual Result:**  
The page contains multiple AI-style/supportive icon cards and decorative elements, which make the UI look cluttered and less professional.

**Expected Result:**  
The page should use only essential icons and relevant support elements. Unnecessary AI-style decorative icons/cards should be reduced or removed to keep the page clean, professional, and focused on the form content.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-27"></a> P2-27: Module: Crop Doctor / Photo Upload

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CropDoctorPage.tsx`
  - `src/pages/CropDoctorPage.css`

#### Description & Acceptance Criteria

**Actual Result:** Uploaded photo count is shown, but the uploaded images cannot be previewed.  
**Expected Result:** Uploaded images should be displayed so users can verify them before submitting, with an option to remove or replace incorrect photos.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-28"></a> P2-28: Module: Farm Consultancy Page – Performance

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/FarmConsultancyPage.tsx`
  - `src/pages/FarmDevelopmentPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:** Cumulative Layout Shift is **0.87**, which indicates major unexpected layout movement during page load.  
**Expected Result:** Page elements should remain visually stable while loading, with CLS ideally **≤ 0.1**.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-29"></a> P2-29: Module: Crop Calendar – Hero Banner

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CropCalendarPage.tsx`
  - `src/pages/CropCalendarPage.css`

#### Description & Acceptance Criteria

Crop Calendar Banner Design Does Not Match the Rest of the Page  
**Actual Result:**  
The hero banner uses a dark image overlay, oversized heading, and large icon style that does not visually match the lighter, cleaner design used in the rest of the Crop Calendar page.

**Expected Result:**  
The banner should follow the same visual language as the remaining page, including consistent colors and overall styling.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-30"></a> P2-30: Module: Contact Us  – Address / Map Link

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Task`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/ContactPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
Clicking **Open in Google Maps** opens Google Maps, but it needs to be verified whether the exact saved address/location is selected or only the general city is opened.

**Expected Result:**  
Google Maps should open directly to the exact saved address or coordinates related to that record, not just the general city.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-31"></a> P2-31: Module: Shopping Cart – Delivery Charge

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CartPage.tsx`
  - `src/store/cartStore.ts`
  - `src/services/cart.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
The cart shows **Estimated Delivery: ₹0.00** and the Grand Total remains equal to the Subtotal. Delivery charges are not added based on the entered pincode/location.

**Expected Result:**  
The applicable delivery charge should be calculated based on the  delivery .

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-32"></a> P2-32: Module: Shopping Cart – Save for Later

- **Status:** `To Do`
- **Priority:** **High**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CartPage.tsx`
  - `src/store/cartStore.ts`
  - `src/services/cart.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
When the user clicks **Save for Later**, the popup message shows **“Item removed from cart”**, which is misleading.

**Expected Result:**  
The system should show a correct confirmation message such as **“Item saved for later”**

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-33"></a> P2-33: Module: Products / Wishlist

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/store/wishlistStore.ts`
  - `src/pages/ProductsPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
When the user clicks the heart icon, a success message appears saying the product was **“added to wishlist”**, but there is no clearly visible Wishlist option on this page to view the saved items.

**Expected Result:**  
After adding a product to Wishlist, the user should have an easily accessible **Wishlist** option, such as in the header/profile menu

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-34"></a> P2-34: Module: Farm Development – Mobile Responsive UI

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Task`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/FarmConsultancyPage.tsx`
  - `src/pages/FarmDevelopmentPage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
On mobile view, the hero banner heading/content is partially hidden behind the top search/header area and is not fully visible.

**Expected Result:**  
The full hero banner content should be visible on mobile with proper top spacing. Header/search bar should not overlap or cut the banner text/image.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-35"></a> P2-35: Module: Crop Doctor – Mobile Responsive UI

- **Status:** `To Do`
- **Priority:** **High**
- **Issue Type:** `Task`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/CropDoctorPage.tsx`
  - `src/pages/CropDoctorPage.css`

#### Description & Acceptance Criteria

‌

**Actual Result:**  
In mobile view, the Crop Doctor process indicator shows only **Step 3 and Step 4**, while **Step 1 and Step 2 are missing/not visible**.

**Expected Result:**  
All steps in the Crop Doctor process should be visible in correct sequence on mobile.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-36"></a> P2-36: Mobile Responsive – Footer / Bottom Navigation

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/components/layout/Footer.tsx`
  - `src/components/layout/Footer.css`

#### Description & Acceptance Criteria

**Actual Result:**  
Footer content at the bottom is partially cut off/overlapped by the fixed mobile bottom navigation bar.

**Expected Result:**  
All footer content, including copyright, payment icons, and contact details, should remain fully visible with proper bottom padding above the fixed navigation bar.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-37"></a> P2-37: Module: Admin Dashboard – Date Filter

- **Status:** `To Do`
- **Priority:** **Low**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
Dashboard date/filter text displays a fixed-looking date and broken encoded characters, e.g. `5 Oct 2026 â€¢ 30D`.

**Expected Result:**  
The dashboard should display the correct current/selected date dynamically and render the separator correctly

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-38"></a> P2-38: Module: Admin Dashboard – Action Links

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`

#### Description & Acceptance Criteria

**Actual Result:** Action links display broken encoded characters such as `â†’` instead of the intended arrow icon.

**Expected Result:** All action links should display the correct arrow/icon consistently, for example **Review Inventory →**.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-39"></a> P2-39: Module: Orders – Invoice Print

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/HomePage.tsx`

#### Description & Acceptance Criteria

**Actual Result:**  
After clicking **Print Invoice**, the success toast immediately shows **“Invoice for #GL-BB9F0 printed”**.

**Expected Result:**  
The message should say something like **“Invoice ready to print”** . It should not claim the invoice was printed unless printing is actually confirmed.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-40"></a> P2-40: Module: Orders – Invoice Summary

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/HomePage.tsx`

#### Description & Acceptance Criteria

**Actual Result:** Invoice summary shows the order status as **Processing**, but does not display the payment status even though the order is marked **Paid** in Orders Management.  
**Expected Result:** Invoice summary should clearly display the payment status, for example **Payment Status: Paid**, separately from the order fulfillment status.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-41"></a> P2-41: Module: Admin – Categories

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useCategories.ts`

#### Description & Acceptance Criteria

**Actual Result:** Category cards display characters and broken separators.  
**Expected Result:** Proper category icons and separators should render without encoding issues.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-42"></a> P2-42: Module: Admin Portal – Customers / Edit Farmer Profile

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useCustomers.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
The Edit Farmer Profile modal header displays encoded characters before the title and between the title and farmer name.

**Expected Result:**  
The modal title should render cleanly, for example:

**Edit Farmer Profile —**

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-43"></a> P2-43: Module: Admin Portal – Customers

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useCustomers.ts`

#### Description & Acceptance Criteria

**Actual Result:** Customer status such as **Deactivated/Active** is displayed twice in the same row, making the table look crowded.  
**Expected Result:** Customer status should be displayed only once in the dedicated **Status** column for a cleaner and more consistent UI.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-44"></a> P2-44: Module: Admin Portal – Customers

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useCustomers.ts`

#### Description & Acceptance Criteria

**Actual Result:** Entering a customer name such as **“ikasle”** in the search field does not correctly filter the customer list.  
**Expected Result:** The customer list should dynamically  display only matching records based on name, email, phone, or other supported fields.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-45"></a> P2-45: Module: Admin Portal – Experts

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useExperts.ts`
  - `src/services/expert.service.ts`

#### Description & Acceptance Criteria

**Actual Result:** Clicking **Call Agronomist** shows **“Direct connection opened with Agri”**, even though contact information is shown as **Not provided** and no actual call connection is available.  
**Expected Result:** If a valid phone number exists, the system should open the dialer/call action. If contact information is unavailable, it should show a clear message like **“Agronomist contact number is not available.”**

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-46"></a> P2-46: Module: Admin Portal – Experts / Register Agronomist

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useExperts.ts`
  - `src/services/expert.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
The Register Agronomist form does not provide any field to enter the expert’s contact/mobile number. As a result, the expert profile shows **“Contact: Not provided”** and the Call Agronomist action cannot work properly.

**Expected Result:**  
The registration form should include a **Mobile Number / Contact Number** field. The saved number should appear in the expert profile and be used by the **Call Agronomist** action.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-47"></a> P2-47: Module: Admin Portal – Experts

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useExperts.ts`
  - `src/services/expert.service.ts`

#### Description & Acceptance Criteria

**Actual Result:** Expert profile displays a generic/AI-style profile image instead of an actual uploaded expert photo or neutral default avatar.  
**Expected Result:** Expert profile should display the real uploaded profile image. If no photo is available, use a consistent default avatar.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-48"></a> P2-48: Module: Admin Portal – Service Booking / Agronomist Assignment

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useExperts.ts`
  - `src/services/expert.service.ts`
  - `src/hooks/useServiceBookings.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
Location details are displayed with duplicate and inconsistent values, for example **“Peelamedu, Coimbatore, Coimbatore, Tamil Nadu - 641004.”**

**Expected Result:**  
Location details should be displayed only once in a clean and consistent format, for example **“Peelamedu, Coimbatore, Tamil Nadu - 641004.”**

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-49"></a> P2-49: Module: Admin Portal – Service Booking / Agronomist Assignment

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useExperts.ts`
  - `src/services/expert.service.ts`
  - `src/hooks/useServiceBookings.ts`

#### Description & Acceptance Criteria

**Actual Result:** Farmer name and phone number are separated by a broken encoded character such as `â€¢`.

**Expected Result:** A proper separator should be displayed, for example: **Ramya Murugan • +91 88259 72129**, without any garbled characters.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-50"></a> P2-50: Module: Admin Portal – Settings

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/services/storeSettings.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
Payment channel names/icons display garbled characters such as `âš¡`, `ðŸ’³`, `ðŸ’µ` instead of proper icons/symbols.

**Expected Result:**  
Payment channel icons and labels should render correctly without any broken or encoded characters.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-51"></a> P2-51: Module: Admin Portal – Blog

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`
  - `src/hooks/useBlogs.ts`
  - `src/services/blog.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
The Blog Publishing Guide displays multiple characters in place of proper symbols and punctuation. Examples include corrupted values in image dimensions, character ranges, word counts, tags, and header/action symbols.  
**Expected Result:**  
All dimensions, ranges, punctuation, and symbols should render correctly, for example:

* `1200 × 630 px`
* `45–65 characters`

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

### <a id="p2-52"></a> P2-52: Module: Admin Portal – Users & Roles

- **Status:** `To Do`
- **Priority:** **Medium**
- **Issue Type:** `Bug`
- **Assignee:** Ponraj P
- **Primary File Pointers:**
  - `src/pages/AdminPage.tsx`
  - `src/pages/AdminPage.css`
  - `src/services/admin.service.ts`

#### Description & Acceptance Criteria

**Actual Result:**  
The **Role Action** column displays a broken encoded character such as `â€”` instead of the intended action icon/text.

**Expected Result:**  
The Role Action column should display the correct action control or symbol without any garbled characters.

#### Resolution Checklist
- [ ] Implement fix in specified source files.
- [ ] Verify issue is resolved on desktop and mobile.
- [ ] Confirm no regressions or broken characters remain.

---

