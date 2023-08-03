# toquiz-client

toquiz 클라이언트 개발 레포지토리입니다.

## toquiz client 실행하기

### Mock Service Worker와 실행하기

```bash
git clone https://github.com/blacktokkies/toquiz-client.git
cd toquiz
yarn install
yarn dev
```

### API Proxy server와 실행하기

```bash
git clone https://github.com/blacktokkies/toquiz-client.git
cd toquiz
echo 'VITE_API_BASE_URL=%base url을 입력하세요%' > client/.env.proxy.local # optional
yarn install
yarn dev:proxy
```

**`client/.env.proxy.local`의 `VITE_API_BASE_URL`을 작성하지 않으면 기본값은 `http://localhost:3000`입니다.**

### Mock Service Worker와 테스트하기

```bash
git clone https://github.com/blacktokkies/toquiz-client.git
cd toquiz
echo 'VITE_API_BASE_URL=%base url을 입력하세요%' > client/.env.test.local # optional
yarn install
yarn test
```

([msw를 노드 환경에서 사용할 때에는 절대 경로로 API 요청](https://mswjs.io/docs/getting-started/integrate/node#direct-usage)해야하기 때문에 필요함)

`client/.env.test.local`의 `VITE_API_BASE_URL`을 작성하지 않으면 기본값은 `http://localhost`입니다.

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
