import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { LaunchesDataTable } from './launches-table'

const client = new ApolloClient({
    uri: 'https://spacex-production.up.railway.app/',
    cache: new InMemoryCache(),
})

export function SpaceX() {

    return (
        <div className='p-3'>
            <h1 className='mb-3'>SpaceX Launches</h1>
            <div className='pb-3'>
                The following table is populated via requests to a <a href='https://studio.apollographql.com/public/SpaceX-pxxbxen' target='_blank' className='italic underline'>public SpaceX mission control GraphQL API</a>.
                The table and related functionality was built around the limited data provided by the API.
            </div>
            <ApolloProvider client={client}>
                <LaunchesDataTable />
            </ApolloProvider>
        </div >
    )
}