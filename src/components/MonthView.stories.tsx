import type { Meta, StoryObj } from '@storybook/react';

import MonthView from './MonthView';
import { Event, RepeatType } from '../types';

const meta: Meta<typeof MonthView> = {
  title: 'Components/MonthView',
  component: MonthView,
  tags: ['autodocs'],
  argTypes: {
    currentDate: { control: 'date' },
  },
};

export default meta;
type Story = StoryObj<typeof MonthView>;

// --- Mock Data --- //
const generalEvent: Event = {
  id: '1',
  title: '일반 일정',
  date: '2025-11-10',
  startTime: '10:00',
  endTime: '11:00',
  repeat: { type: 'none' },
};

const recurringEvent: Event = {
  id: '2',
  title: '반복 일정',
  date: '2025-11-12',
  startTime: '14:00',
  endTime: '15:00',
  repeat: { type: 'daily', interval: 1 },
};

const longTitleEvent: Event = {
  id: '3',
  title: '아주 긴 제목을 가진 일반 일정 테스트',
  date: '2025-11-15',
  startTime: '16:00',
  endTime: '17:00',
  repeat: { type: 'none' },
};

const sampleHolidays = {
  '2025-11-11': '빼빼로데이',
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

const renderStory = (args: unknown) => {
  const storyArgs = {
    ...args,
    currentDate: new Date(args.currentDate),
  };
  return <MonthView {...storyArgs} />;
};

// --- Base Story Args --- //
const baseArgs = {
  currentDate: new Date('2025-11-01'),
  // editEventDateByDrag: async (eventInfo: any) => console.log('Event dragged:', eventInfo),
  getRepeatTypeLabel: getRepeatTypeLabel,
  // handleEditEvent: (event: any) => console.log('Editing event:', event),
};

// --- Stories --- //

export const Default: Story = {
  name: 'Default (Mixed)',
  args: {
    ...baseArgs,
    filteredEvents: [generalEvent, recurringEvent, longTitleEvent],
    notifiedEvents: [],
    holidays: sampleHolidays,
  },
  render: renderStory,
};

export const OnlyGeneralEvent: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [generalEvent, longTitleEvent],
    notifiedEvents: [],
    holidays: {},
  },
  render: renderStory,
};

export const OnlyRecurringEvent: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [recurringEvent],
    notifiedEvents: [],
    holidays: {},
  },
  render: renderStory,
};

export const OnlyHolidays: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [],
    notifiedEvents: [],
    holidays: sampleHolidays,
  },
  render: renderStory,
};

const manyEvents: Event[] = [
  generalEvent,
  {
    id: '4',
    title: '추가 이벤트 1',
    date: '2025-11-10',
    startTime: '12:00',
    endTime: '13:00',
    repeat: { type: 'none' },
  },
  {
    id: '5',
    title: '추가 이벤트 2',
    date: '2025-11-10',
    startTime: '13:00',
    endTime: '14:00',
    repeat: { type: 'none' },
  },
  {
    id: '6',
    title: '추가 이벤트 3',
    date: '2025-11-10',
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
    holidays: {},
  },
  render: renderStory,
};

export const WithNotifiedEvents: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [generalEvent, recurringEvent],
    notifiedEvents: ['1'], // generalEvent (id: '1')를 알림 상태로 설정
    holidays: {},
  },
  render: renderStory,
};

export const Empty: Story = {
  args: {
    ...baseArgs,
    filteredEvents: [],
    notifiedEvents: [],
    holidays: {},
  },
  render: renderStory,
};
