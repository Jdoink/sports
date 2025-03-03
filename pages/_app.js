import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import "../styles/globals.css"; // Optional: if you have global styles

const client = new ApolloClient({
  uri: "YOUR_GRAPHQL_API_ENDPOINT", // ✅ Replace this with your actual GraphQL API
  cache: new InMemoryCache(),
  ssrMode: false, // ✅ Ensure it's disabled for Next.js
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
