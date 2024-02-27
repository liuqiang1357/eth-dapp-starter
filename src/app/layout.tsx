import { ColorSchemeScript } from '@mantine/core';
import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import 'styles/index.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Eth Dapp Starter',
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
