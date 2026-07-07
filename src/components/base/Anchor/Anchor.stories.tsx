import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatAnchor from './CometChatAnchor';

const meta = {
  title: 'Base Components/Anchor',
  component: CometChatAnchor,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatAnchor>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { key: 'section1', href: '#section1', title: 'Section 1' },
  { key: 'section2', href: '#section2', title: 'Section 2' },
  { key: 'section3', href: '#section3', title: 'Section 3' },
];

export const Default: Story = {
  args: { items },
};

export const Horizontal: Story = {
  args: { items, direction: 'horizontal' },
};

export const WithNestedChildren: Story = {
  args: {
    items: [
      {
        key: 'parent',
        href: '#parent',
        title: 'Parent Section',
        children: [
          { key: 'child1', href: '#child1', title: 'Child 1' },
          { key: 'child2', href: '#child2', title: 'Child 2' },
        ],
      },
      { key: 'other', href: '#other', title: 'Other Section' },
    ],
  },
};
