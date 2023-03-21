# toquiz-client

toquiz 클라이언트 개발 레포지토리입니다.

## Mock Service Worker와 실행하기

```bash
git clone https://github.com/blacktokkies/toquiz.git
cd toquiz
yarn shared build
yarn client install
yarn client dev
```

## API Proxy server와 실행하기

```bash
git clone https://github.com/blacktokkies/toquiz.git
cd toquiz
echo 'VITE_API_BASE_URL=%base url을 입력하세요%' > client/.env.proxy.local # optional
yarn shared build
yarn client install
yarn client dev:proxy
```

**`client/.env.proxy.local`의 `VITE_API_BASE_URL`을 작성하지 않으면 기본값은 `http://localhost:3000`입니다.**

### 예) `VITE_API_BASE_URL` 작성 예시

- 커맨드로 `client/.env.proxy.local` 작성하기

```bash
echo 'VITE_API_BASE_URL=http://localhost:3000' > client/.env.proxy.local
```

- 직접 `client/.env.proxy.local` 작성하기

```
# client/.env.proxy.local
VITE_API_BASE_URL=http://localhost:3000
```

## Mock Service Worker와 테스트하기

```bash
git clone https://github.com/blacktokkies/toquiz.git
cd toquiz
echo 'VITE_API_BASE_URL=%base url을 입력하세요%' > client/.env.test.local # optional
yarn shared build
yarn client install
yarn client test
```

([msw를 노드 환경에서 사용할 때에는 절대 경로로 API 요청](https://mswjs.io/docs/getting-started/integrate/node#direct-usage)해야하기 때문에 필요함)

`client/.env.test.local`의 `VITE_API_BASE_URL`을 작성하지 않으면 기본값은 `http://localhost`입니다.
