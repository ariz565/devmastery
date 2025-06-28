import "../styles.css";
import "../styles/blog-reading.css";
import "../styles/reading.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  // Check if the component has its own layout (for special pages)
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <ClerkProvider>
      {getLayout(<Component {...pageProps} />)}
      <ProgressBar
        height="2px"
        color="#3b82f6"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ClerkProvider>
  );
}
