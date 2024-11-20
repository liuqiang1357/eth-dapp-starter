import { Metadata } from 'next';
import { ReactNode } from 'react';
import '@/styles/index.css';
import { fontsClassName } from '@/lib/utils/fonts';
import { Header } from '@/ui/app/header';
import { Providers } from '@/ui/app/providers';

export const metadata: Metadata = {
  title: 'Eth Dapp Starter',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontsClassName}>
        <Providers>
          <div className="flex min-h-screen min-w-[1400px] flex-col">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
