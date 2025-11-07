/** @vitest-environment jsdom */

import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';

import EventForm from '../../components/EventForm';
import MonthView from '../../components/MonthView';
import { Event } from '../../types';

// 테스트용 이벤트 목 데이터
const mockEvent: Event = {
  id: 'evt1',
  title: '테스트 이벤트',
  date: '2025-11-10',
  startTime: '10:00',
  endTime: '11:00',
  description: '이것은 테스트 설명입니다.',
  location: '테스트 장소',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

// App.tsx와 같이 부모 컴포넌트의 동작을 시뮬레이션하는 테스트용 래퍼 컴포넌트
const IntegrationTestWrapper = ({ initialFormState = {} }) => {
  const [events] = useState<Event[]>([mockEvent]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // 폼의 상태 관리를 시뮬레이션합니다.
  const [formState, setFormState] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '업무',
    ...initialFormState,
  });

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormState({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description || '',
      location: event.location || '',
      category: event.category || '업무',
    });
  };

  return (
    <div>
      <MonthView
        currentDate={new Date('2025-11-01')}
        filteredEvents={events}
        notifiedEvents={[]}
        holidays={{}}
        editEventDateByDrag={vi.fn()}
        getRepeatTypeLabel={vi.fn()}
        handleEditEvent={handleEditEvent}
      />
      <EventForm
        {...formState}
        setTitle={(title) => setFormState((p) => ({ ...p, title }))}
        setDate={(date) => setFormState((p) => ({ ...p, date }))}
        handleStartTimeChange={(e) => setFormState((p) => ({ ...p, startTime: e.target.value }))}
        handleEndTimeChange={(e) => setFormState((p) => ({ ...p, endTime: e.target.value }))}
        setDescription={(description) => setFormState((p) => ({ ...p, description }))}
        setLocation={(location) => setFormState((p) => ({ ...p, location }))}
        setCategory={(category) => setFormState((p) => ({ ...p, category }))}
        editingEvent={editingEvent}
        isRepeating={false}
        setIsRepeating={vi.fn()}
        repeatType={'none'}
        setRepeatType={vi.fn()}
        repeatInterval={1}
        setRepeatInterval={vi.fn()}
        repeatEndDate={''}
        setRepeatEndDate={vi.fn()}
        notificationTime={10}
        setNotificationTime={vi.fn()}
        startTimeError={null}
        endTimeError={null}
        addOrUpdateEvent={vi.fn()}
        categories={['업무', '개인']}
        notificationOptions={[{ value: 10, label: '10분 전' }]}
      />
    </div>
  );
};

describe('MonthView와 EventForm 통합 테스트', () => {
  it('MonthView의 이벤트를 클릭하면 EventForm에 해당 데이터가 채워져야 한다', () => {
    render(<IntegrationTestWrapper />);

    const eventBox = screen.getByText(mockEvent.title);
    expect(eventBox).toBeInTheDocument();

    // 수정 중인 일정 데이터가 없는 지 체크
    expect(screen.getByRole('heading', { name: '일정 추가' })).toBeInTheDocument();

    // 폼에 데이터 확인
    fireEvent.click(eventBox);
    expect(screen.getByRole('heading', { name: '일정 수정' })).toBeInTheDocument();
    expect(screen.getByLabelText('제목')).toHaveValue(mockEvent.title);
    expect(screen.getByLabelText('날짜')).toHaveValue(mockEvent.date);
    expect(screen.getByLabelText('시작 시간')).toHaveValue(mockEvent.startTime);
    expect(screen.getByLabelText('종료 시간')).toHaveValue(mockEvent.endTime);
    expect(screen.getByLabelText('설명')).toHaveValue(mockEvent.description);
    expect(screen.getByLabelText('위치')).toHaveValue(mockEvent.location);
  });

  it('기존에 EventForm에 값이 있었어도, MonthView의 이벤트를 클릭하면 데이터가 변경된다', () => {
    const initialData = {
      title: '초기 제목',
      date: '2025-01-01',
      description: '초기 설명',
    };
    render(<IntegrationTestWrapper initialFormState={initialData} />);

    // 초기 데이터 확인
    expect(screen.getByLabelText('제목')).toHaveValue(initialData.title);
    expect(screen.getByLabelText('날짜')).toHaveValue(initialData.date);

    // 월뷰 달력에 등록된 이벤트 클릭
    const eventBoxToClick = screen.getByText(mockEvent.title);
    fireEvent.click(eventBoxToClick);

    // 데이터 변경 확인
    expect(screen.getByRole('heading', { name: '일정 수정' })).toBeInTheDocument();
    expect(screen.getByLabelText('제목')).toHaveValue(mockEvent.title);
    expect(screen.getByLabelText('날짜')).toHaveValue(mockEvent.date);
    expect(screen.getByLabelText('설명')).toHaveValue(mockEvent.description);
  });
});
