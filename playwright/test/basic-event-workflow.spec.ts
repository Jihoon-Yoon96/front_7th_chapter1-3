import { test, expect } from '@playwright/test';

import {
  createEvent,
  findEventByTitle,
  expectSnackbarMessage,
  goReset,
  switchView,
} from './e2eHelpers';

test.describe('기본 일정 관리', () => {
  // 테스트 병렬실행 방지
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page, request }) => {
    await goReset(request);
    await page.clock.install({ time: new Date('2025-11-07') });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();
    // 네트워크 안정화 상태 유지 (500ms 동안 새로운 네트워크 연결 요청이 없으면 'networkidle' 상태로 간주)
    await page.waitForLoadState('networkidle');
  });

  test('기본 일정 CRUD 워크플로우', async ({ page }) => {
    const EVT = {
      title: '팀 회의',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    };

    // 일정 create
    await createEvent(page, EVT);

    // 일정 read
    await findEventByTitle(page, '팀 회의');
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('2025-11-07')).toBeVisible();
    await expect(eventList.getByText('09:00 - 10:00')).toBeVisible();

    // 일정 update
    await page.getByRole('button', { name: 'Edit event' }).first().click();
    await page.getByLabel('제목').clear();
    await page.getByLabel('제목').fill('팀 미팅');
    await page.getByTestId('event-submit-button').click();
    await findEventByTitle(page, '팀 미팅');

    // 일정 delete
    await page.getByRole('button', { name: 'Delete event' }).first().click();
    await expect(eventList.getByText('팀 미팅')).not.toBeVisible();
    await expectSnackbarMessage(page, '일정이 삭제되었습니다');
  });

  test('WeekView 일정 조회', async ({ page }) => {
    await createEvent(page, {
      title: '약속',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    // 주간 뷰 변경
    await switchView(page, 'week');

    const weekView = page.getByTestId('week-view');
    await expect(weekView.getByText('약속')).toBeVisible();
  });

  test('MonthView 일정 조회', async ({ page }) => {
    await createEvent(page, {
      title: '약속2',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    // 월간 뷰 변경
    await switchView(page, 'month');

    const monthView = page.getByTestId('month-view');
    await expect(monthView.getByText('약속2')).toBeVisible();
  });

  /** 드래그 앤 드롭 **/
});