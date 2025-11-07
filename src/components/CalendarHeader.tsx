import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack } from '@mui/material';
import React from 'react';

interface CalendarHeaderProps {
  view: 'week' | 'month';
  setView: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ view, setView, onPrev, onNext }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
      <IconButton aria-label="Previous" onClick={onPrev}>
        <ChevronLeft />
      </IconButton>
      <Select
        size="small"
        aria-label="뷰 타입 선택"
        value={view}
        onChange={(e) => setView(e.target.value as 'week' | 'month')}
      >
        <MenuItem value="week" aria-label="week-option">
          Week
        </MenuItem>
        <MenuItem value="month" aria-label="month-option">
          Month
        </MenuItem>
      </Select>
      <IconButton aria-label="Next" onClick={onNext}>
        <ChevronRight />
      </IconButton>
    </Stack>
  );
};

export default CalendarHeader;
