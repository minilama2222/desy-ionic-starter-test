# DESY Ionic Starter

![Project Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Angular](https://img.shields.io/badge/Angular-19-red.svg?logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-8-3880ff.svg?logo=ionic&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-6-119eff.svg?logo=capacitor&logoColor=white)
![Node Version](https://img.shields.io/badge/node-%3E%3D20.19.0%20%3C23.0.0-green.svg?logo=node.js&logoColor=white)
![License: EUPL-1.2](https://img.shields.io/badge/License-EUPL--1.2-yellow.svg)

This repository is a **starter project (template)** to bootstrap mobile and web applications using
the [DESY Design System](https://desy.aragon.es/) on top of **Angular 19** and **Ionic 8**.

It is intended as a ready-to-use, up-to-date starting point for projects that will consume
[`desy-ionic`](https://www.npmjs.com/package/desy-ionic) (the DESY mobile component library)
and optionally [`desy-html`](https://www.npmjs.com/package/desy-html) for CSS tokens and images.

## What you get

- A **standalone Angular 19 + Ionic 8** app with no NgModule boilerplate.
- **`desy-ionic` and `desy-html`** wired up as npm dependencies — peer dependencies match the
  library's declared versions.
- Four example features you can copy from:
  - `home` — landing page with four feature cards.
  - `tabs-example` — bottom tabs container with four child pages (search, favorites, profile).
  - `forms-example` — full reactive form with `desyi-input`, `desyi-select`, `desyi-datetime`,
    `desyi-checkbox-group`, `desyi-radio-group` and `desyi-button`.
  - `list-example` — filterable list with `desyi-segment`, `desyi-radio`, `desyi-checkbox`.
- A reusable set of shared components: `app-header`, `app-footer`, `app-empty-state`.
- A small `LoggerService` in `src/app/core/services` with unit tests (Karma + Jasmine).
- **Playwright** end-to-end tests covering the four features.
- **Capacitor** pre-configured for native builds (iOS / Android) — opt-in.
- **Tailwind CSS 3** available on top of the desy-ionic theme tokens.

## Prerequisites

- Node.js >= 20.19.0 < 23.0.0
- npm >= 10.0.0
- Angular CLI 19.x (or use `npx ng …`)
- Optional for native builds: Xcode (iOS), Android Studio + JDK 17 (Android), Capacitor CLI.

## Quick start

```bash
# 1. Clone or scaffold from this template
git clone https://github.com/minilama2222/desy-ionic-starter.git
cd desy-ionic-starter

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run start           # → http://localhost:4200
# or, if you prefer the Ionic CLI defaults:
npm run ionic:serve     # → http://localhost:8100
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run start` | Dev server with HMR (`ng serve`, port 4200). |
| `npm run ionic:serve` | Same, but bound to all interfaces on port 8100. |
| `npm run build` | Production build into `dist/desy-ionic-starter`. |
| `npm run watch` | Development build with file watching. |
| `npm test` | Karma + Jasmine unit tests (single-run with `--watch=false`). |
| `npm run e2e` | Playwright E2E tests (boots `npm run start` automatically). |
| `npm run lint` | ESLint over `src/**`. |
| `npm run format` | Prettier over the project. |
| `npm run cap:sync` | Copy the built web assets into the native projects. |
| `npm run cap:open:android` | Open the Android project in Android Studio. |
| `npm run cap:open:ios` | Open the iOS project in Xcode. |

## Project structure

```
src/
├── app/
│   ├── app.component.ts       # <ion-app> + <ion-router-outlet>
│   ├── app.config.ts          # provideRouter, provideIonicAngular, etc.
│   ├── app.routes.ts          # top-level routes (loadComponent everywhere)
│   ├── core/
│   │   └── services/
│   │       ├── logger.service.ts
│   │       └── logger.service.spec.ts
│   ├── shared/
│   │   └── components/
│   │       ├── app-header/         # <app-header [title] [showBackButton]>
│   │       ├── app-footer/         # <app-footer [copyrightYear] [license]>
│   │       └── app-empty-state/    # <app-empty-state [title] [description]>
│   └── features/
│       ├── home/                   # landing
│       ├── tabs-example/           # container + 4 tabs
│       ├── forms-example/          # ReactiveForms showcase
│       └── list-example/           # filterable list
├── assets/                        # icons, images, i18n
├── environments/
├── index.html
├── main.ts                        # bootstrapApplication(AppComponent, appConfig)
└── styles.scss                    # Ionic core CSS + Tailwind + desy-ionic theme

tests/                             # Playwright E2E specs
├── smoke.spec.ts
├── tabs-example.spec.ts
├── forms-example.spec.ts
└── list-example.spec.ts

capacitor.config.ts                # appId, appName, webDir
ionic.config.json
angular.json
package.json
playwright.config.ts
karma.conf.js
```

## Conventions

- All components are **standalone** (no NgModule). Each component declares what it imports
  in its own `@Component({ imports: […] })`.
- Component selector prefixes:
  - `app-*` — components owned by the starter (`app-header`, `app-footer`, `app-empty-state`, …).
  - `ion-*` — components from `@ionic/angular`.
  - `desyi-*` — components from `desy-ionic`.
- Every page sets `changeDetection: ChangeDetectionStrategy.OnPush`.
- Inputs and outputs use the classical `@Input()` / `@Output()` syntax for consistency with
  the rest of the DESY ecosystem. Signals are used internally for derived state.
- Styling uses **SCSS** plus Tailwind utilities. Global CSS lives in `src/styles.scss`.
- Theme tokens exposed by `desy-ionic` are available as CSS custom properties
  (`--desy-color-primary`, etc.).

## Adding a new feature

1. Create a folder under `src/app/features/<feature-name>/`.
2. Inside, create a standalone page component `<feature>.page.ts` + `.html` + `.scss`.
3. Register the lazy route in `src/app/app.routes.ts`:

   ```ts
   {
     path: 'my-feature',
     title: 'Mi feature · DESY Ionic',
     loadComponent: () => import('./features/my-feature/my-feature.page').then(m => m.MyFeaturePage)
   }
   ```

4. Add a Playwright spec under `tests/<feature>.spec.ts`.

## Building natively with Capacitor

The starter ships with Capacitor configured but **without the native projects** (they are
gitignored). To turn a build into a runnable iOS / Android app:

```bash
# 1. Build the web bundle
npm run build

# 2. Add the native projects (only the first time)
npx cap add ios
npx cap add android

# 3. Sync web assets into the native projects
npm run cap:sync

# 4. Open in the native IDE
npm run cap:open:android   # Android Studio
npm run cap:open:ios       # Xcode
```

## Troubleshooting

- **`desyi-*` component not found** — run `npm install` again. Make sure `desy-ionic`
  is listed under `dependencies` in `package.json`.
- **Ionic directives/styles not loading** — confirm `src/styles.scss` imports the eight
  `@ionic/angular/css/*` files **before** the Tailwind directives and the desy-ionic theme.
- **Tests failing because of CSS imports** — `karma.conf.js` already excludes the
  Ionic CSS via `styles: ['src/styles.scss']`; if you add new global CSS, keep it in
  that file.

## License

This project is licensed under the [EUPL-1.2 License](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12).
This covers both the codebase and any sample code in the documentation.

## Maintainers

DESY Ionic Starter is maintained by **SDA Servicios Digitales de Aragón (SDA)**, Spain.

📧 Contact: sda@aragon.es