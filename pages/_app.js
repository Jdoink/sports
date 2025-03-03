import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client"; // ✅ Apollo setup
import "../styles/globals.css"; // Optional: If you have global styles

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}> {/* ✅ Wraps the app with Apollo */}
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
