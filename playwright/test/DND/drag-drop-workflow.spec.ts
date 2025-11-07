import { test, expect } from '@playwright/test';

import { createEvent, expectSnackbarMessage, goReset } from '../e2eHelpers';

test.describe('드래그 앤 드롭으로 일정 수정', () => {
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

  test('다른 날짜로 드래그 앤 드롭하여 날짜를 변경한다', async ({ page }) => {
    await createEvent(page, {
      title: '드래그 테스트',
      date: '2025-11-07',
      startTime: '10:00',
      endTime: '11:00',
    });

    // 드래그할 일정 Box 찾기
    const monthView = page.getByTestId('month-view');

    // 일정이 달력에 표시될 때까지 대기
    const eventTarget = await monthView.locator('text=드래그 테스트').first();
    await expect(eventTarget).toBeVisible();

    const dropTarget = await monthView.locator('[data-testid="cell-1-4"]'); // 11.6
    expect(dropTarget.getByText('6')).toBeVisible();

    // 드래그 & 드랍
    await eventTarget.hover();
    await page.mouse.down();
    await dropTarget.hover();
    await page.mouse.up();

    await page.waitForTimeout(300);

    // 스낵바 메시지 확인
    await expectSnackbarMessage(page, '일정이 이동되었습니다.');
  });
});
