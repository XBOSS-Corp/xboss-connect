# AI에 연결하기

찾은 업무를 쓰던 AI에서 이어서 실행하세요. XBOSS는 무료로 시작할 수 있습니다.

## 1. 사용할 앱 연결

공식 원격 MCP 주소는 `https://api.xdata.kr/mcp`입니다. ChatGPT 등 현재 서버가 허용하는 클라이언트는 OAuth 로그인으로 연결합니다. Cursor와 Gemini CLI의 이 패키지는 기존 XBOSS API 키 인증을 사용하는 로컬 MCP 클라이언트를 제공합니다. 공개 도구 목록 조회와 실제 업무 인증은 구분되며, 보호된 업무에는 본인 계정 연결이 필요합니다.

이 저장소에는 ChatGPT와 Codex 제출용 메타데이터, Cursor 호환 Agent Plugins 패키지, Gemini CLI 확장이 포함되어 있습니다. 공개 디렉터리에 승인되어 노출되는 상태와 저장소에서 직접 연결하는 상태는 다릅니다.

| 사용하는 앱 | 연결 방법 |
| --- | --- |
| ChatGPT와 Codex | 공개 디렉터리 승인 후 XBOSS 플러그인을 설치할 수 있습니다. 승인 전 개발용 MCP 연결은 앱의 지원 요금제와 개발자 설정을 확인하세요. 이 저장소의 `plugin.json`과 `examples/platforms/openai-mcp.json`이 공동 제출 패키지의 원본입니다. |
| Cursor | Node.js 22 이상과 이 패키지를 설치하고 로컬 환경변수에 XBOSS Client ID와 Client Secret을 설정합니다. 아래 수동 설정도 사용할 수 있습니다. 공개 마켓플레이스 배포에는 별도 검토가 적용됩니다. |
| Gemini CLI | Node.js 22 이상에서 `gemini extensions install https://github.com/XBOSS-Corp/xboss-connect`로 설치합니다. 설치 설정의 XBOSS Client ID와 Client Secret을 입력하고 `/mcp`에서 연결을 점검합니다. 일반 Gemini 앱의 공개 연결 앱 등록과는 별도 경로입니다. |

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

Client ID와 Client Secret은 [콘솔 API 키 화면](https://console.xdata.kr/api)에서 확인해 앱의 로컬 설정에만 입력합니다. 설치 기본 환경은 정식 `production`이며 작업은 실제 기관에 영향을 줄 수 있습니다. 승인된 데모를 사용한다면 MCP 실행 환경변수에 `XBOSS_ENV_SCOPE=real_test`를 추가할 수 있습니다. 데모도 실제 기관 연결을 사용할 수 있습니다.

이 클라이언트는 현재 원격 도구 목록을 읽으며, 두 개의 긴 도구명에는 명시적인 짧은 별칭을 사용합니다. 호출할 때 원래 원격 이름으로 매핑하므로 해당 업무를 숨기거나 줄이지 않습니다. 비밀값은 채팅, 공개 저장소 또는 공유 화면에 입력하지 않습니다. API 키에 허용된 범위만 실행할 수 있으며 실패한 작업을 자동 재제출하지 않습니다.

[공식 앱별 연결 안내](https://developer.xdata.kr/common-guide/mcp-native-clients)에서 사용하는 앱을 선택하세요. 계정 연결은 [XBOSS 콘솔](https://console.xdata.kr/mcp)에서 진행합니다.

앱마다 설정 방법과 준비물이 다릅니다. 기존 MCP 설정은 유지하고 XBOSS 항목만 추가하세요. 인증정보는 채팅이나 공개 저장소에 붙여 넣지 않습니다.

## 2. 필요한 상품 찾기

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
