## Playwright 페이지 객체 모델 (POM) 문서 요약

- 이 문서는 Playwright 공식 문서의 Page Object Models 섹션 내용을 요약 정리한 것입니다.
---

### 1. 페이지 객체 모델(POM)이란?

- 페이지 객체 모델(POM)은 대규모 테스트 스위트를 구조화하여 작성 용이성과 유지보수성을 최적화하는 접근 방식입니다.
- 페이지 객체는 웹 애플리케이션의 한 부분(예: 홈페이지, 상품 목록 페이지, 결제 페이지)을 나타내는 클래스입니다.

POM의 이점
- 작성 단순화: 애플리케이션에 맞는 더 높은 수준의 API(메서드)를 생성하여 테스트 작성을 단순화합니다.
- 유지보수 용이성: 엘리먼트 선택자(Locator)를 한곳(POM 클래스)에서 관리하고 재사용 가능한 코드를 만들어 반복을 피함으로써 유지보수를 단순화합니다.

### 2. 구현 (Implementation)

- 구현은 일반적으로 두 부분으로 나뉩니다.
- 페이지 객체 클래스: 페이지의 요소(Locator)와 동작(Method)을 캡슐화하는 클래스입니다.
- 테스트 스크립트: 페이지 객체 클래스를 가져와(import) 사용하는 실제 테스트 파일입니다.

#### 예시 1: 페이지 객체 클래스 (playwright-dev-page.ts)

- playwright.dev 페이지의 공통 작업을 캡슐화하는 PlaywrightDevPage 헬퍼 클래스 예시입니다.
```typescript
// playwright-dev-page.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class PlaywrightDevPage {
// Page 객체를 readonly 프로퍼티로 가짐
readonly page: Page;

// 페이지 내의 핵심 요소들을 Locator로 정의
readonly getStartedLink: Locator;
readonly gettingStartedHeader: Locator;
readonly pomLink: Locator;
readonly tocList: Locator;

constructor(page: Page) {
this.page = page;

    // 생성자에서 각 Locator를 초기화
    this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    this.pomLink = page.locator('li', {
      hasText: 'Guides',
    }).locator('a', {
      hasText: 'Page Object Model',
    });
    this.tocList = page.locator('article div.markdown ul > li > a');
}

/**
* 페이지로 이동하는 동작(Action) 메서드
  */
  async goto() {
  await this.page.goto('[https://playwright.dev](https://playwright.dev)');
  }

/**
* 'Get started' 링크를 클릭하고 헤더가 보이는지 확인하는
* 복합 동작(Action) 메서드
  */
  async getStarted() {
  await this.getStartedLink.first().click();
  await expect(this.gettingStartedHeader).toBeVisible();
  }

/**
* Page Object Model 문서 페이지로 이동하는 복합 동작 메서드
  */
  async pageObjectModel() {
  await this.getStarted();
  await this.pomLink.click();
  }
  }
```

#### 예시 2: 테스트 스크립트 (example.spec.ts)
- 위에서 만든 PlaywrightDevPage 클래스를 실제 테스트에서 사용하는 방법입니다.

```typescript
// example.spec.ts
import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from './playwright-dev-page'; // 1. POM 클래스 import

test('getting started should contain table of contents', async ({ page }) => {
// 2. POM 클래스 인스턴스화
const playwrightDev = new PlaywrightDevPage(page);

// 3. POM의 추상화된 메서드 호출
await playwrightDev.goto();
await playwrightDev.getStarted();

// 4. POM의 Locator를 사용하여 검증(assert)
await expect(playwrightDev.tocList).toHaveText([
`How to install Playwright`,
`What's Installed`,
`How to run the example test`,
`How to open the HTML test report`,
`Write tests using web first assertions, page fixtures and locators`,
`Run single test, multiple tests, headed mode`,
`Generate tests with Codegen`,
`See a trace of your tests`
]);
});
test('should show Page Object Model article', async ({ page }) => {
const playwrightDev = new PlaywrightDevPage(page);

await playwrightDev.goto();
await playwrightDev.pageObjectModel(); // 'POM' 페이지로 이동하는 메서드 호출

await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');
});
```
