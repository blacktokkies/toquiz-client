# toquiz-client

toquiz 클라이언트 개발 레포지토리입니다.

<h2 style="text-align: center;">toquiz</h2>
<p align="center">
  <img src="https://github.com/blacktokkies/toquiz-client/assets/57662010/603cda89-3f88-4d24-961b-fe0c83108d1b" width="100px" alt="toquiz">
</p>

### 프로젝트 소개

toquiz(토퀴즈)는 사용자가 패널에 익명으로 질문을 올리고 답변을 받을 수 있는 서비스입니다.

세미나 혹은 OT의 마지막에는 질문을 할 수 있는 QnA 시간이 있습니다. 하지만, 종종 시간 부족으로 모든 질문에 답변하지 못하는 경우가 있었습니다. 이러한 불편함을 해결하기 위해 언제든지 실시간으로 QnA를 할 수 있는 toquiz 서비스를 개발하였습니다.

프로젝트 계획, 컨벤션, 회의록과 같은 문서는 [팀 노션](https://black-tokkies.notion.site/toquiz-0ba770856ed24ba39bdec1636d23b3ab?pvs=4)에서 확인할 수 있습니다.

### 기능

> **회원 관리 기능**

<img src="https://github.com/blacktokkies/toquiz-server/assets/72093196/e1d59538-7da9-43af-9c1a-cda250e652f9" width="500">

- 회원가입, 로그인, 회원 정보 수정 및 탈퇴 기능이 있습니다.
- JWT 기반의 토큰을 사용하여 로그인 상태 유지를 하고 있습니다.

> **익명으로 활동 가능한 패널 (패널은 질문과 답변을 올릴 수 있는 공간이다)**

<img src="https://github.com/blacktokkies/toquiz-server/assets/72093196/5fc316d2-4f12-451e-a01d-9841840e29c7" width="500">

- 로그인 하지 않은 사용자도 질문을 올릴 수 있습니다.
- 익명 사용자가 생성하거나 좋아요를 누른 질문의 정보는 패널에 다시 접속해도 유지됩니다.

> **실시간 질문, 답변 생성 및 좋아요 활성화를 통한 Live Communication**

<img src="https://github.com/blacktokkies/toquiz-server/assets/72093196/1e7514d1-7d65-4557-bfcf-23e8769f5a05" width="500">

- 답변 생성은 오직 패널 생성자만 가능합니다.
- 질문 또는 답변이 생성되거나, 질문에 좋아요가 눌리면, 실시간으로 확인할 수 있습니다.

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

## 팀원

|                                                                 Frontend                                                                 |                                                                  Backend                                                                  |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://user-images.githubusercontent.com/72093196/235164625-9c419f41-b87c-4a25-9223-c88753dbee49.jpg" width=100 alt="이준영"> | <img src="https://user-images.githubusercontent.com/72093196/235164058-74742c98-a7de-4ccf-a140-2702733ab53d.jpeg" width=100 alt="백수만"> |
|                                                  [이준영]("https://github.com/leegwae")                                                  |                                                 [백수만]("https://github.com/soomanbaek")                                                 |
