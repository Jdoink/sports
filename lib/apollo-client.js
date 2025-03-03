import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://your-graphql-api.com/graphql", // 🔥 REPLACE with your actual API
  cache: new InMemoryCache(),
  ssrMode: false, // ✅ Prevents Next.js SSR errors
});

export default client;
