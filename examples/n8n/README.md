# XBOSS 업무 템플릿 · n8n

**키 없이 먼저 실행하기** [급여대장 마감 대사와 직원별 급여명세서 검토본 만들기](https://n8n.io/workflows/22207-xboss/). n8n 템플릿에서 `Use for free`를 눌러 가져오고 **예제 실행**을 누르세요. 실행 결과에서 대사 결과 XLSX와 직원별 검토본 ZIP을 받을 수 있습니다. 가상 자료가 포함되어 있고 예제가 외부 API를 호출하지 않습니다.

자사 급여 파일을 직접 만들거나 전자세금계산서 업무를 연결하려면 아래 XBOSS API 템플릿을 선택하세요.

| 업무 | 가져오기 | 안내 |
|---|---|---|
| 급여명세서 엑셀 | [JSON](payslip-xlsx.json) | [시작](payslip-xlsx.md) |
| 급여대장 엑셀 | [JSON](register-xlsx.json) | [시작](register-xlsx.md) |
| 전자세금계산서 발행 | [JSON](invoice-issue.json) | [시작](invoice-issue.md) |
| 수정세금계산서 전액 취소 | [JSON](invoice-cancel.json) | [시작](invoice-cancel.md) |
| 현금영수증 발행 | [JSON](cash-receipt.json) | [시작](cash-receipt.md) |

1. n8n에서 JSON을 가져옵니다.
2. HTTP 노드 3개에 같은 **Basic Auth**를 선택합니다. Username은 XBOSS Client ID, Password는 Client Secret입니다.
3. **Task inputs**의 업무값을 채우고 검토한 뒤 `reviewed=true`로 실행합니다.

`real_test`도 모의 실행이 아닙니다. 발행 업무는 기관 연결과 사용자 확인(`confirm=true`)이 필요합니다. 예제 급여는 가상 데이터이며, 급여·세액 계산 기능이 아닙니다.

같은 업무를 복구할 때는 `business_key`를 바꾸지 마세요. 작업 ID가 있으면 `resume_job_id`에 입력해 조회만 재개합니다. 기다리기를 멈춰도 서버 작업은 취소되지 않습니다. 동일 업무의 중복 실행 방지는 업무 키를 일관되게 관리하는 데 달려 있습니다.

결과는 **Get task result**에서 확인합니다. 파일 링크는 만료될 수 있습니다. 비밀키·실제 업무 데이터를 템플릿에 저장하거나 공개하지 마세요.

XBOSS는 무료로 시작할 수 있습니다. 개별 상품 이용 조건은 시작 과정에서 확인하세요.

n8n 2.45.7에서 5종의 가져오기·모의 API 실행을 확인했습니다. [검증 범위](VALIDATION.md)를 참고하세요. n8n 공식 템플릿 라이브러리에는 아직 등록되지 않았습니다.
