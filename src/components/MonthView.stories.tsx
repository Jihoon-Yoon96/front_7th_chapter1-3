import type { Meta, StoryObj } from '@storybook/react';
import MonthView from './MonthView';
import { Event, RepeatType } from '../types';

// Storybook에서 컴포넌트를 어떻게 표시할지 정의합니다.
const meta: Meta<typeof MonthView> = {
  title: 'Components/MonthView',
  component: MonthView,
  tags: ['autodocs'],
  argTypes: {
    currentDate: { control: 'date' },
    filteredEvents: { control: 'object' },
    holidays: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof MonthView>;

// Mock 데이터: 실제 애플리케이션에서 받아오는 데이터 대신 사용할 가짜 데이터입니다.
const sampleEvents: Event[] = [
  {
    id: '1',
    title: '일반 일정',
    date: '2025-11-10',
    startTime: '10:00',
    endTime: '11:00',
    repeat: { type: 'none' },
  },
  {
    id: '2',
    title: '반복 일정',
    date: '2025-11-12',
    startTime: '14:00',
    endTime: '15:00',
    repeat: { type: 'daily', interval: 1 },
  },
  {
    id: '3',
    title: '아주 긴 제목을 가진 일반 일정 테스트',
    date: '2025-11-15',
    startTime: '16:00',
    endTime: '17:00',
    repeat: { type: 'none' },
  },
];

const sampleHolidays = {
  '2025-11-11': '빼빼로데이',
};

// Storybook에서 사용할 함수 Mock
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

// 기본 스토리를 정의합니다.
export const Default: Story = {
  args: {
    currentDate: new Date('2025-11-01'),
    filteredEvents: sampleEvents,
    notifiedEvents: [],
    holidays: sampleHolidays,
    editEventDateByDrag: async (eventInfo) => {
      console.log('Event dragged:', eventInfo);
    },
    getRepeatTypeLabel: getRepeatTypeLabel,
    handleEditEvent: (event) => {
      console.log('Editing event:', event);
    },
  },
  render: (args) => {
    // Storybook 컨트롤에서 날짜를 변경하면 문자열로 전달되므로, Date 객체로 변환해줍니다.
    const storyArgs = {
      ...args,
      currentDate: new Date(args.currentDate),
    };
    return <MonthView {...storyArgs} />;
  },
};

export const Empty: Story = {
  args: {
    currentDate: new Date('2025-11-01'),
    filteredEvents: [],
    notifiedEvents: [],
    holidays: {},
    editEventDateByDrag: async (eventInfo) => {
      console.log('Event dragged:', eventInfo);
    },
    getRepeatTypeLabel: getRepeatTypeLabel,
    handleEditEvent: (event) => {
      console.log('Editing event:', event);
    },
  },
  render: (args) => {
    const storyArgs = {
      ...args,
      currentDate: new Date(args.currentDate),
    };
    return <MonthView {...storyArgs} />;
  },
};
