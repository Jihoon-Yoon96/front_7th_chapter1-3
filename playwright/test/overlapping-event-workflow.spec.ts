import { test, expect } from '@playwright/test';

import { goReset, createEvent, findEventByTitle } from './e2eHelpers';

test.describe('중복 일정 관리', () => {
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

  test('중복 일정 생성', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    // 중복 일정 데이터 생성 중
    await page.getByLabel('제목').fill('팀 미팅');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByTestId('event-submit-button').click();

    // 일정 겹침 다이얼로그 노출
    await expect(page.getByText('일정 겹침 경고')).toBeVisible({ timeout: 5000 });
  });

  test('중복 일정 생성 - 다이얼로그에서 "계속 진행" 클릭', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    // 중복 일정 데이터 생성 중
    await page.getByLabel('제목').fill('팀 미팅');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByTestId('event-submit-button').click();

    // 다이얼로그 노출 - "계속 진행" 클릭
    await expect(page.getByText('일정 겹침 경고')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: '계속 진행' }).click();
    await page.waitForTimeout(500);

    // 중복 일정 생성 됨
    await findEventByTitle(page, '팀 회의');
    await findEventByTitle(page, '팀 미팅');
  });

  test('중복 일정 수정', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    // 중복 일정 데이터 생성 중
    await page.getByLabel('제목').fill('팀 미팅');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByTestId('event-submit-button').click();

    // 다이얼로그 노출 - "계속 진행" 클릭
    await expect(page.getByText('일정 겹침 경고')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: '계속 진행' }).click();
    await page.waitForTimeout(500);

    // 중복 일정 생성 됨
    await findEventByTitle(page, '팀 회의');
    await findEventByTitle(page, '팀 미팅');

    // 중복된 일정 수정
    await page.getByRole('button', { name: 'Edit event' }).nth(1).click();
    await page.getByLabel('제목').clear();
    await page.getByLabel('제목').fill('팀 미팅22');
    await page.getByLabel('날짜').clear();
    await page.getByLabel('날짜').fill('2025-11-08');
    await page.getByTestId('event-submit-button').click();
    await findEventByTitle(page, '팀 미팅22');
  });

  test('중복 일정 삭제', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    // 중복 일정 데이터 생성 중
    await page.getByLabel('제목').fill('팀 미팅');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:00');
    await page.getByTestId('event-submit-button').click();

    // 다이얼로그 노출 - "계속 진행" 클릭
    await expect(page.getByText('일정 겹침 경고')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: '계속 진행' }).click();
    await page.waitForTimeout(500);

    // 중복 일정 생성 됨
    await findEventByTitle(page, '팀 회의');
    await findEventByTitle(page, '팀 미팅');

    // 중복 일정 삭제
    await page.getByRole('button', { name: 'Delete event' }).nth(1).click();
    await page.getByTestId('event-submit-button').click();
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 미팅')).not.toBeVisible();
  });
});