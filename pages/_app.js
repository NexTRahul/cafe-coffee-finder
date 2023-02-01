import "@/styles/globals.css";
import StoreProvider from "@/store/store-contex";


export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />;
    </StoreProvider>
  );
}
