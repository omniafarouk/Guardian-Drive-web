 
### Adding a new page
 
1. Create the page component in the correct role folder under pages/
2. Create a service file in services/ if new API calls are needed
3. Add the route in App.tsx wrapped in ProtectedRoute
```tsx
<Route path='/fleet/new-page' element={
  <ProtectedRoute
    allowedRoles={[Role.FLEET_MANAGER]}
    title="New Page"
    page={<NewPage />}
  />
} />
```
 
4. Add a NavLink in sidebar.tsx inside SidebarContent()
---
 
## Protected Routes (protectedRoute.tsx)
 
Checks token and role before allowing access to a page.
 
```tsx
<ProtectedRoute
  allowedRoles={[Role.ADMIN]}   // who can access this page
  title="Dashboard"             // shown in the navbar
  page={<AdminDashboard />}     // component to render
/>
```
 
| Condition | Result |
|---|---|
| No token | Redirected to / |
| Wrong role | Redirected to / |
| Correct role | Page renders normally |
 
---
 
## Page Layout (pagesLayout.tsx)
 
Every protected page uses this layout automatically via ProtectedRoute. It renders:
 
- Sidebar (left column)
- Navbar with page title (top)
- Page content (right column)
- Alert SSE notifications (always listening in background)
> You do not need to add Sidebar or Navbar manually inside any page component.
 
---
 
## Reusable Table (listTable.tsx)
 
Generic typed table used across all list pages. Accepts any data type via generics.
 
```tsx
<ListTable<Alert>
  columnNames={columns}      // { label: string, key: string }[]
  data={alerts}              // array of your data
  renderRow={(alert) => (    // how each row looks
    <>
      <td>{alert.alertId}</td>
      <td>{alert.type}</td>
    </>
  )}
/>
```
 
### To add a new list page
 
1. Define a columns array with { label, key } objects
2. Define a TypeScript interface for your data shape
3. Fetch data in useEffect and store in useState
4. Pass everything to ListTable with a renderRow function

---

## Types & Enums (src/types/)
 
All shared types are defined once and imported everywhere.
 
```ts
// enums.ts — use const objects, NOT TypeScript enums (blocked by TS config)
export const Role = {
  ADMIN: "ADMIN",
  FLEET_MANAGER: "FLEET_MANAGER"
} as const
export type Role = typeof Role[keyof typeof Role]
 
export const AlertStatus = {
  ACTIVE: "ACTIVE",
  RESOLVED: "RESOLVED"
} as const
 
export const AlertType = {
  SOS: "SOS",
  HEALTH_ABNORMAL: "HEALTH_ABNORMAL"
} as const
```
 
Always import from the index:
```ts
import { Role, AlertStatus, AlertType } from '../types'
```
 
---

## Sidebar (sidebar.tsx)
 
| Screen | Behavior |
|---|---|
| Desktop (md+) | Permanent sidebar, always visible, sticky |
| Mobile | Hidden by default, opens as sliding drawer on hamburger click |
 
Uses NavLink for automatic active link highlighting.
 
### Adding a new sidebar link
 
Inside SidebarContent() in sidebar.tsx:
 
```tsx
<li className="nav-item mb-2">
  <NavLink
    to="/new-page"
    className="nav-link text-white d-flex align-items-center justify-content-between"
  >
    <span><i className="bi bi-icon-name me-2"></i> New Page</span>
    <i className="bi bi-chevron-down"></i>
  </NavLink>
</li>
```
 
---
 
## Dashboard Components
 
| Component | What it shows |
|---|---|
| DashboardStats.tsx | 4 stat cards — drivers, fleet size, managers, wearable bands |
| DashboardCharts.tsx | Bar chart (alerts per month) + Donut chart (car status) |
 
Both currently use static data. To connect to backend:
 
```tsx
const [stats, setStats] = useState(null)
 
useEffect(() => {
  getDashboardStats().then(setStats)
}, [])
```
 









# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


