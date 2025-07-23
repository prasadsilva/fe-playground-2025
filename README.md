# Frontend Playground 2025

This is an exploration of the latest web technologies and frameworks used in frontend development in 2025.

## Milestones
* Created a single page _web_ app (SPA) from scratch (using [Vite](https://vite.dev))
  * `npm create vite@latest . -- --template react-swc-ts`
  * The `.` path allowed the command should be run in the target project directory.
  * The `swc` in `react-swc-ts` is for [Speedy Web Compiler](https://swc.rs). It is a faster alternative to babel for transpiling TypeScript/ES6 to other browser targets.
  * The `ts` in `react-swc-ts` is for [TypeScript](https://www.typescriptlang.org). While raw JS is easier to use, strong typing enables cleaner APIs and interfaces across a project. It also enables better developer ergonomics in supported IDEs, such as [Visual Studio Code](https://code.visualstudio.com).
* Added [Tanstack Router](https://tanstack.com/router/latest) for routing support.
  * Tanstack Router is TypeScript first and provides type checks for route definitions.
  * Used [virtual file routes](https://tanstack.com/router/latest/docs/framework/react/routing/virtual-file-routes) to have finer control over route definitions and not conform to the already opinionated framework.

## Todo/Ideas
* Add style/theme
* Deploy SPA using Github Pages (with 404 redirect)
* Add app state support (Redux?)
* Add data fetching support (Tanstack Query?)
* Add a three.js visualization sample (simple FBX model)
* Add a D3.js visualization sample (time series chart?)
* Add a GraphQL data source and visualization sample (SpaceX launches?)
* Add virtual scrolling sample
* Add code splitting (see Vite docs), if it's not already automatic
* ...