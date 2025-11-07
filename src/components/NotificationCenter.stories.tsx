import type { Meta, StoryObj } from '@storybook/react';

import NotificationCenter from './NotificationCenter';

const meta: Meta<typeof NotificationCenter> = {
  title: 'Components/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationCenter>;

// --- Mock Data --- //
const singleNotification = [{ message: '일정이 성공적으로 추가되었습니다.' }];
const multipleNotifications = [
  { message: '일정이 성공적으로 수정되었습니다.' },
  { message: '일정이 삭제되었습니다.' },
  { message: '알림: 회의 시작 15분 전입니다.' },
];

// --- Base Story Args --- //
const baseArgs = {
  notifications: singleNotification,
  setNotifications: () => {},
};

// --- Stories --- //

export const Default: Story = {
  name: 'With Single Notification',
  args: {
    ...baseArgs,
  },
};

export const MultipleNotifications: Story = {
  args: {
    ...baseArgs,
    notifications: multipleNotifications,
  },
};

export const Empty: Story = {
  args: {
    ...baseArgs,
    notifications: [],
  },
};
