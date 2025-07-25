import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useLaunchesQuery } from './hooks'

const client = new ApolloClient({
    uri: 'https://spacex-production.up.railway.app/',
    cache: new InMemoryCache(),
})

function LaunchesDataTable() {
    const { loading, error, data } = useLaunchesQuery()

    if (loading || !data) return <div>Loading...</div>
    if (error) return <div>Error : {error.message}</div>

    console.log(data);
    return data.launches.map((data, index: number) => (
        <div key={`data_${index}`}>
            <pre>{JSON.stringify(data)}</pre>
            <div>{data.mission_name}</div>
        </div>
    ))
}

export function SpaceX() {

    return (
        <ApolloProvider client={client}>
            <div>SpaceX</div>
            <hr />
            Last 10 launches:
            <LaunchesDataTable />
        </ApolloProvider>
    )
}