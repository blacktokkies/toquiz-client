# toquiz-client

toquiz 클라이언트 개발 레포지토리입니다.

## Mock Service Worker와 시작하기

```bash
git clone https://github.com/blacktokkies/toquiz.git
cd toquiz
yarn shared build
yarn client install
yarn client dev
```

## API Proxy server와 시작하기

```bash
git clone https://github.com/blacktokkies/toquiz.git
cd toquiz
echo 'API_ORIGIN=%API URL을 입력하세요%' > client/.env.proxy.local
yarn shared build
yarn client install
yarn client dev:proxy
```

**`client/.env.proxy.local`을 작성하지 않으면 `API_ORIGIN`의 기본값은 `http://localhost:3000`입니다.**

### 예) API_ORIGIN 작성 예시

```bash
echo 'API_ORIGIN=http://localhost:3000' > client/.env.proxy.local
```
