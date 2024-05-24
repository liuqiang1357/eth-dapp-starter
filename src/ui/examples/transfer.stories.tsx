import { Meta, StoryObj } from '@storybook/react';
import { Transfer } from './transfer';

const meta: Meta<typeof Transfer> = {
  component: Transfer,
  parameters: {
    useWeb3Buttons: true,
  },
};

export default meta;

type Story = StoryObj<typeof Transfer>;

export const Default: Story = {};
