-----

````markdown
# Storybook "How to write stories" 핵심 요약

'스토리(Story)'는 UI 컴포넌트의 렌더링된 상태를 캡처한 것입니다. 컴포넌트 스토리는 일반적으로 컴포넌트 파일과 동일한 위치에 `.stories.js|ts|jsx|tsx` 파일로 정의합니다.

---

## 1. 기본 구조 (Component Story Format - CSF)

### `default export (meta)`
컴포넌트 자체에 대한 메타데이터를 정의합니다.

* **`component`**: 대상 컴포넌트를 지정합니다.
* **`title`** (선택 사항): Storybook 사이드바에 표시될 이름입니다. (지정하지 않으면 `component`에서 자동 추론)
* **`tags`**: `'autodocs'` 태그를 추가하면 자동으로 문서 페이지가 생성됩니다.
* **`args`**: 컴포넌트에 전달될 기본 `props` (인자)를 정의할 수 있습니다.

### `named exports (stories)`
해당 컴포넌트의 개별 스토리를 정의합니다.

* 스토리 이름은 보통 파스칼 케이스(UpperCamelCase)로 작성합니다.
* 각 스토리는 `args` 객체를 통해 컴포넌트에 전달될 `props`를 정의하여 특정 상태(예: Primary, Secondary, Disabled 등)를 표현합니다.

---

## 2. 스토리 작성 핵심 기능

### `args` (인자)
컴포넌트에 전달되는 `props`입니다. `meta` 레벨에서 기본값을 설정하고, 각 스토리 레벨에서 특정 값을 덮어쓰거나 추가할 수 있습니다. 이는 Storybook의 Controls 애드온과 연동되어 실시간으로 값을 변경하며 테스트할 수 있게 해줍니다.

### 스토리 재사용
다른 스토리의 `args`를 스프레드 연산자(`...`)로 가져와 재사용할 수 있습니다. 이는 유지보수성을 높여줍니다.

```javascript
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args, // Primary 스토리의 args 재사용
    primary: false,
    label: 'Button',
  },
};
````

### `render` 함수 (커스텀 렌더링)

단순한 `props` 전달 외에, 스토리를 특정 컨텍스트(예: 다른 컴포넌트로 감싸기) 안에서 렌더링해야 할 때 유용합니다.

```javascript
export const InAlert: Story = {
  render: (args) => (
    <Alert>
      <Button {...args} />
    </Alert>
  ),
};
```

### `play` 함수 (상호작용 테스트)

스토리가 렌더링된 후 특정 사용자 상호작용(클릭, 타이핑 등)을 시뮬레이션하고 DOM 상태를 검증하는 데 사용됩니다. `@storybook/test` 라이브러리의 `userEvent`, `expect` 등과 함께 사용됩니다.

```javascript
import { userEvent, expect, within } from '@storybook/test';

export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'example@email.com');
    await userEvent.click(canvas.getByRole('button'));
    // ... 상태 검증 ...
  },
};
```

### `parameters` (파라미터)

애드온의 동작을 제어하거나(예: `backgrounds`, `viewport`) 특정 정적 메타데이터를 스토리에 제공할 때 사용됩니다.

### `decorators` (데코레이터)

스토리를 특정 래퍼(Wrapper) 컴포넌트(예: `Provider`, 여백을 주는 `div` 등)로 감싸서 렌더링할 때 사용됩니다.

```

---

이 내용을 바탕으로 Chromatic 관련 내용이나 다른 섹션을 추가하고 싶으시면 언제든지 말씀해 주세요.
```