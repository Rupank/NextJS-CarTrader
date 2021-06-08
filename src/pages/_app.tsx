import { Box, Container, CssBaseline } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";
import { SWRConfig } from "swr";
import { Nav } from "../components/Nav";

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <React.Fragment>
      <Head>
        <title>Car Trader</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Nav />
        <SWRConfig
          value={{ fetcher: (url: string) => axios(url).then((r) => r.data) }}
        >
          <Container maxWidth={false}>
            <Box marginTop={2}>
              <Component {...pageProps} />
            </Box>
          </Container>
        </SWRConfig>
      </ThemeProvider>
    </React.Fragment>
  );
}
export default MyApp;
