import { useEffect } from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/globals.scss';

import Layout from '../components/Layout/Layout';
import store from '../app/store';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(
      <Provider store={store}>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>

        <Component {...pageProps} />

        <Toaster />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </Provider>
  );
}
