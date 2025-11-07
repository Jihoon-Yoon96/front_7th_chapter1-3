import { test, expect } from '@playwright/test';

import { goReset, createEvent } from './e2eHelpers';

test.describe('알림 노출 플로우', () => {
  // 테스트 병렬실행 방지
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page, request }) => {
    await goReset(request);
    const initialTime = new Date('2025-11-07');
    await page.exposeFunction('getMockedTime', () => initialTime.toISOString());await page.goto('/');
    await expect(page.getByRole('heading', { name: '일정 추가' })).toBeVisible();
    // 네트워크 안정화 상태 유지 (500ms 동안 새로운 네트워크 연결 요청이 없으면 'networkidle' 상태로 간주)
    await page.waitForLoadState('networkidle');
  });

  test('알림 시간 설정', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
      notificationTime: 10,
    });

    // 이벤트 목록에서 알림시간 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('10분 전')).toBeVisible();
  });

  test('알림 시간에 도래하면 알림 문구 노출', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
      notificationTime: 10,
    });

    // 알림이 울리는 시간으로 시간제어
    await page.clock.setSystemTime(new Date('2025-11-07T08:50:01'));
    await page.clock.runFor(2000);

    // 알림 문구 노출
    await page.getByText('10분 후 팀 회의 일정이 시작됩니다.').waitFor({ state: 'visible' });
    console.log(new Date());
    expect(page.getByText('10분 후 팀 회의 일정이 시작됩니다.')).toBeVisible();
  });
});