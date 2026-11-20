# XBOSS AI 연결 | 홈택스, 4대보험, 정부24, 은행, 위택스 업무 시작하기

쓰던 AI에서 홈택스, 4대보험, 정부24, 은행, 위택스 업무를 연결하세요. 처음이라면 [API 키 없이 가상 급여 마감 예제 실행](https://n8n.io/workflows/22207-xboss/)에서 결과 파일부터 받아볼 수 있습니다.

## 1. 사용할 앱 연결

공식 원격 MCP 주소는 `https://api.xdata.kr/mcp`입니다. 주소만 넣으면 공개 도구 목록을 확인할 수 있습니다. 실제 업무를 시작하려면 사용하는 앱에서 XBOSS 계정을 연결하세요. 기관 자료가 필요한 상품은 해당 기관 자격증명도 필요합니다.

이 저장소에는 ChatGPT와 Codex 제출용 메타데이터, Cursor 호환 Agent Plugins 패키지, Gemini CLI 확장이 포함되어 있습니다. 공개 디렉터리에 승인되어 노출되는 상태와 저장소에서 직접 연결하는 상태는 다릅니다.

| 사용하는 앱 | 연결 방법 |
| --- | --- |
| Codex | [Codex 공식 연결 설정](https://developer.xdata.kr/common-guide/mcp-native-clients)에서 **Codex / 데모 환경** 예시를 골라 로컬 `config.toml`에 추가하세요. XBOSS Client ID와 Client Secret으로 만든 Basic 인증 헤더가 필요합니다. 설정 후 `codex mcp list`에서 `xboss`가 표시되는지 확인하세요. |
| ChatGPT | [XBOSS 콘솔 MCP 연동](https://console.xdata.kr/mcp)에서 ChatGPT 연결 경로를 확인하세요. 개발자 모드와 맞춤 앱을 사용할 수 있는 계정에서는 원격 MCP를 추가한 뒤 XBOSS 로그인으로 연결합니다. |
| Claude | 맞춤 커넥터를 지원하는 Claude 계정에서 [XBOSS 콘솔 MCP 연동](https://console.xdata.kr/mcp)을 참고해 주소를 추가하고 XBOSS에 로그인하세요. Claude Code 사용자는 [한국어 번들 설치](../platforms/claude/README.md)도 사용할 수 있습니다. |
| Cursor | [공식 Cursor 연결 예시](https://developer.xdata.kr/common-guide/mcp-native-clients)대로 원격 MCP에 Basic 인증 헤더를 추가하세요. 로컬 연결 프로그램을 사용하려면 아래 설정을 따르세요. |
| Gemini CLI | Node.js 22 이상에서 `gemini extensions install https://github.com/XBOSS-Corp/xboss-connect`로 설치합니다. 설정의 민감 입력란에 XBOSS Client ID와 Client Secret을 넣고 `/mcp`에서 연결을 확인하세요. |

Cursor 수동 설정 예시입니다. 이 저장소를 내려받은 뒤 `C:/your-path/xboss-connect`를 실제 폴더 경로로 바꾸고, 기존 설정을 덮어쓰지 말고 `mcpServers`에 XBOSS 항목을 병합하세요. Node.js 22 이상이 필요합니다.

```json
{
  "mcpServers": {
    "xboss": {
      "command": "node",
      "args": ["C:/your-path/xboss-connect/bin/xboss-mcp.mjs"],
      "env": {
        "XBOSS_CLIENT_ID": "${env:XBOSS_CLIENT_ID}",
        "XBOSS_CLIENT_SECRET": "${env:XBOSS_CLIENT_SECRET}"
      }
    }
  }
}
```

Client ID와 Client Secret은 [콘솔 키 관리](https://console.xdata.kr/keys)에서 발급하고 앱의 로컬 설정에만 입력합니다. Client Secret은 발급 시 보관하세요. 로컬 연결 프로그램의 기본 환경은 정식 `production`입니다. 데모 계정은 MCP 실행 환경변수에 `XBOSS_ENV_SCOPE=real_test`를 추가하세요. 데모에서도 기관을 연결한 업무는 실제 기관에 영향을 줄 수 있습니다.

이 클라이언트는 현재 원격 도구 목록을 읽으며, 기존에 배포한 짧은 별칭은 유지합니다. 이후 추가되는 64자 초과 이름이나 일부 AI 앱이 허용하지 않는 마침표가 포함된 이름은 고정된 해시를 포함한 짧은 별칭으로 표시하고 충돌을 검사합니다. 호출할 때 원래 서버 도구명과 입력을 그대로 전달하므로 업무를 숨기거나 줄이지 않습니다. 비밀값은 채팅, 공개 저장소 또는 공유 화면에 입력하지 않습니다. API 키에 허용된 범위만 실행할 수 있으며 실패한 작업을 자동 재제출하지 않습니다.

## 2. 가상 자료로 첫 결과 받기

계정을 연결했다면 급여대장 XLSX부터 만들어 보세요. 가상 데이터 예제이고 기관 자격증명이 필요하지 않습니다.

> XBOSS로 2026년 11월 가상직원 A 한 명의 급여대장 XLSX를 만들어 줘. 생년월일 1990-01-01, 부양가족 1명, 8~20세 자녀 0명, 기본급 3,200,000원, 국민연금 135,000원, 건강보험 113,440원, 고용보험 28,800원, 장기요양보험 14,690원, 소득세 80,000원, 지방소득세 8,000원이야. 급여대장 생성 도구의 필수값을 확인해서 입력하고, 완료되면 XBOSS 콘솔의 결과 파일을 여는 링크를 알려 줘.

결과에서 총지급 **3,200,000원**, 공제합계 **379,930원**, 실지급 **2,820,070원**을 확인합니다. 이 예제의 결과는 급여대장 1개입니다. 급여명세서가 필요하면 지급일과 사업장 정보를 준비해 [별도 생성 도구](https://xboss.biz/service-products/register-xlsx)를 사용하세요.

도구 목록만 보이거나 ‘인증 필요’, ‘데모 기간이 끝났습니다’가 표시되면 [XBOSS 콘솔](https://console.xdata.kr/)에서 계정 연결과 이용 가능 환경을 확인하세요. 계정 연결 전 결과 체험에는 [n8n 가상 예제](https://n8n.io/workflows/22207-xboss/)를 사용할 수 있습니다.

[공식 앱별 연결 안내](https://developer.xdata.kr/common-guide/mcp-native-clients)에서 사용하는 앱을 선택하세요. 계정 연결은 [XBOSS 콘솔](https://console.xdata.kr/mcp)에서 진행합니다.

앱마다 설정 방법과 준비물이 다릅니다. 기존 MCP 설정은 유지하고 XBOSS 항목만 추가하세요. 인증정보는 채팅이나 공개 저장소에 붙여 넣지 않습니다.

## 3. 필요한 상품 찾기

[전체 상품](../PRODUCTS.md)에서 상품명을 고르고 상세 안내를 확인하세요. API와 MCP 지원 여부는 상품마다 다릅니다.

연결한 AI에는 이렇게 요청할 수 있습니다.

> XBOSS에서 네이버 검색광고 성과 보고서 조회를 찾아줘. 필요한 준비와 입력값을 먼저 알려줘.

계정 연결과 입력 준비를 마친 뒤 실행을 요청하세요. 도구 목록이 보이는 것과 실제 업무 결과를 얻는 것은 서로 다른 단계입니다.

## 코드로 연결 확인

Node.js 22 이상에서 다운로드한 폴더를 열고 실행합니다. 아래 명령은 상품 작업을 실행하지 않습니다.

```sh
node bin/xboss.mjs doctor --anonymous
node bin/xboss.mjs schema naver-searchad-performance --anonymous
```

내 계정에서 쓸 수 있는 도구는 [키 설정](quickstart.md#2-내-계정-연결) 후 확인합니다.

```sh
node --env-file=.env bin/xboss.mjs schema naver-searchad-performance
```

선택한 상품 slug를 `schema`에 넣으면 그 도구만 확인합니다. 전체 목록은 `tools`로 확인할 수 있습니다. 다운로드 폴더를 사용하는 에이전트에는 [스킬 안내](../skills/SKILL.md)를 읽도록 요청하세요.

## 에이전트가 따를 순서

1. 상품 문서에서 목적과 지원 방식을 확인합니다.
2. 현재 `tools/list`의 도구명과 입력 스키마를 사용합니다. 로컬 CLI에서는 `schema <상품 slug>`로 선택합니다. 상품명에서 도구명을 추측하지 않습니다. 입력 틀의 `null`에는 사용자에게 확인한 실제 값만 넣습니다.
3. 필요한 기관 연결은 사용자가 공식 등록 화면에서 완료하도록 안내합니다.
4. 쓰기 확인이 필요한 작업은 서버의 미리보기를 보여주고 사용자의 확인을 받습니다. 확인값을 임의로 만들거나 자동 승인하지 않습니다.
5. 인증한 MCP 호출의 스키마에 `request_idempotency_key`가 있으면 최초 호출 전에 키를 만들어 입력과 함께 보관합니다. 응답 유실 복구에만 같은 키와 같은 입력을 사용하며, 같은 키로 다른 요청을 보내거나 자동 재제출하지 않습니다.
6. 사용자가 요청한 작업을 실행하고 결과와 다음 행동을 설명합니다.

서버가 다음 행동을 안내하면 그 내용을 따릅니다. 실패한 작업을 무조건 다시 실행하지 않습니다.

[코드로 시작하기](quickstart.md) · [문제 해결](troubleshooting.md) · [MCP 공식 문서](https://developer.xdata.kr/common-guide/mcp-overview)
