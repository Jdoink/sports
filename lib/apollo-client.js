import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphqlzero.almansi.me/api", // ✅ Temporary GraphQL API
  cache: new InMemoryCache(),
  ssrMode: false, // ✅ Prevents Next.js SSR errors
});

export default client;
