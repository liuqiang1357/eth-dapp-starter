import { ColorSchemeScript } from '@mantine/core';
import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import 'styles/index.css';
import { fontsClassName } from 'lib/utils/fonts';
import { Header } from 'ui/app/Header';
import { Providers } from 'ui/app/Providers';

export const metadata: Metadata = {
  title: 'Eth Dapp Starter',
};

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={fontsClassName}>
        <Providers>
          <div className="relative flex min-h-screen min-w-[1440px] flex-col">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
