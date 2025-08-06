# Frontend Playground 2025

This is an exploration of the latest web technologies and frameworks used in frontend development in 2025.

[The deployed site can be found here.](https://prasadsilva.github.io/fe-playground-2025/)

## Milestones
* Created a single page _web_ app (SPA) from scratch (using [Vite](https://vite.dev))
  * `npm create vite@latest . -- --template react-swc-ts`
  * The `.` path allowed the command should be run in the target project directory.
  * The `swc` in `react-swc-ts` is for [Speedy Web Compiler](https://swc.rs). It is a faster alternative to babel for transpiling TypeScript/ES6 to other browser targets.
  * The `ts` in `react-swc-ts` is for [TypeScript](https://www.typescriptlang.org). While raw JS is easier to use, strong typing enables cleaner APIs and interfaces across a project. It also enables better developer ergonomics in supported IDEs, such as [Visual Studio Code](https://code.visualstudio.com).
* Added [Tanstack Router](https://tanstack.com/router/latest) for routing support.
  * Tanstack Router is TypeScript first and provides type checks for route definitions.
  * Used [virtual file routes](https://tanstack.com/router/latest/docs/framework/react/routing/virtual-file-routes) to have finer control over route definitions and not conform to the already opinionated framework.
* Added [shadcn/ui](https://ui.shadcn.com) for component and styling support.
  * Shadcn still looks to be the most popular framework in 2025.
  * Works seamlessly with [Tailwind CSS](https://tailwindcss.com).
    * Installed [cva IntelliSense](https://cva.style/docs/getting-started/installation#intellisense) for VS Code.
  * [twMerge](https://github.com/dcastil/tailwind-merge) and [clsx](https://github.com/lukeed/clsx) are used to define the `cn` function that merges classes and resolves conflicts. `clsx` allows for defining classes conditionally in object syntax.
* Deployed the app via [Github Pages](https://pages.github.com).
  * Vite basepath must be set to relative (e.g. `base: ""`) and Tanstack Router config must include the correct base path value (e.g. `basepath: '/fe-playground-2025/'`)
  * 404 redirection can be achieved by placing a copy of `index.html` named `404.html` in the dist directory prior to publishing.
* Added sidebar navigation for the application shell.
  * Used shadcn sidebar component.
* Added dark mode toggle to sidebar footer.
* Added [Apollo client](https://www.apollographql.com/docs/react/get-started) for GraphQL support.
  * Tested publicly available APIs using [Postman](https://www.postman.com/devrel/graphql-examples/overview).
  * [GraphQL Voyager](https://graphql-kit.com/graphql-voyager/) is a good visual tool to view the full schema.
* Added SpaceX Launches demo
  * Index lists all launches available in the public API.
  * Clicking on an individual launch entry navigates to its detail view.
* Added current stack to About page.
* Added Playing Cards demo
  * Drag-n-drop capability and related logic managed via context.
  * Drag-n-drop works as expected on touchscreen devices (mobiles, etc.).

## Todo/Ideas
* Add animation library and demo
* Prettify the SpaceX launch detail view
* Add a D3.js visualization sample (time series chart?)
  * Find a free time series API
* Add React Flow exploration (node based editor/diagramming)
* Add app state support (Redux?)
* Add data fetching support (Tanstack Query?)
* Add a three.js visualization sample (simple FBX model)
* Add a GraphQL data source and visualization sample (SpaceX launches?)
* Add virtual scrolling sample
* ...