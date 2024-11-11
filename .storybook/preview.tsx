import { Preview } from '@storybook/react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import '@/styles/index.css';
import { fontsClassName } from '@/lib/utils/fonts';
import { ConnectWallet } from '@/ui/app/connect-wallet';
import { Providers } from '@/ui/app/providers';

const preview: Preview = {
  parameters: {
    darkMode: {
      stylePreview: true,
    },
    nextjs: {
      appDirectory: true,
    },
    useWeb3Buttons: false,
  },
  decorators: [
    (Story, { parameters }) => {
      const darkMode = useDarkMode();

      const { setTheme } = useTheme();

      useEffect(() => {
        setTheme(darkMode ? 'dark' : 'light');
      }, [darkMode, setTheme]);

      useEffect(() => {
        document.body.className += ` ${fontsClassName}`;
      }, []);

      return (
        <Providers>
          <div className="space-y-6">
            {parameters.useWeb3Buttons === true && <ConnectWallet />}
            <Story />
          </div>
        </Providers>
      );
    },
  ],
};

export default preview;
