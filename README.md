# toquiz-client

toquiz 클라이언트 개발 레포지토리입니다.

## toquiz client 실행하기

### 준비

```bash
git clone https://github.com/blacktokkies/toquiz-client.git
cd toquiz
yarn install
```

### `yarn dev`

Vite 개발 서버를 실행합니다. Mock Service Worker가 모든 요청을 인터셉트합니다.

### `yarn test`

Vitest로 테스트를 실행합니다. Mock Service Worker가 모든 요청을 인터셉트합니다.

### `yarn dev:proxy`

설정된 프록시로 Vite 개발 서버를 실행합니다. `.env.sample`에서 프록시 설정 기본값을 확인할 수 있습니다. 아래의 프록시 설정하기를 참고하세요.

#### 프록시 설정하기

프로젝트 루트에 `.env.proxy.local`을 작성합니다. 예시는 다음과 같습니다.

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_SOCKET_BASE_URL=http://localhost:8080
```

- `/api`로 시작하는 요청은 `VITE_API_BASE_URL`로 프록시됩니다.
- `/ws`로 시작하는 요청은 `VITE_SOCKET_BASE_URL`로 프록시됩니다.

---

---

<div style="text-align: center">
<img src="https://user-images.githubusercontent.com/72093196/235161403-da40733a-2f9f-4acf-932e-28cab2d316da.png" width=300 alt="toquiz">

# Toquiz

</div>

## 🗳 프로젝트 소개

toquiz(토퀴즈)는 사용자가 패널에 익명으로 질문을 올리고 답변을 받을 수 있는 서비스입니다.

## 👫 팀원

|                                                                 Frontend                                                                 |                                                                  Backend                                                                  |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://user-images.githubusercontent.com/72093196/235164625-9c419f41-b87c-4a25-9223-c88753dbee49.jpg" width=100 alt="이준영"> | <img src="https://user-images.githubusercontent.com/72093196/235164058-74742c98-a7de-4ccf-a140-2702733ab53d.jpeg" width=100 alt="백수만"> |
|                                                  [이준영]("https://github.com/leegwae")                                                  |                                                 [백수만]("https://github.com/soomanbaek")                                                 |
