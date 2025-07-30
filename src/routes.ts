import { index, rootRoute, route } from '@tanstack/virtual-file-routes'

// Routes must be declared here for the codegen to generate the appropriate 
// route types in the routeTree.gen.ts file. Without the declaration here, 
// you will get type errors when attempting to define the routes in the 
// specific route files (e.g. createFileRoute).

export const routes = rootRoute('root.tsx', [
    index('index.tsx'),
    route('/about', 'about.tsx'),
    route('/explorations/graphql/spacex', 'explorations/graphql/spacex/spacex.tsx', [
        index('explorations/graphql/spacex/spacex.index.tsx'),
        route('/launch/$launchId', 'explorations/graphql/spacex/spacex.launch.$launchId.tsx')
    ]),
    route('/explorations/interactions/playing-cards', 'explorations/interactions/playing-cards.tsx')
]);