import { test, expect } from '@playwright/test';
import { goReset, createEvent, findEventByTitle } from './e2eHelpers';

test.describe('검색 및 필터링 워크플로우', () => {
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

  test('일정 검색 - 검색 결과 없음', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의 - 오전',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    await createEvent(page, {
      title: '팀 회의 - 오후',
      date: '2025-11-07',
      startTime: '12:00',
      endTime: '13:00',
    });

    await createEvent(page, {
      title: '팀 회의 - 야근',
      date: '2025-11-07',
      startTime: '18:00',
      endTime: '19:00',
    });

    // 검색 결과 : 없음
    await page.getByPlaceholder('검색어를 입력하세요').fill('일부러 검색결과 안나오게 함');
    await page.waitForTimeout(300);

    await expect(page.getByText('팀 회의 - 오전')).not.toBeVisible();
    await expect(page.getByText('팀 회의 - 오후')).not.toBeVisible();
    await expect(page.getByText('팀 회의 - 야근')).not.toBeVisible();
    await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible();
  });

  test('일정 검색 - 검색 결과 O', async ({ page }) => {
    await createEvent(page, {
      title: '팀 회의 - 오전',
      date: '2025-11-07',
      startTime: '09:00',
      endTime: '10:00',
    });

    await createEvent(page, {
      title: '팀 회의 - 오후',
      date: '2025-11-07',
      startTime: '12:00',
      endTime: '13:00',
    });

    await createEvent(page, {
      title: '팀 회의 - 야근',
      date: '2025-11-07',
      startTime: '18:00',
      endTime: '19:00',
    });

    // 검색어 : 오전
    await page.getByPlaceholder('검색어를 입력하세요').clear();
    await page.getByPlaceholder('검색어를 입력하세요').fill('오전');
    await page.waitForTimeout(300);

    await findEventByTitle(page, '팀 회의 - 오전');
    await expect(page.getByText('팀 회의 - 야근')).not.toBeVisible();
  });
});