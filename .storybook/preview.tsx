import { Preview } from '@storybook/react';
import 'styles/index.css';
import { fontsClassName } from 'lib/utils/fonts';
import { Providers } from 'ui/app/Providers';

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    Story => (
      <Providers>
        <div className={fontsClassName}>
          <Story />
        </div>
      </Providers>
    ),
  ],
};

export default preview;
