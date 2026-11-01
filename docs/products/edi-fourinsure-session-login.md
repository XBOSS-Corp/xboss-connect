<!-- Generated from catalog/public-products.json. -->
# 4대보험 EDI 세션 등록

연동 계정 하나를 넣으면 그 계정에 등록된 공동인증서로 4대사회보험 정보연계센터에 로그인하고, 세션 저장 여부와 연동 계정 ID를 돌려줍니다.

**분야:** 4대보험

[이 상품으로 시작하기](https://xboss.biz/auth/signup?returnTo=https%3A%2F%2Fconsole.xdata.kr%2Fproducts%3Fproduct%3Dedi-fourinsure-session-login&utm_source=github&utm_medium=repository&utm_campaign=xboss_connect&utm_content=edi-fourinsure-session-login) · [공식 상품 안내](https://xboss.biz/service-products/edi-fourinsure-session-login)

XBOSS는 무료로 시작할 수 있습니다. 이 상품의 준비 사항과 이용 조건은 시작 과정에서 확인하세요.

## AI와 코드에서 사용하기

[AI 연결 안내](../ai-connect.md) · [코드 시작 안내](../quickstart.md)

MCP 도구명: `fourinsure__session__login`. 실제 연결 후 도구 목록에서 현재 입력 스키마와 이용 가능 여부를 확인하세요.

REST 실행 식별자: provider `fourinsure`, action `fourinsure.session.login`.
공식 상품 안내에서 필요한 기관 연결과 입력값을 확인한 뒤 실행하세요.

```sh
node bin/xboss.mjs show "edi-fourinsure-session-login"
```

[같은 분야의 상품 찾기](../../PRODUCTS.md) · [연결 문제 해결](../troubleshooting.md)
