import { test, expect } from '@playwright/test';

import { goReset, findEventByTitle } from './e2eHelpers';

test.describe('반복 일정 CRUD', () => {
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

  test('반복 일정 생성', async ({ page }) => {
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByLabel('weekly-option').click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-21');

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/events')),
      page.getByTestId('event-submit-button').click(),
    ]);

    await page.waitForTimeout(1000);

    await findEventByTitle(page, '팀 회의');
    const eventList = page.getByTestId('event-list');
    // 반복 일정이 생성 후 회전 아이콘 쿼링
    const repeatIcon = eventList.locator('[data-testid="RepeatIcon"]').first();
    await expect(repeatIcon).toBeVisible();
  });

  test('반복 일정 수정 - 단일수정', async ({ page }) => {
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByLabel('daily-option').click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-11');

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/events')),
      page.getByTestId('event-submit-button').click(),
    ]);

    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Edit event' }).first().click();
    await expect(page.getByText('반복 일정 수정')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: '예' }).click();

    await page.getByLabel('제목').fill('일정변경이지롱');
    await page.getByTestId('event-submit-button').click();
    await page.waitForTimeout(1000);

    // Then: 해당 인스턴스만 변경됨
    await findEventByTitle(page, '일정변경이지롱');
  });

  test('반복 일정 수정 - 일괄수정', async ({ page }) => {
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByLabel('weekly-option').click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-28');

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/events')),
      page.getByTestId('event-submit-button').click(),
    ]);

    await page.waitForTimeout(1000);

    // 반복 일정 일괄 수정
    await page.getByRole('button', { name: 'Edit event' }).first().click();
    await expect(page.getByText('반복 일정 수정')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: '아니오' }).click();
    await page.getByLabel('제목').fill('팀 미팅 222');
    await page.getByTestId('event-submit-button').click();
    await page.waitForTimeout(1000);

    await findEventByTitle(page, '팀 미팅 222');
    await expect(page.getByText('팀 회의')).not.toBeVisible();
  });

  test('반복 일정 삭제 - 일괄삭제', async ({ page }) => {
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');

    await page.getByLabel('반복 일정').check();
    await page.getByLabel('반복 유형').click();
    await page.getByLabel('daily-option').click();
    await page.getByLabel('반복 간격').fill('1');
    await page.getByLabel('반복 종료일').fill('2025-11-11');

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/events')),
      page.getByTestId('event-submit-button').click(),
    ]);

    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Delete event' }).first().click();
    await expect(page.getByText('반복 일정 삭제')).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: '아니오' }).click();
    await page.waitForTimeout(1000);

    // 반복일정 일괄 삭제됨
    await expect(page.getByText('팀 회의')).not.toBeVisible();
  });
});