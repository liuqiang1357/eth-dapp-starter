import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import 'styles/global.css';
import { fontsClassName } from 'lib/utils/fonts';
import { Header } from 'ui/app/header';
import { Providers } from 'ui/app/providers';

export const metadata: Metadata = {
  title: 'Eth Dapp Starter',
};

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
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
