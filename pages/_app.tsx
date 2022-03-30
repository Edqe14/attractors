import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Provider as StoreProvider } from '@/hooks/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Attractors</title>

        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta property="description" content="Chaotic Attractors Visualization" />
        <meta property="og:title" content="Attractors" />
        <meta property="og:site_name" content="Edqe_" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Chaotic Attractors Visualization" />
        <meta name="theme-color" content="#111827" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <StoreProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionOptions={{ key: 'mantine', prepend: false }}
          theme={{
            colorScheme: 'dark',
          }}
        >
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </StoreProvider>
    </>
  );
}

export default MyApp;
