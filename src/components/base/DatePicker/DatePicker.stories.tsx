import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';
import CometChatDatePicker from './CometChatDatePicker';

const meta = {
  title: 'Base Components/Date Picker',
  component: CometChatDatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Select date',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: dayjs('2026-07-07'),
  },
};

export const MonthPicker: Story = {
  args: {
    picker: 'month',
    placeholder: 'Select month',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: dayjs('2026-07-07'),
  },
};
