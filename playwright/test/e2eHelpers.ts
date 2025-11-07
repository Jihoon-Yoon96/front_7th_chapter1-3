import { Page, expect, APIRequestContext } from '@playwright/test';

// DB 초기화 (e2e.json을 빈 배열로)
export async function goReset(request: APIRequestContext) {
  const response = await request.post('http://localhost:3000/api/reset');

  if (!response.ok()) {
    throw new Error(`Database reset failed: ${response.statusText()}`);
  }

  return response.json();
}

export interface EventData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  category?: string;
  notificationTime?: number;
}

// 일정 CREATE
export async function createEvent(page: Page, eventData: EventData) {
  await page.getByLabel('제목').fill(eventData.title);
  await page.getByLabel('날짜').fill(eventData.date);
  await page.getByLabel('시작 시간').fill(eventData.startTime);
  await page.getByLabel('종료 시간').fill(eventData.endTime);

  // 필수 X 필드
  if (eventData.description) await page.getByLabel('설명').fill(eventData.description);
  if (eventData.location) await page.getByLabel('위치').fill(eventData.location);
  if (eventData.category) {
    await page.getByLabel('카테고리').click();
    await page.getByLabel(`${eventData.category}-option`).click();
  }

  if (eventData.notificationTime !== undefined) {
    // notificationTime값에 따른 label
    const notification: Record<number, string> = {
      1: '1분 전',
      10: '10분 전',
      60: '1시간 전',
      1440: '1일 전',
      10080: '1주 전',
    };
    // await page.getByLabel('알림 설정').click();
    await page.locator('#notification').click();
    await page.getByRole('option', { name: notification[eventData.notificationTime] }).click();
  }

  // '일정 추가' 버튼 클릭
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('/api/events')),
    page.getByTestId('event-submit-button').click(),
  ]);

  // 화면에 반영되기 기다림
  await page.waitForTimeout(500);
}

// 제목으로 특정 이벤트 찾기
export async function findEventByTitle(page: Page, title: string) {
  const eventList = page.getByTestId('event-list');
  await expect(eventList.getByText(title).first()).toBeVisible();
}

// 달력 뷰 타입 전환
export async function switchView(page: Page, view: 'week' | 'month') {
  await page.getByLabel('뷰 타입 선택').click();
  await page.getByLabel(`${view}-option`).click();
}

// 스낵바 메세지 검증
export async function expectSnackbarMessage(page: Page, message: string) {
  await expect(page.getByText(message)).toBeVisible({ timeout: 5000 });
}