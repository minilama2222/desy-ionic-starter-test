# DIAGNOSTIC — desy-ionic-starter validation

This fork was created on **2026-07-01** to validate `desy-ionic-starter` against
real-world pages from a Gobierno de Aragón mobile app.

## What was built in this fork

Three pages from a realistic "Mis trámites" use case:

1. **`/tramites` — TramitesListPage**
   - Mock backend (in-memory) with simulated 250ms delay.
   - Reactive search + status filter (5 segments: Todos, Pendientes, En trámite, Subsanación, Finalizados).
   - Loading state, empty state, error-tolerant refresh.
   - 8 mock records covering all status states.

2. **`/tramites/:id` — TramiteDetailPage**
   - Route param reading via `ActivatedRoute.snapshot`.
   - Conditional banner for `requiere-subsanacion` state.
   - Three contextual actions (primary / secondary / back).
   - Confirm + info dialogs via `AlertService` (wraps `AlertController`).

3. **`/tramites/nueva` — SolicitudFormPage**
   - 3-step wizard (Datos personales → Documentación → Confirmación).
   - Three independent `FormGroup`s, one per step.
   - Custom validators (Spanish DNI regex, email, min length).
   - File upload with native `<input type="file">` because desy-ionic has no equivalent.
   - Step-list UI driven by mutating `state` per step.

## Visual validation (added 2026-07-01)

A second pass was run with **Playwright + Chromium headless** capturing
mobile-width screenshots at **375×812** (iPhone X viewport). M3 reviewed each
capture. Findings, fixes, and remaining issues:

### H. Tab-bar not visible in child tabs — **FIXED**

- **Symptom:** Visiting `/tabs-example/search` (or any child route) showed the
  tab content but **no bottom tab-bar**, so the user could not navigate
  between tabs without going back to `/tabs-example` first.
- **Root cause:** `app.routes.ts` was using `loadChildren` directly, bypassing
  the `TabsExamplePage` parent component that contains the `<ion-tabs>` shell
  with the `<ion-router-outlet>` and `<ion-tab-bar>`.
- **Fix:** `app.routes.ts` now uses `loadComponent` (for the parent) +
  `loadChildren` (for the tab routes). `tabs-example.page.html` no longer
  wraps `<ion-tabs>` in `<ion-content>` (which was hiding the bar).
- **Verification:** Re-captured `/tabs-example/{home,search,favorites,profile}`.
  All four now render the tab-bar with the active tab highlighted in primary colour.

### I. Ionicons SVG icons not rendering — **FIXED**

- **Symptom:** `<ion-icon name="home-outline">` rendered as **empty space**.
  Both in the standalone `ion-tab-button`s and inside `desyi-icon` (when
  `iconSet="ionic"`).
- **Root cause:** Standalone Ionic requires `addIcons()` to be called with the
  icons you intend to use. The starter did not call it, and the Angular
  application builder did not include them automatically.
- **Fix:** Added `addIcons({...})` in `src/main.ts` registering all icons used
  across the app. The `ionicons/svg/*` assets block in `angular.json` is
  no longer strictly necessary once `addIcons` is in place; could be removed
  for bundle size.
- **Verification:** All `<ion-icon>` elements in the tabs now render correctly.

### J. `desyi-icon` with `iconSet="ionic"` not rendering — **PARTIAL FIX**

- **Symptom:** Even with `addIcons()` called, `<desyi-icon iconSet="ionic"
  iconName="home-outline">` produces an empty render in `home.page.html`.
  The internal template of `DesyiIconComponent` uses `<ion-icon [name]="iconName">`,
  but the SVG does not appear.
- **Workaround applied in this fork:** Replaced the `<desyi-icon>` calls in the
  home cards with native `<ion-icon>` (which works fine).
- **Recommendation:** File an issue against `gorilas/desy-ionic` describing
  this regression. Likely the `DesyiIconComponent` template renders inside a
  scope where `addIcons()` has not propagated, or where `IonIcon` is being
  rendered without the necessary `addIcons` context.

### K. Home cards look empty — **PARTIAL FIX**

- **Symptom:** The four feature cards on `/home` showed only a title and
  description; no icon and no CTA button were visible.
- **Root cause (a):** `desyi-icon` not rendering (see point J).
- **Root cause (b):** `<desyi-button [link]="...">` with internal routing may
  require `RouterLink` to be wired into the click handler, or the link is not
  being interpreted as an internal route.
- **Fix in this fork:** Replaced `desyi-icon` with `ion-icon` directly.
- **Status:** Icons now appear; button rendering still TBD.

### L. Status pills show as neutral outlined chips — **NOT FIXED**

- **Symptom:** `<desyi-pill [classes]="'c-pill--success'">` renders as a
  neutral outlined chip regardless of the colour modifier. The pill in
  `/tramites/EX-2026-0042` ("Requiere subsanación") shows the same outline as
  the "Finalizado" pill.
- **Root cause:** The CSS classes `c-pill--success`, `c-pill--warning`,
  `c-pill--danger`, `c-pill--primary`, `c-pill--medium` are **not defined** in
  the desy-ionic theme shipped via `node_modules/desy-ionic/index.scss`. The
  starter's `tailwind.config.js` defines the colour tokens, but the pill
  component itself does not apply them.
- **Recommendation:** Either (a) add the colour variants to desy-ionic, or
  (b) have apps ship their own pill colour classes (e.g. in `theme/_pills.scss`).

### M. Forms-example overflows the viewport — **NOT FIXED**

- **Symptom:** `/forms-example` has 6 form fields plus two action buttons. On
  a 375×812 viewport, the calendar (desyi-datetime) takes up the bottom half
  of the visible area, pushing the gender radios, interests checkboxes and
  the submit/reset buttons below the fold. No internal scroll is visible.
- **Recommendation:** Either (a) split the form into multiple cards with
  section headings so users can scroll between them naturally, or (b) make the
  example emphasise a single control type per demo, leaving the multi-field
  pattern for the wizard page in the test fork.

### N. List-example last item clipped by the bottom safe area — **NOT FIXED**

- **Symptom:** The last item of `/list-example` ("Solicitud certificado de
  residencia") is clipped at the bottom of the screen. The container does
  not have a `padding-bottom` accounting for safe areas.
- **Recommendation:** Add `padding-bottom: env(safe-area-inset-bottom) + 16px`
  to the `<ion-content>` or to the `.list` container.

### O. Solicitud-form lacks sticky CTA — **NOT FIXED**

- **Symptom:** On step 1 of the wizard, the "Continuar" button is below all
  five form fields. On a 375×812 screen this means scrolling past every
  field to submit, increasing the perceived effort.
- **Recommendation:** Add an `<ion-footer>` with a sticky "Continuar"
  button, or move the button into a fixed-position bar that floats above the
  content on mobile.

### P. Tab-bar size hierarchy is inconsistent in detail page — **NOT FIXED**

- **Symptom:** `/tramites/:id` shows three action buttons (Aportar,
  Consultar, Volver). The primary button takes full width, the secondary
  takes half, and the "Volver" button is rendered much smaller.
- **Recommendation:** Set `[classes]="'c-button--secondary c-button--block'`
  (or equivalent utility class) on all three so they share the same width,
  and let visual emphasis come from colour/fill rather than size.

### Q. "Volver" button in detail page has wrong direction — **COSMETIC**

- **Symptom:** The "Volver" button on the tramite-detail page has
  `icon="arrow-back-outline"` but appears in `iconSlot="start"`. Cosmetic only;
  left as-is.

---

## What the starter is missing — friction log (carried from v1)

### A. Missing shared components

| Need | Today | Suggested fix |
|---|---|---|
| Loading skeleton | Inline `ion-spinner` + CSS | Add `app-loading-spinner` or `app-skeleton` to shared/components |
| Status badge | Repeated `statusColor()` + `pillClass()` in every page | Add `app-status-badge` taking a `TramiteEstado`-like enum |
| Error state for pages | Inlined error markup | Add `app-page-error` with title + description + back CTA |
| Empty state with CTA | `<ng-content>` slot only | Add a dedicated `app-empty-state-cta` with primary + secondary actions |

### B. Missing shared utilities

| Need | Today | Suggested fix |
|---|---|---|
| Status → color mapping | Reimplemented per page | Add `core/utils/status-color.ts` with a typed map |
| Date formatting | Raw `YYYY-MM-DD` strings | Add `core/utils/format-date.ts` (es-ES locale aware) |
| Logger wrapper for HTTP | None | Add `core/interceptors/logging.interceptor.ts` |

### C. API gaps in `desy-ionic` itself (worth flagging upstream)

| Component | Observation |
|---|---|
| `desyi-pill` | No `[color]` input, no colour utility classes shipped. Apps have to ship their own. |
| `desyi-step-list` | No `[currentStep]` input. To highlight the active step you must mutate each item's `state` field. |
| `desyi-segment` | `value` is `string` only. No typed binding. |
| `desyi-text` | Only `headingLevel` (`c-h1`–`c-h4`). No `body` / `caption` variants. |
| Interface types | `IDesyRadio`, `IDesyCheckboxGroup`, `IDesyStepList`, `IDesyCheckbox` are NOT exported from `public-api.ts`. |
| File upload | No equivalent component. |
| Modal / Alert / Toast | No native components. Apps wrap the corresponding Controllers themselves. |
| `desyi-icon` with `iconSet="ionic"` | Renders empty even after `addIcons()` is called. **Bug.** |

### D. Architectural patterns missing in the starter

| Pattern | Why it matters |
|---|---|
| HTTP service base class | Generic wrapper with error normalisation + base URL. |
| Error interceptor | Loading + error states for HTTP calls should be reusable. |
| Loading controller helper | Every page manages its own `loading = signal(true)`. |
| Wizard / multi-step state machine | Right now `step = signal(n)` + manual validation per step. |
| Pull-to-refresh | `<ion-refresher>` not wired up in any example. |
| Deep linking / deeplinks | Capacitor deeplinks config is not in the starter. |

### E. TypeScript strictness traps

| Issue | Workaround |
|---|---|
| `(onInputEmit)="onSearch($event.detail?.value)"` — typing `$event` is `Event`, not `CustomEvent` | Wrapper method that takes `Event` and casts internally. |
| `(onValueChange)="filter.set($event as Filter)"` — `as` not supported in template parser | Wrapper method. |
| `(change)="toggle(item.id, $event.detail.checked)"` — same | Wrapper method. |

### F. Build / config findings

| Issue | Fix |
|---|---|
| Sass-loader cannot resolve `desy-ionic/index` without `stylePreprocessorOptions.includePaths: ["node_modules"]` | Added in `angular.json` |
| Karma on root + snap Chromium needs `--no-sandbox` flags | Added `ChromeHeadlessNoSandbox` launcher in `karma.conf.js` |
| SCSS `@use` must come before `@import` | Documented in `src/styles.scss` |
| Ionicons SVGs not registered for standalone Ionic | `addIcons()` in `main.ts` (this fork) |
| Tab-bar hidden in child routes | `loadComponent` + `loadChildren` in `app.routes.ts` (this fork) |

### G. Documentation gaps in the starter

The starter's README covers the happy path well, but is missing:

- How to write E2E tests against pages with async data (loading + empty + populated states).
- How to wire up an HTTP service + base URL + interceptors.
- How to add a wizard / multi-step form using `desyi-step-list`.
- How to handle Capacitor deeplinks for push notifications and external links.
- How to structure i18n (`@angular/localize` install + `es`/`ca` message extraction).
- How to register Ionicons with `addIcons()` so standalone ion-icons render.

## Recommendations to apply upstream

When updating `desy-ionic-starter` based on this diagnostic:

1. **Add to `src/app/shared/components/`**:
   - `app-loading-spinner` (wraps `ion-spinner` with three sizes)
   - `app-status-badge` (takes status + colour mapping)
   - `app-page-error` (404 / 500 / generic)

2. **Add to `src/app/core/utils/`**:
   - `status-color.ts` (typed map for status → colour)
   - `format-date.ts` (locale-aware)

3. **Add to `src/app/core/services/`**:
   - `http-base.service.ts` (generic HTTP wrapper with error handling)
   - `loading.service.ts` (global loading indicator)
   - `alert.service.ts`, `toast.service.ts`, `modal.service.ts` (wrappers around Controllers)

4. **Add a wizard example** (`/features/wizard-example/`):
   - Three-step form using `desyi-step-list`.
   - One `FormGroup` per step.
   - Step state mutated via a single `setStep(n)` helper.
   - Sticky CTA in `<ion-footer>`.

5. **Improve `src/app/features/forms-example/`**:
   - Split the demo into multiple cards with clear section headings.
   - Add `padding-bottom: env(safe-area-inset-bottom) + 16px` to content.
   - Make sure all 6 fields + 2 buttons are reachable without internal overflow.

6. **Fix `src/app/features/tabs-example/`**:
   - Use `loadComponent` + `loadChildren` in the parent route (not `loadChildren` alone).
   - `<ion-tabs>` must be the root of the parent template; do NOT wrap it in
     `<ion-content>`.

7. **Fix `src/main.ts`**:
   - Call `addIcons({...})` with the icon names used across the app.

8. **Update README**:
   - Add "Patterns" section: HTTP service, interceptors, wizards, refresh, deeplinks.
   - Add "Components you'll probably build yourself" callout.
   - Add "Ionicons registration" section.
   - Document the typing workarounds for `desy-ionic` events.

9. **Open issues upstream on `gorilas/desy-ionic`**:
   - Export `IDesy*` interfaces from `public-api.ts`.
   - Add `[color]` input to `desyi-pill` and `desyi-text` for consistency.
   - Add `[currentStep]` (or `[(currentStep)]`) to `desyi-step-list`.
   - Add a `<desyi-file-upload>` component.
   - Consider `<desyi-toast>`, `<desyi-modal>` first-class components.
   - Fix `desyi-icon` with `iconSet="ionic"` not rendering after `addIcons()`.

## Validation verdict (v2, after visual pass)

> **The starter is a good baseline that compiles and ships. The visual pass uncovered 4 critical bugs (tab-bar hidden, icons not rendering, desyi-icon broken, status pill colourless) — three are fixed in this fork, one is a workaround, and the remaining issues (pills, overflow, sticky CTA) are ergonomic improvements.**

The starter is ready to be published and iterated on. The diagnostic above
is the roadmap for the next iteration.