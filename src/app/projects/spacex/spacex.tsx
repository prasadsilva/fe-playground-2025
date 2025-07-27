import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { LaunchesDataTable } from './launches-table'

const client = new ApolloClient({
    uri: 'https://spacex-production.up.railway.app/',
    cache: new InMemoryCache(),
})

export function SpaceX() {

    return (
        <ApolloProvider client={client}>
            <div className='p-3 w-auto'>
                <div>SpaceX</div>
                <hr />
                <LaunchesDataTable />
            </div>
        </ApolloProvider>
    )
}