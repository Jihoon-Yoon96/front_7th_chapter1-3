import type { Meta, StoryObj } from '@storybook/react';

import Calendar, { CalendarView } from './Calendar';
import { Event, RepeatType } from '../types';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    view: { control: 'radio', options: ['month', 'week'] },
    currentDate: { control: 'date' },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

// --- Mock Data & Functions --- //
const generalEvent: Event = {
  id: '1',
  title: '일반 일정',
  date: '2025-11-03', // 11월 첫째 주 월요일
  startTime: '10:00',
  endTime: '11:00',
  repeat: { type: 'none', interval: 1 },
  description: '',
  location: '',
  category: '업무',
  notificationTime: 0,
};

const recurringEvent: Event = {
  id: '2',
  title: '반복 일정',
  date: '2025-11-05', // 11월 첫째 주 수요일
  startTime: '14:00',
  endTime: '15:00',
  repeat: { type: 'daily', interval: 1 },
  description: '',
  location: '',
  category: '개인',
  notificationTime: 15,
};

const longTitleEvent: Event = {
  id: '3',
  title: '아주 긴 제목을 가진 일반 일정 테스트',
  date: '2025-11-07', // 11월 첫째 주 금요일
  startTime: '16:00',
  endTime: '17:00',
  repeat: { type: 'none', interval: 1 },
  description: '',
  location: '',
  category: '가족',
  notificationTime: 0,
};

const sampleHolidays = {
  '2025-11-06': '휴일',
};

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
  return <Calendar {...storyArgs} />;
};

// --- Base Story Args --- //
const baseArgs = {
  onPrev: () => console.log('Prev clicked'),
  onNext: () => console.log('Next clicked'),
  setView: (view: CalendarView) => console.log('Set view to:', view),
  editEventDateByDrag: async () => console.log('Event dragged:'),
  getRepeatTypeLabel: getRepeatTypeLabel,
  // handleEditEvent: (event: any) => console.log('Editing event:', event),
};

// --- Stories --- //

export const MonthViewDefault: Story = {
  args: {
    ...baseArgs,
    view: 'month',
    currentDate: new Date('2025-11-01'), // 11월 첫째 날
    events: [generalEvent, recurringEvent, longTitleEvent],
    notifiedEvents: [generalEvent.id], // 일반 일정을 알림 상태로
    holidays: sampleHolidays,
  },
  render: renderStory,
};

export const WeekViewDefault: Story = {
  args: {
    ...baseArgs,
    view: 'week',
    currentDate: new Date('2025-11-03'), // 11월 첫째 주 월요일
    events: [generalEvent, recurringEvent, longTitleEvent],
    notifiedEvents: [recurringEvent.id], // 반복 일정을 알림 상태로
    holidays: {},
  },
  render: renderStory,
};

export const MonthViewEmpty: Story = {
  args: {
    ...baseArgs,
    view: 'month',
    currentDate: new Date('2025-11-01'),
    events: [],
    notifiedEvents: [],
    holidays: {},
  },
  render: renderStory,
};

export const WeekViewEmpty: Story = {
  args: {
    ...baseArgs,
    view: 'week',
    currentDate: new Date('2025-11-03'),
    events: [],
    notifiedEvents: [],
    holidays: {},
  },
  render: renderStory,
};
