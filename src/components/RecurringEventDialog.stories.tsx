import type { Meta, StoryObj } from '@storybook/react';
import RecurringEventDialog from './RecurringEventDialog';
import { Event } from '../types';

const meta: Meta<typeof RecurringEventDialog> = {
  title: 'Components/RecurringEventDialog',
  component: RecurringEventDialog,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    mode: { control: 'radio', options: ['edit', 'delete'] },
  },
};

export default meta;
type Story = StoryObj<typeof RecurringEventDialog>;

const sampleEvent: Event = {
  id: '1',
  title: 'Sample Recurring Event',
  date: '2025-11-01',
  startTime: '10:00',
  endTime: '11:00',
  repeat: { type: 'daily', interval: 1 },
};

export const Default: Story = {
  args: {
    open: true,
    onClose: () => console.log('Dialog closed'),
    onConfirm: (editSingleOnly) =>
      console.log(
        `Confirmed: ${editSingleOnly ? 'Single instance' : 'Entire series'}`
      ),
    event: sampleEvent,
    mode: 'edit',
  },
};

export const DeleteMode: Story = {
  args: {
    ...Default.args,
    mode: 'delete',
  },
};

export const Closed: Story = {
  args: {
    ...Default.args,
    open: false,
  },
};
