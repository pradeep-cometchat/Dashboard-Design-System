import type { Meta, StoryObj } from '@storybook/react-vite';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import CometChatUpload from './CometChatUpload';

const meta = {
  title: 'Base Components/Upload',
  component: CometChatUpload,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatUpload>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    children: (
      <button>
        <UploadOutlined /> Click to Upload
      </button>
    ),
  },
};

export const Dragger: Story = {
  args: {
    dragger: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    children: (
      <div style={{ padding: '24px', width: 320 }}>
        <p style={{ fontSize: 32, margin: 0 }}>
          <InboxOutlined />
        </p>
        <p>Click or drag file to this area to upload</p>
        <p style={{ color: '#888' }}>Support for a single or bulk upload.</p>
      </div>
    ),
  },
};

export const MultipleFiles: Story = {
  args: {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    multiple: true,
    children: (
      <button>
        <UploadOutlined /> Upload Multiple
      </button>
    ),
  },
};
