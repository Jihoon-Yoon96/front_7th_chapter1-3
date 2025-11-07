import type { Meta, StoryObj } from '@storybook/react';

import EventList from './EventList';
import { Event, RepeatType } from '../types';

const meta: Meta<typeof EventList> = {
  title: 'Components/EventList',
  component: EventList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EventList>;

// --- Mock Data & Functions --- //
const sampleEvents: Event[] = [
  {
    id: '1',
    title: '일반 일정',
    date: '2025-11-10',
    startTime: '10:00',
    endTime: '11:00',
    repeat: { type: 'none', interval: 1 },
    description: '일반 일정에 대한 설명입니다.',
    location: '회의실',
    category: '업무',
    notificationTime: 0,
  },
  {
    id: '2',
    title: '반복 일정',
    date: '2025-11-12',
    startTime: '14:00',
    endTime: '15:00',
    repeat: { type: 'daily', interval: 1 },
    description: '반복 일정에 대한 설명입니다.',
    location: '집',
    category: '개인',
    notificationTime: 15,
  },
];

const mockNotificationOptions = [
  { value: 0, label: '알림 없음' },
  { value: 15, label: '15분 전' },
];

const getRepeatTypeLabel = (type: RepeatType) => {
  if (type === 'daily') return '일';
  if (type === 'weekly') return '주';
  return '';
};

// --- Base Story Args --- //
const baseArgs = {
  searchTerm: '',
  setSearchTerm: () => {},
  filteredEvents: sampleEvents,
  notifiedEvents: [],
  handleEditEvent: () => {},
  handleDeleteEvent: () => {},
  getRepeatTypeLabel: getRepeatTypeLabel,
  notificationOptions: mockNotificationOptions,
};

// --- Stories --- //

export const Default: Story = {
  args: {
    ...baseArgs,
  },
};

export const Empty: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [],
  },
};

export const WithSearchTerm: Story = {
  args: {
    ...baseArgs,
    searchTerm: '반복',
    filteredEvents: sampleEvents.filter((event) => event.title.includes('반복')),
  },
};

export const WithNotifiedEvents: Story = {
  args: {
    ...baseArgs,
    notifiedEvents: ['2'], // '반복 일정'(id: '2')을 알림 상태로 설정
  },
};
