import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client"; // ✅ Apollo setup

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}> {/* ✅ Wraps the app with Apollo */}
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
