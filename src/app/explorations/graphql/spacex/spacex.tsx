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
            <ApolloProvider client={client}>
                <LaunchesDataTable />
            </ApolloProvider>
        </div >
    )
}