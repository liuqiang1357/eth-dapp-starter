import { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import 'styles/index.css';
import { fontsClassName } from 'lib/utils/fonts';
import { Providers } from 'ui/app/providers';
import { ConnectWallet } from 'ui/app/connect-wallet';
import { SwitchChain } from 'ui/app/switch-chain';
import { useEffect } from 'react';

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    useWeb3Buttons: false,
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story, { parameters }) => {
      useEffect(() => {
        document.body.className += ` ${fontsClassName}`;
      }, []);
      return (
        <Providers>
          <div className="space-y-6">
            {parameters.useWeb3Buttons === true && (
              <div className="flex space-x-4">
                <SwitchChain />
                <ConnectWallet />
              </div>
            )}
            <Story />
          </div>
        </Providers>
      );
    },
  ],
};

export default preview;
