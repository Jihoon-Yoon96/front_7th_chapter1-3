## 🎭 Generator: 테스트 코드 생성 명세서 (POM 적용)
- 이 문서는 **PRD.md를 참고하여**, 🎭 Generator가 실행 가능한 Playwright 테스트 코드를 생성하는 방식과 원칙을 정의합니다.

---
### 0. 역할
- **PRD.md를 참고하여** 실행 가능한 Playwright 테스트 코드로 변환합니다.  
  Input: ./playwright/agent/PRD.md && ./playwright/PLAYWRIGHT_GUIDE.md   
  Output:  
  ./playwright/pom/CalendarPage.ts (페이지 객체 모델)  
  ./playwright/test/basic-event-create.spec.ts (테스트 스크립트)


### 1. 핵심 원칙: Page Object Model (POM) 활용
- 모든 테스트 코드는 페이지 객체 모델(POM) 구조를 사용하여 생성합니다.
  유지보수성: UI 요소(Locator)가 변경되면, 테스트 스크립트가 아닌 POM 파일(CalendarPage.ts)만 수정하면 됩니다.
  가독성: 테스트 스크립트(*.spec.ts)는 calendarPage.createEvent(...)처럼 비즈니스 로직에 집중된 추상화된 메서드를 호출하므로, 시나리오를 이해하기 쉬워집니다.
  재사용성: '일정 생성'과 같은 공통 작업은 POM의 메서드로 캡슐화되어 여러 테스트에서 재사용됩니다.


### 2. POM 클래스 양식 예시 (./playwright/pom/*.ts)
- Generator는 앱의 주요 컴포넌트(EventForm, EventList, MonthView 등)를 관리하는 CalendarPage 클래스를 생성해야 합니다. 이는 Playwright POM 문서의 playwright-dev-page.ts 양식을 따릅니다.

```typescript
// (예시) ./playwright/pom/CalendarPage.ts
   import { expect, type Locator, type Page } from '@playwright/test';
   import type { EventInput } from '../../src/types'; // [Project Type Import]

export class CalendarPage {
// Page 객체
readonly page: Page;

// Locators (EventForm.tsx 기반)
readonly titleInput: Locator;
readonly dateInput: Locator;
readonly startTimeInput: Locator;
readonly endTimeInput: Locator;
readonly categorySelect: Locator;
readonly submitButton: Locator;

// Locators (EventList.tsx 기반)
readonly eventListContainer: Locator;

// Locators (MonthView.tsx 기반)
readonly monthViewContainer: Locator;

constructor(page: Page) {
this.page = page;

    // EventForm Locators 초기화
    this.titleInput = page.getByLabel('제목');
    this.dateInput = page.getByLabel('날짜');
    this.startTimeInput = page.getByLabel('시작 시간');
    this.endTimeInput = page.getByLabel('종료 시간');
    this.categorySelect = page.getByLabel('카테고리'); // MUI Select
    this.submitButton = page.getByTestId('event-submit-button');

    // EventList Locator 초기화
    this.eventListContainer = page.getByTestId('event-list');

    // MonthView Locator 초기화
    this.monthViewContainer = page.getByTestId('month-view');
}

/**
* 애플리케이션의 baseURL('http://localhost:5173')로 이동합니다.
  */
  async goto() {
  await this.page.goto('/');
  }

/**
* EventForm을 사용해 새 일정을 생성하는 복합 액션입니다.
* @param eventData - EventInput 타입의 일정 데이터
  */
  async createEvent(eventData: Omit<EventInput, 'id' | 'recurring' | 'notificationTime'> & { category: string }) {
  await this.titleInput.fill(eventData.title);
  await this.dateInput.fill(eventData.date);
  await this.startTimeInput.fill(eventData.startTime);
  await this.endTimeInput.fill(eventData.endTime);

    // MUI Selectbox 처리
    await this.categorySelect.click();
    await this.page.getByRole('option', { name: `${eventData.category}-option` }).click();

    await this.submitButton.click();
}

/**
* Month View의 특정 날짜 셀을 반환합니다.
* @param date - YYYY-MM-DD 형식의 날짜 문자열
  */
  getCellByDate(date: string): Locator {
  const day = new Date(date).getDate();
  // 정규식을 사용해 날짜(예: "15")로 시작하는 셀을 찾습니다.
  return this.monthViewContainer.getByRole('cell', { name: new RegExp(`^${day}`) });
  }
  }
```

### 3. 테스트 소스 양식 예시 (./playwright/test/*.spec.ts)

- Generator는 Planner의 시나리오를 바탕으로 POM 클래스를 사용하는 테스트 스크립트를 생성해야 합니다. 이는 Playwright POM 문서의 example.spec.ts 양식을 따릅니다.

```typescript
// ./playwright/test/basic-event-create.spec.ts
import { test, expect } from '@playwright/test';
import { CalendarPage } from '../pom/CalendarPage'; // 1. POM 클래스 Import

// 시나리오 1.1: 새 기본 일정 생성 (Create)
test.describe('기본 일정 관리 (CRUD)', () => {

test.beforeEach(async ({ page }) => {
// (데이터 격리를 위해) 테스트 시작 전 기존 일정을 정리하는 API 호출 (권장)
// await page.request.post('/api/test/cleanup');
});

test('1.1. 새 기본 일정을 생성하고 리스트와 캘린더에 표시되어야 한다', async ({ page }) => {

    // 2. POM 인스턴스화
    const calendarPage = new CalendarPage(page);

    // Arrange: 테스트 데이터 정의
    const newEvent = {
      title: 'Playwright 테스트 일정',
      date: '2025-10-15',
      startTime: '10:00',
      endTime: '11:00',
      category: '업무',
    };

    // 3. Act: POM의 추상화된 메서드 사용
    await calendarPage.goto();
    await calendarPage.createEvent(newEvent);

    // 4. Assert: POM의 Locator 사용
    
    // Assert (EventList): 이벤트 리스트에 표시되는지 확인
    await expect(calendarPage.eventListContainer).toBeVisible();
    await expect(calendarPage.eventListContainer).toContainText(newEvent.title);
    await expect(calendarPage.eventListContainer).toContainText(newEvent.date);
    await expect(calendarPage.eventListContainer).toContainText(`${newEvent.startTime} - ${newEvent.endTime}`);

    // Assert (MonthView): 캘린더 뷰에 표시되는지 확인
    const calendarCell = calendarPage.getCellByDate(newEvent.date);
    await expect(calendarCell).toContainText(newEvent.title);
});
});
```


### 4. 출력 경로
- POM 클래스 파일은 ./playwright/pom/ 하위에 생성합니다.
테스트 스크립트 파일은 ./playwright/test/ 하위에 생성합니다.