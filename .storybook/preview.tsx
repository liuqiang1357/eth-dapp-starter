import { Preview } from '@storybook/react';
import { useTheme } from 'next-themes';
import { useDarkMode } from 'storybook-dark-mode';
import 'styles/index.css';
import { fontsClassName } from 'lib/utils/fonts';
import { Providers } from 'ui/app/providers';
import { ConnectWallet } from 'ui/app/connect-wallet';
import { FC, useEffect } from 'react';

const ThemeSetter: FC = () => {
  const darkMode = useDarkMode();
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode]);
  return null;
};

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
      useEffect(() => {
        document.body.className += ` ${fontsClassName}`;
      }, []);
      return (
        <Providers>
          <ThemeSetter />
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
