import type { Meta, StoryObj } from '@storybook/react';

import WeekView from './WeekView';
import { Event, RepeatType } from '../types';

const meta: Meta<typeof WeekView> = {
  title: 'Components/WeekView',
  component: WeekView,
  tags: ['autodocs'],
  argTypes: {
    currentDate: { control: 'date' },
  },
};

export default meta;
type Story = StoryObj<typeof WeekView>;

// --- Mock Data --- //
const generalEvent: Event = {
  id: '1',
  title: '주간 일반 일정',
  date: '2025-11-03', // 월요일
  startTime: '10:00',
  endTime: '11:00',
  repeat: { type: 'none' },
};

const recurringEvent: Event = {
  id: '2',
  title: '주간 반복 일정',
  date: '2025-11-05', // 수요일
  startTime: '14:00',
  endTime: '15:00',
  repeat: { type: 'weekly', interval: 1 },
};

const longTitleEvent: Event = {
  id: '3',
  title: '아주 긴 제목을 가진 주간 일정 테스트',
  date: '2025-11-07', // 금요일
  startTime: '16:00',
  endTime: '17:00',
  repeat: { type: 'none' },
};

// --- Helper Functions --- //
const getRepeatTypeLabel = (type: RepeatType) => {
  switch (type) {
    case 'daily':
      return '일';
    case 'weekly':
      return '주';
    case 'monthly':
      return '개월';
    case 'yearly':
      return '년';
    default:
      return '';
  }
};

const renderStory = (args: any) => {
  const storyArgs = {
    ...args,
    currentDate: new Date(args.currentDate),
  };
  return <WeekView {...storyArgs} />;
};

// --- Base Story Args --- //
const baseArgs = {
  currentDate: new Date('2025-11-03'), // 2025년 11월 첫째 주 (월요일)
  editEventDateByDrag: async (eventInfo: any) => console.log('Event dragged:', eventInfo),
  getRepeatTypeLabel: getRepeatTypeLabel,
  handleEditEvent: (event: any) => console.log('Editing event:', event),
};

// --- Stories --- //

export const Default: Story = {
  name: 'Default (Mixed)',
  args: {
    ...baseArgs,
    filteredEvents: [generalEvent, recurringEvent, longTitleEvent],
    notifiedEvents: [],
  },
  render: renderStory,
};

export const OnlyGeneralEvent: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [generalEvent, longTitleEvent],
    notifiedEvents: [],
  },
  render: renderStory,
};

export const OnlyRecurringEvent: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [recurringEvent],
    notifiedEvents: [],
  },
  render: renderStory,
};

const manyEvents: Event[] = [
  generalEvent,
  {
    id: '4',
    title: '추가 이벤트 1',
    date: '2025-11-03',
    startTime: '12:00',
    endTime: '13:00',
    repeat: { type: 'none' },
  },
  {
    id: '5',
    title: '추가 이벤트 2',
    date: '2025-11-03',
    startTime: '13:00',
    endTime: '14:00',
    repeat: { type: 'none' },
  },
  {
    id: '6',
    title: '추가 이벤트 3',
    date: '2025-11-03',
    startTime: '15:00',
    endTime: '16:00',
    repeat: { type: 'none' },
  },
];

export const WithManyEvents: Story = {
  args: {
    ...baseArgs,
    filteredEvents: manyEvents,
    notifiedEvents: [],
  },
  render: renderStory,
};

export const WithNotifiedEvents: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [generalEvent, recurringEvent],
    notifiedEvents: ['1'], // generalEvent (id: '1')를 알림 상태로 설정
  },
  render: renderStory,
};

export const Empty: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [],
    notifiedEvents: [],
  },
  render: renderStory,
};
