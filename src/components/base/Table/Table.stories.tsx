import type { Meta, StoryObj } from '@storybook/react-vite';
import CometChatDataTable from './CometChatDataTable';
import CometChatTag from '../Tag/CometChatTag';

interface Member extends Record<string, unknown> {
  key: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
}

const dataSource: Member[] = [
  { key: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { key: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { key: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Invited' },
  { key: '4', name: 'David Lee', email: 'david@example.com', role: 'Editor', status: 'Active' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: Member['status']) => (
      <CometChatTag size="sm">{status}</CometChatTag>
    ),
  },
];

const meta: Meta<typeof CometChatDataTable> = {
  title: 'Base Components/Data Table',
  component: CometChatDataTable,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CometChatDataTable>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <CometChatDataTable<Member> columns={columns} dataSource={dataSource} />
    </div>
  ),
};

export const WithCardHeader: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <CometChatDataTable<Member>
        columns={columns}
        dataSource={dataSource}
        cardHeader={{
          title: 'Team Members',
          description: 'Manage the people in your workspace.',
        }}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <CometChatDataTable<Member> size="sm" columns={columns} dataSource={dataSource} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <CometChatDataTable<Member> columns={columns} dataSource={[]} loading />
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <CometChatDataTable<Member>
        columns={columns}
        dataSource={[]}
        emptyText="No members yet"
      />
    </div>
  ),
};

export const WithPagination: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <CometChatDataTable<Member>
        columns={columns}
        dataSource={dataSource}
        pagination={{ current: 1, pageSize: 2, total: dataSource.length }}
      />
    </div>
  ),
};
