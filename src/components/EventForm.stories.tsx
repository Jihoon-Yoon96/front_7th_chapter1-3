import type { Meta, StoryObj } from '@storybook/react';
import EventForm from './EventForm';
import { Event, RepeatType } from '../types';

const meta: Meta<typeof EventForm> = {
  title: 'Components/EventForm',
  component: EventForm,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EventForm>;

// --- Mock Data & Constants --- //
const mockCategories = ['업무', '개인', '가족'];
const mockNotificationOptions = [
  { value: 0, label: '알림 없음' },
  { value: 5, label: '5분 전' },
  { value: 15, label: '15분 전' },
  { value: 60, label: '1시간 전' },
];

const mockEditingEvent: Event = {
  id: '1',
  title: '기존 이벤트 수정',
  date: '2025-11-20',
  startTime: '10:00',
  endTime: '11:30',
  description: '이것은 수정 중인 이벤트입니다.',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'none', interval: 1 },
};

// --- Base Story Args --- //
const baseArgs = {
  // State values
  title: '',
  date: '2025-11-20',
  startTime: '09:00',
  endTime: '10:00',
  description: '',
  location: '',
  category: mockCategories[0],
  isRepeating: false,
  repeatType: 'none' as RepeatType,
  repeatInterval: 1,
  repeatEndDate: '',
  notificationTime: 0,
  startTimeError: '',
  endTimeError: '',
  editingEvent: null,
  // Mock functions
  setTitle: () => {},
  setDate: () => {},
  setDescription: () => {},
  setLocation: () => {},
  setCategory: () => {},
  setIsRepeating: () => {},
  setRepeatType: () => {},
  setRepeatInterval: () => {},
  setRepeatEndDate: () => {},
  setNotificationTime: () => {},
  handleStartTimeChange: () => {},
  handleEndTimeChange: () => {},
  addOrUpdateEvent: async () => console.log('Form submitted'),
  // Constants
  categories: mockCategories,
  notificationOptions: mockNotificationOptions,
};

// --- Stories --- //

export const Default: Story = {
  name: 'Default (Add Mode)',
  args: {
    ...baseArgs,
  },
};

export const EditMode: Story = {
  args: {
    ...baseArgs,
    title: mockEditingEvent.title,
    date: mockEditingEvent.date,
    startTime: mockEditingEvent.startTime,
    endTime: mockEditingEvent.endTime,
    description: mockEditingEvent.description,
    location: mockEditingEvent.location,
    category: mockEditingEvent.category,
    editingEvent: mockEditingEvent,
  },
};

export const WithRepeatOptions: Story = {
  args: {
    ...baseArgs,
    isRepeating: true,
    repeatType: 'daily',
  },
};

export const WithInputErrors: Story = {
  args: {
    ...baseArgs,
    startTime: 'invalid-time',
    endTime: '10:00',
    startTimeError: '잘못된 시간 형식입니다.',
    endTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
  },
};
