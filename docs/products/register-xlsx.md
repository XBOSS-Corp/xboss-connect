<!-- Generated from catalog/public-products.json. -->
# 급여대장/명세서 통합팩

직원별 급여 자료를 한 번 정리하면 급여대장과 급여명세서를 표준 서식 엑셀로 함께 만들고, 급여대장의 합계 행은 자동으로 계산해 넣어 드립니다.

**분야:** 급여 문서

[이 상품으로 시작하기](https://xboss.biz/auth/signup?returnTo=https%3A%2F%2Fconsole.xdata.kr%2Fproducts%3Fproduct%3Dregister-xlsx&utm_source=github&utm_medium=repository&utm_campaign=xboss_connect&utm_content=register-xlsx) ,  [공식 상품 안내](https://xboss.biz/service-products/register-xlsx?utm_source=github&utm_medium=repository&utm_campaign=xboss_connect&utm_content=register-xlsx)

XBOSS는 무료로 시작할 수 있습니다. 이 상품의 준비 사항과 이용 조건은 시작 과정에서 확인하세요.

## AI와 코드에서 사용하기

[AI 연결 안내](../ai-connect.md) ,  [코드 시작 안내](../quickstart.md)

MCP 도구명: `payroll_artifact__register_xlsx`. 실제 연결 후 도구 목록에서 현재 입력 스키마와 이용 가능 여부를 확인하세요.

- 월별 급여대장 XLSX는 `payroll_artifact__register_xlsx`로 생성합니다.
- 직원별 급여명세서 XLSX는 `payroll_artifact__payslip_xlsx`로 따로 생성합니다. 지급일과 사업장 정보도 필요합니다.
- 금액과 공제 내역을 준비한 뒤 파일로 만듭니다. [가상 데이터로 급여 마감 대사 체험](https://n8n.io/workflows/22207-xboss/)을 먼저 해볼 수 있습니다.

REST 실행 식별자: provider `payroll_artifact`, action `register_xlsx`.
공식 상품 안내에서 필요한 기관 연결과 입력값을 확인한 뒤 실행하세요.

```sh
node bin/xboss.mjs show "register-xlsx"
```

[같은 분야의 상품 찾기](../../PRODUCTS.md) ,  [연결 문제 해결](../troubleshooting.md)
