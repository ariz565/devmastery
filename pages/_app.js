import "../styles.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
      <ProgressBar
        height="2px"
        color="#3b82f6"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </ClerkProvider>
  );
}
