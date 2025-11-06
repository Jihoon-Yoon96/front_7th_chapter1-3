import React from 'react';
import { Stack } from '@mui/material';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { Event, RepeatType } from '../types';

export type CalendarView = 'month' | 'week';

interface CalendarProps {
  // Props for CalendarHeader
  view: CalendarView;
  setView: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;

  // Props for MonthView and WeekView
  currentDate: Date;
  events: Event[];
  notifiedEvents: string[];
  editEventDateByDrag: (eventInfo: Partial<Event>) => Promise<void>;
  getRepeatTypeLabel: (type: RepeatType) => string;
  handleEditEvent: (event: Event) => void;

  // Props for MonthView only
  holidays: Record<string, string>;
}

const Calendar: React.FC<CalendarProps> = ({
  view,
  setView,
  onPrev,
  onNext,
  currentDate,
  events,
  holidays,
  ...rest
}) => {
  return (
    <Stack spacing={5} flex={1}>
      <CalendarHeader view={view} setView={setView} onPrev={onPrev} onNext={onNext} />
      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          filteredEvents={events}
          holidays={holidays}
          {...rest}
        />
      ) : (
        <WeekView currentDate={currentDate} filteredEvents={events} {...rest} />
      )}
    </Stack>
  );
};

export default Calendar;
