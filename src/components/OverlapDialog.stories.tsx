import type { Meta, StoryObj } from '@storybook/react';

import OverlapDialog from './OverlapDialog';
import { Event } from '../types';

const meta: Meta<typeof OverlapDialog> = {
  title: 'Components/OverlapDialog',
  component: OverlapDialog,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof OverlapDialog>;

const singleOverlap: Event[] = [
  {
    id: '1',
    title: '기존 일정',
    date: '2025-11-10',
    startTime: '10:00',
    endTime: '11:00',
    repeat: { type: 'none' },
  },
];

const multipleOverlaps: Event[] = [
  {
    id: '1',
    title: '기존 일정 1',
    date: '2025-11-10',
    startTime: '10:00',
    endTime: '11:00',
    repeat: { type: 'none' },
  },
  {
    id: '2',
    title: '기존 일정 2',
    date: '2025-11-10',
    startTime: '10:30',
    endTime: '11:30',
    repeat: { type: 'none' },
  },
];

export const Default: Story = {
  name: 'With Single Overlap',
  args: {
    open: true,
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Confirmed overlap'),
    overlappingEvents: singleOverlap,
  },
};

export const WithMultipleOverlaps: Story = {
  args: {
    ...Default.args,
    overlappingEvents: multipleOverlaps,
  },
};

export const Closed: Story = {
  args: {
    ...Default.args,
    open: false,
  },
};
