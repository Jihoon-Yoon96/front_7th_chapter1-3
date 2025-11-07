import { Notifications, Repeat } from '@mui/icons-material';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

import { Event, RepeatType } from '../types';
import { formatMonth, formatWeek, getWeekDates } from '../utils/dateUtils';

// Copied from App.tsx
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
const eventBoxStyles = {
  notified: { backgroundColor: '#ffebee', fontWeight: 'bold', color: '#d32f2f' },
  normal: { backgroundColor: '#f5f5f5', fontWeight: 'normal', color: 'inherit' },
  common: {
    p: 0.5,
    my: 0.5,
    borderRadius: 1,
    minHeight: '18px',
    width: '100%',
    overflow: 'hidden',
  },
};

interface WeekViewProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  editEventDateByDrag: (eventInfo: Partial<Event>) => Promise<void>;
  getRepeatTypeLabel: (type: RepeatType) => string;
  handleEditEvent: (event: Event) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  editEventDateByDrag,
  getRepeatTypeLabel,
  handleEditEvent,
}) => {
  const weekDates = getWeekDates(currentDate);
  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDates.map((date, dayIndex) => (
                <TableCell
                  key={date.toISOString()}
                  sx={{
                    height: '120px',
                    verticalAlign: 'top',
                    width: '14.28%',
                    padding: 1,
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                  }}
                  data-testid="table-cell"
                  className="drag-target"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const draggedEventId = e.dataTransfer.getData('eventId');
                    console.log(date, draggedEventId);
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    if (month < 10) {
                      month = `0${month}`;
                    }
                    let day = date.getDate();
                    const targetDate = `${year}-${month}-${day < 10 ? `0${day}` : day}`;
                    console.log(targetDate);
                    await editEventDateByDrag({ id: draggedEventId, date: targetDate });
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {date.getDate()}
                  </Typography>
                  {filteredEvents
                    .filter((event) => new Date(event.date).toDateString() === date.toDateString())
                    .map((event) => {
                      const isNotified = notifiedEvents.includes(event.id);
                      const isRepeating = event.repeat.type !== 'none';
                      return (
                        // 이벤트 표기 영역
                        <Box
                          key={event.id}
                          sx={{
                            ...eventBoxStyles.common,
                            ...(isNotified ? eventBoxStyles.notified : eventBoxStyles.normal),
                            cursor: 'pointer',
                          }}
                          onClick={() => handleEditEvent(event)}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            draggable={true}
                            data-event-id={event.id}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('eventId', event.id);
                            }}
                          >
                            {isNotified && <Notifications fontSize="small" />}
                            {isRepeating && (
                              <Tooltip
                                title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
                                  event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                                }`}
                              >
                                <Repeat fontSize="small" />
                              </Tooltip>
                            )}
                            <Typography
                              variant="caption"
                              noWrap
                              sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                            >
                              {event.title}
                            </Typography>
                          </Stack>
                        </Box>
                      );
                    })}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default WeekView;
