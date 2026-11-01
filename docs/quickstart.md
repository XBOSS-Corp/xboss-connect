# 코드로 시작하기

Node.js 22 이상이면 추가 패키지 설치 없이 시작할 수 있습니다. 다운로드한 폴더에서 아래 명령을 실행하세요.

## 1. 상품 찾기

계정 없이 상품을 검색하고 설명을 확인합니다.

```sh
node bin/xboss.mjs search "광고 성과"
node bin/xboss.mjs show naver-searchad-performance
node bin/xboss.mjs doctor --anonymous
```

[전체 상품](../PRODUCTS.md)에서도 찾을 수 있습니다. 무료로 시작할 수 있으며, 상품별 준비와 이용 가능 여부는 연결 과정에서 확인합니다.

## 2. 내 계정 연결

[XBOSS 콘솔](https://console.xdata.kr/)에서 키를 준비하세요. `.env.example`을 `.env`로 복사한 뒤 본인의 값을 입력합니다.

```dotenv
XBOSS_CLIENT_ID=your_client_id
XBOSS_CLIENT_SECRET=your_client_secret
XBOSS_ENV_SCOPE=real_test
```

`.env`는 본인 기기에만 보관합니다. `real_test`도 실제 기관에 연결되는 환경입니다.

```sh
node --env-file=.env bin/xboss.mjs doctor
node --env-file=.env bin/xboss.mjs tools
```

연결 확인은 상품 실행과 별개입니다. 선택한 상품에 기관 계정이나 공동인증서가 필요하면 콘솔의 안내에 따라 먼저 연결하세요.

## 3. 선택한 상품 실행

`show`에 표시된 상품 안내에서 개발 문서를 열어 입력값을 확인하고 `input.json`을 만듭니다. 아래 대문자 이름은 실제 값으로 바꿉니다.

MCP 도구를 실행할 때는 `input.json`에 도구 인수 객체를 넣습니다. 도구명은 현재 `tools` 출력에서 확인합니다.

```sh
node --env-file=.env bin/xboss.mjs call TOOL_NAME --input input.json --execute
```

REST 작업은 `input.json`에 상품의 `params` 객체를 넣고 제출합니다. 같은 요청을 구분할 UUID를 `REQUEST_UUID`에 넣습니다.

```sh
node --env-file=.env bin/xboss.mjs submit --provider PROVIDER --action ACTION --input input.json --idempotency-key REQUEST_UUID --execute
```

`--execute`는 실제 실행을 요청하는 옵션입니다. 서버가 별도 쓰기 확인을 요구하면 미리보기를 확인한 뒤 공식 절차를 따르세요.

## 4. 결과 확인

제출 응답의 작업 번호를 `JOB_ID`에 넣습니다. 상태 조회와 대기는 같은 작업을 다시 제출하지 않습니다.

```sh
node --env-file=.env bin/xboss.mjs status JOB_ID
node --env-file=.env bin/xboss.mjs wait JOB_ID
node --env-file=.env bin/xboss.mjs result JOB_ID
```

결과는 성공한 작업에서 가져올 수 있습니다. 응답이 끊겼거나 시간이 오래 걸리면 먼저 기존 작업 상태를 확인하세요.

## 코드 예제

- [도구 목록 읽기](../examples/read-tools.mjs): 상품 실행 없이 공개 도구 목록을 읽습니다.
- [작업 제출과 결과 받기](../examples/run-job.mjs): 명시한 작업 하나를 제출하고 결과를 기다립니다.

[AI에 연결하기](ai-connect.md) · [문제 해결](troubleshooting.md) · [공식 작업 흐름](https://developer.xdata.kr/common-guide/jobs)
