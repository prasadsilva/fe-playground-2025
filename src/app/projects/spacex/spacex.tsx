import { ApolloClient, ApolloProvider, gql, InMemoryCache, useQuery } from '@apollo/client'

const client = new ApolloClient({
    uri: 'https://spacex-production.up.railway.app/',
    cache: new InMemoryCache(),
})

interface Launch {
    mission_name: string,
    launch_date_local: Date,
}

interface PastLaunches {
    launchesPast: Launch[]
}

const GET_LAST_10_LAUNCHES = gql`
    query GetLast10Launches {
        launchesPast(limit: 10) {
            mission_name
            launch_date_local
            launch_site {
                site_name_long
            }
            links {
                article_link
                video_link
            }
            rocket {
                rocket_name
            }
        }
    }
`

function usePastLaunchesQuery() {
    return useQuery<PastLaunches>(GET_LAST_10_LAUNCHES)
}

function LaunchesDataTable() {
    const { loading, error, data } = usePastLaunchesQuery()

    if (loading || !data) return <div>Loading...</div>
    if (error) return <div>Error : {error.message}</div>

    console.log(data);
    return data.launchesPast.map((data, index: number) => (
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