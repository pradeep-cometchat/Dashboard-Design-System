import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatButtonGroup from './CometChatButtonGroup';
import CometChatButton from '../Button/CometChatButton';

const meta = {
  title: 'Base Components/Button Group',
  component: CometChatButtonGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CometChatButtonGroup>
      <CometChatButton hierarchy="secondary">Cancel</CometChatButton>
      <CometChatButton hierarchy="primary">Save</CometChatButton>
    </CometChatButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <CometChatButtonGroup direction="vertical" gap={8}>
      <CometChatButton hierarchy="secondary">Top</CometChatButton>
      <CometChatButton hierarchy="secondary">Middle</CometChatButton>
      <CometChatButton hierarchy="secondary">Bottom</CometChatButton>
    </CometChatButtonGroup>
  ),
};

export const Centered: Story = {
  render: () => (
    <CometChatButtonGroup align="center" gap={16}>
      <CometChatButton hierarchy="tertiary">One</CometChatButton>
      <CometChatButton hierarchy="tertiary">Two</CometChatButton>
      <CometChatButton hierarchy="tertiary">Three</CometChatButton>
    </CometChatButtonGroup>
  ),
};
