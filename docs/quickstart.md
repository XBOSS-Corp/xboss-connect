# 코드로 시작하기

Node.js 22 이상이면 추가 패키지 설치 없이 시작할 수 있습니다. 다운로드한 폴더에서 아래 명령을 실행하세요.

## 1. 상품 찾기

계정 없이 상품을 검색하고 설명을 확인합니다.

```sh
node bin/xboss.mjs search "광고비 보고서"
node bin/xboss.mjs show naver-searchad-performance
node bin/xboss.mjs doctor --anonymous
node bin/xboss.mjs schema naver-searchad-performance --anonymous
```

검색은 전체 결과 수와 표시한 수를 알려줍니다. 더 보려면 안내된 `--limit` 값을 추가하세요. `schema`는 현재 목록에서 선택한 상품의 도구명·입력·기관 연결 준비를 보여줍니다. 상품 slug 대신 정확한 도구명도 사용할 수 있습니다.

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
node --env-file=.env bin/xboss.mjs schema naver-searchad-performance
```

`doctor`의 `mode`가 `account`이면 내 계정의 도구 목록을 확인한 것입니다. `public`이면 키 설정 안내에 따라 내 계정을 연결하세요. 연결 확인은 상품 실행과 별개입니다. 선택한 상품에 기관 계정이나 공동인증서가 필요하면 콘솔의 안내에 따라 먼저 연결하세요.

## 3. 입력 준비와 실행

MCP 입력 틀은 다음 명령으로 만듭니다. 상품 작업은 실행하지 않습니다.

```sh
node --env-file=.env bin/xboss.mjs schema naver-searchad-performance --template
```

출력 JSON을 UTF-8 `input.json`으로 저장하고 `null`을 확인한 실제 값으로 채우세요. 틀에는 필수 구조만 담깁니다. 배열은 항목 하나의 구조를 보여주므로 실제 대상에 맞게 작성하세요. 선택 입력·조건부 필수·참조 스키마는 `--template` 없는 `schema` 출력에서 확인합니다. 참조 주소를 자동으로 열거나 코드를 실행하지 않습니다.

인증한 MCP 호출에서 스키마가 `request_idempotency_key`를 지원하면 **최초 호출 전에** UUID를 만들고 그 필드를 입력 파일에 추가해 보관하세요.

```sh
node -p "require('node:crypto').randomUUID()"
```

응답을 잃었을 때만 같은 키와 같은 입력으로 기존 요청을 복구합니다. 같은 키에 다른 입력을 넣지 않습니다. 새 작업에는 새 키를 사용하며, 재제출은 자동으로 하지 않습니다. 이 값은 상품별 `idempotency_key`나 REST의 `--idempotency-key`와 별개입니다.

준비한 입력을 검토한 뒤 아래 `TOOL_NAME`을 `schema`의 정확한 `name`으로 바꾸어 실행합니다. MCP 입력 파일에는 도구 인수 객체를 넣습니다.

```sh
node --env-file=.env bin/xboss.mjs call TOOL_NAME --input input.json --execute
```

REST 작업은 `show`의 공식 상품 안내에서 개발 문서를 열어 `params` 입력을 확인합니다. MCP 입력 틀을 그대로 사용하지 마세요. `input.json`에는 상품의 `params` 객체를 넣고, `PROVIDER`·`ACTION`은 `show`의 API 식별자로 바꾸세요. 최초 제출 전에 만든 UUID를 `REQUEST_UUID`에 넣고 입력 파일과 함께 보관합니다.

```sh
node --env-file=.env bin/xboss.mjs submit --provider PROVIDER --action ACTION --input input.json --idempotency-key REQUEST_UUID --execute
```

같은 기관에 연결이 여러 개라면 위 제출 명령에 `--account-link-id LINK_ID`를 추가하세요. `LINK_ID`는 [콘솔에 등록된 연결](https://console.xdata.kr/credentials)의 식별자로 바꿉니다. 이 값은 작업의 최상위 `account_link_id`로 전달되며, `input.json`의 `params`에 넣지 않습니다. 옵션을 생략하면 서버가 현재 계정의 연결을 자동으로 선택합니다.

`--execute`는 실제 실행을 요청하는 옵션입니다. 서버가 별도 쓰기 확인을 요구하면 미리보기를 확인한 뒤 공식 절차를 따르세요.

## 4. 결과 확인

제출 응답의 작업 번호를 `JOB_ID`에 넣습니다. 상태 조회와 대기는 같은 작업을 다시 제출하지 않습니다.

```sh
node --env-file=.env bin/xboss.mjs status JOB_ID
node --env-file=.env bin/xboss.mjs wait JOB_ID
node --env-file=.env bin/xboss.mjs result JOB_ID
```

결과는 성공한 작업에서 가져올 수 있습니다. 응답이 끊겼거나 시간이 오래 걸리면 먼저 기존 작업 상태를 확인하세요. 작업 번호를 받지 못했다면 최초 요청의 키와 입력을 보관하고 [복구 안내](troubleshooting.md)를 따르세요. MCP 응답의 `result_tool_call` 등 다음 조회 안내가 있으면 그 경로로 이어갑니다.

## 코드 예제

- [도구 목록 읽기](../examples/read-tools.mjs): 상품 실행 없이 공개 도구 목록을 읽습니다.
- [작업 제출과 결과 받기](../examples/run-job.mjs): 명시한 작업 하나를 제출하고 결과를 기다립니다.

[AI에 연결하기](ai-connect.md) · [문제 해결](troubleshooting.md) · [공식 작업 흐름](https://developer.xdata.kr/common-guide/jobs)
