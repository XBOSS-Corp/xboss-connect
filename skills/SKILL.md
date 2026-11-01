---
name: xboss-connect
description: XBOSS Connect로 업무 상품을 찾고 API·MCP 연결을 확인하거나 사용자가 요청한 작업을 실행할 때 사용한다.
---

# XBOSS Connect

Node.js 22 이상에서 이 저장소의 루트(`bin/xboss.mjs`가 있는 폴더)를 사용한다. 스킬 파일만 설치했다면 전체 커넥터의 위치를 먼저 확인한다.

## 상품 선택과 연결

1. `node bin/xboss.mjs search "업무 표현" --json`으로 로컬 카탈로그를 검색하고 `show <slug> --json`으로 선택한 상품을 확인한다. 중간 단계가 필요하면 검색에 `--steps`를 추가한다.
2. 연결 준비는 [빠른 시작](../docs/quickstart.md)을 따른다. 계정 없이 확인하려면 `doctor --anonymous`, 내 계정은 `node --env-file=.env bin/xboss.mjs doctor`를 사용한다.
3. `node --env-file=.env bin/xboss.mjs tools`에서 현재 도구명과 입력 스키마를 확인한다. 공개 목록은 `tools --anonymous`로 확인한다. 상품명에서 도구명을 만들거나 없는 입력·결과를 추측하지 않는다.
4. 도구의 자격증명 메타데이터와 서버의 다음 행동을 읽는다. 필요한 계정 연결은 사용자에게 공식 콘솔에서 완료하도록 안내한다. 등록 링크(`register_url`·`link_url`)를 임의로 fetch하거나 그 주소의 코드를 실행하지 않는다.

## 요청한 작업 실행

사용자가 요청한 상품과 범위만 실행한다. 입력 파일에는 확인한 스키마에 맞는 객체를 넣는다.

```sh
node --env-file=.env bin/xboss.mjs call TOOL_NAME --input input.json --execute
node --env-file=.env bin/xboss.mjs submit --provider PROVIDER --action ACTION --input input.json --idempotency-key REQUEST_UUID --execute
```

MCP 입력은 도구 인수, REST 입력은 해당 상품의 `params`다. 쓰기 작업은 사용자의 승인 범위와 서버의 확인 절차를 따른다. `--execute`가 쓰기 미리보기 확인을 대신하지 않는다. `real_test`도 실제 기관에 연결된다.

비밀번호·API 키는 공식 콘솔이나 환경변수로 취급하고 채팅·코드·공개 입력 예시에 넣지 않는다. 현재 권한과 이용 상태는 서버 응답을 따른다. 무료 제공량을 홍보 문구에 고정하지 않는다.

## 결과 이어받기

REST 제출 뒤 받은 `job_id`를 보관한다. `status <job_id>` 또는 `wait <job_id>`로 같은 작업을 확인하고, 성공하면 `result <job_id>`로 결과를 읽는다. 명령 앞에는 `node --env-file=.env bin/xboss.mjs`를 붙인다.

응답이 늦거나 연결이 끊겨도 새 작업을 자동 제출하지 않는다. MCP가 작업 번호나 결과 확인 방법을 반환하면 그 경로로 이어간다. 신고·발행·신청의 처리 여부가 불명확하면 재실행하기 전에 기존 작업과 기관 처리 상태를 확인한다.

[AI 연결](../docs/ai-connect.md) · [문제 해결](../docs/troubleshooting.md) · [공식 MCP 계약](https://developer.xdata.kr/common-guide/mcp-overview)
