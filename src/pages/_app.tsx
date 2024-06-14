import type { AppProps } from "next/app";
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <Component {...pageProps} />
    </GlobalStateProvider>
  );
}
