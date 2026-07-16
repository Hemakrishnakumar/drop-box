import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';



const uri = import.meta.env.VITE_GRAPHQL_URL ?? '/graphql';

export const graphqlClient = new ApolloClient({
    link: new HttpLink({
        uri,
        credentials: 'include',
    }),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    profile: {
                        merge: false,
                    },
                },
            },
        },
    }),
});
