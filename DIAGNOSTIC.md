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

## What the starter is missing — friction log

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
| Currency / number formatting | Not needed yet | Document when needed |
| Logger wrapper for HTTP | None | Add `core/interceptors/logging.interceptor.ts` |

### C. API gaps in `desy-ionic` itself (worth flagging upstream)

| Component | Observation |
|---|---|
| `desyi-pill` | Input is `[classes]`, not `[color]`. Inconsistent with `desyi-icon` which has `[color]`. Suggest standardising on `[color]` everywhere. |
| `desyi-step-list` | No `[currentStep]` input. To highlight the active step you must mutate each item's `state` field. Suggest a two-way `[(currentStep)]` or `[currentStep]`. |
| `desyi-segment` | `value` is `string` only. No `[options]` typed binding. Need to cast to custom enums in handlers. |
| `desyi-text` | Only `headingLevel` (`c-h1`–`c-h4`). No `body` / `caption` variants. Need to fall back to plain `<p>` for body text. |
| Interface types | `IDesyRadio`, `IDesyCheckboxGroup`, `IDesyStepList`, `IDesyCheckbox` are NOT exported from the package's `public-api.ts`. Have to redeclare them in every consumer app. |
| File upload | No equivalent component. Apps have to use raw `<input type="file">`. |
| Modal / Alert | No native components. Apps wrap `AlertController` / `ModalController` themselves. |
| Toast | Not in lib. Apps need to wrap `ToastController`. |

### D. Architectural patterns missing in the starter

| Pattern | Why it matters |
|---|---|
| HTTP service base class | We hand-rolled `TramitesService` with mock data. Real apps need a generic HTTP wrapper with error normalisation + base URL. |
| Error interceptor | Loading + error states for HTTP calls should be reusable. |
| Loading controller helper | Right now every page manages its own `loading = signal(true)` and `ion-spinner`. A global loading service would unify this. |
| Wizard / multi-step state machine | 3-step forms need a state machine. Right now we hand-roll `step = signal(n)` + manual validation per step. |
| Pull-to-refresh | `<ion-refresher>` is not wired up in any example. Real apps need it. |
| Deep linking / deeplinks | Capacitor deeplinks config is not in the starter. |

### E. TypeScript strictness traps

| Issue | Workaround |
|---|---|
| `(onInputEmit)="onSearch($event.detail?.value)"` — optional chaining works in templates but typing `$event` is `Event`, not `CustomEvent` | Use a wrapper method that takes `Event` and casts internally. |
| `(onValueChange)="filter.set($event as Filter)"` — `as` not supported in Angular template parser | Use a wrapper method like `onFilterChange($event: string)` that does the cast inside TypeScript. |
| `(change)="toggle(item.id, $event.detail.checked)"` — same `$event.detail` typing problem | Wrapper method. |

### F. Build / config findings (already fixed in starter)

| Issue | Fix |
|---|---|
| Sass-loader cannot resolve `desy-ionic/index` without `stylePreprocessorOptions.includePaths: ["node_modules"]` | Added in `angular.json` |
| Karma on root + snap Chromium needs `--no-sandbox` flags | Added `ChromeHeadlessNoSandbox` launcher in `karma.conf.js` |
| SCSS `@use` must come before `@import` | Documented in `src/styles.scss` |

### G. Documentation gaps in the starter

The starter's README covers the happy path well, but is missing:

- How to write E2E tests against pages with async data (loading + empty + populated states).
- How to wire up an HTTP service + base URL + interceptors.
- How to add a wizard / multi-step form using `desyi-step-list`.
- How to handle Capacitor deeplinks for push notifications and external links.
- How to structure i18n (`@angular/localize` install + `es`/`ca` message extraction).

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
   - `alert.service.ts` (we already wrote one in this fork — promote it)

4. **Improve `src/app/core/services/alert.service.ts`** (already drafted):
   - Add `ToastService` sibling (wraps `ToastController`).
   - Add `ModalService` sibling (wraps `ModalController`).

5. **Add a wizard example** (`/features/wizard-example/`):
   - Three-step form using `desyi-step-list`.
   - One `FormGroup` per step.
   - Step state mutated via a single `setStep(n)` helper.

6. **Update README**:
   - Add "Patterns" section: HTTP service, interceptors, wizards, refresh, deeplinks.
   - Add "Components you'll probably build yourself" callout.
   - Document the typing workarounds for `desy-ionic` events.

7. **Open issues upstream on `gorilas/desy-ionic`**:
   - Export `IDesy*` interfaces from `public-api.ts`.
   - Add `[color]` input to `desyi-pill` and `desyi-text` for consistency.
   - Add `[currentStep]` (or `[(currentStep)]`) to `desyi-step-list`.
   - Add a `<desyi-file-upload>` component.
   - Consider `<desyi-toast>`, `<desyi-modal>` first-class components.

## Validation verdict

> **The starter is a good baseline but is missing 4–5 shared components and 3–4 utility helpers before it covers a real app's needs without forcing every team to reinvent them.**

The friction was **not** in the setup (it works), the build (clean), or the test setup (5/5 Karma specs pass). The friction was in **what's not there yet** — which is exactly the kind of finding this fork is meant to surface.