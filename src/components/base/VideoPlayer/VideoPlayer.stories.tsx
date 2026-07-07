import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatVideoPlayer from './CometChatVideoPlayer';

const meta = {
  title: 'Base Components/Video Player',
  component: CometChatVideoPlayer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CometChatVideoPlayer>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    controls: true,
    width: 480,
  },
};

export const AutoplayMuted: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    controls: true,
    autoPlay: true,
    muted: true,
    loop: true,
    width: 480,
  },
};

export const WithPoster: Story = {
  args: {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
    controls: true,
    width: 480,
  },
};
