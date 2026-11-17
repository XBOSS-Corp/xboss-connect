<!-- Generated from catalog/public-products.json. -->
# XBOSS 전체 상품 | 홈택스, 4대보험, 정부24, 은행, 위택스 등 15개 이상 기관과 플랫폼

**필요한 업무를 찾고, 해당 상품에서 바로 시작하세요.**

2026-11-17 확인: 업무 상품 293개와 화면 단계 31개입니다.
화면 단계는 독립 업무 상품 수와 구분했습니다.

[무료로 시작하기](https://xboss.biz/auth/signup) ,  [AI 연결](docs/ai-connect.md) ,  [코드 시작](docs/quickstart.md)

### 4대보험

- [민원처리현황 조회](docs/products/edi-fourinsure-b1-civil-receipt-history-list.md) — 조건 없이 부르면 기관 화면에 미리 채워진 기간의 첫 쪽에 보이는 민원마다 민원 종류, 신고일, 진행상태, 보험과 기관, 처리 지사를 돌려줍니다.
- [자격상실 가입자 조회](docs/products/edi-fourinsure-b1-member-qualification-los-member-lookup.md) — 퇴사자의 성명과 주민등록번호를 넣으면 자격상실 신고서에 쓸 자격키와 기존 자격취득일, 보험별 상실일을 돌려줍니다.
- [자격상실 기존 신고 확인](docs/products/edi-fourinsure-b1-member-qualification-los-exist-check.md) — 자격키와 보험 하나를 넣으면 그 보험에 기존 상실신고가 있는지 기관에 확인해 신고 막힘 여부와 안내 문구를 돌려줍니다.
- [자격상실 초안 저장](docs/products/edi-fourinsure-b1-member-qualification-los-save.md) — 퇴사자 자격키와 성명, 주민등록번호, 공통 자격상실일, 보험마다 상실 사유, 당해연도 보수총액, 건강보험 산정 개월수를 넣으면 자격상실 신고서를 정보연계센터에 초안으로 저장하고 접수번호를 받습니다.
- [자격취득 가입자 조회](docs/products/edi-fourinsure-b1-member-qualification-acqs-member-lookup.md) — 입사자의 성명과 주민등록번호를 넣으면 자격취득 초안 저장에 쓸 자격키와 보험별 기존 취득일, 상실일을 돌려줍니다.
- [자격취득 사전 확인](docs/products/edi-fourinsure-b1-member-qualification-acqs-precheck.md) — 자격취득 신고서를 쓰기 전에 상위 접수번호를 넣으면 그 번호에 이미 작성된 건수를 돌려줍니다.
- [자격취득 초안 저장](docs/products/edi-fourinsure-b1-member-qualification-acqs-save.md) — 입사자 자격키와 성명, 주민등록번호, 자격취득일, 월 보수, 건강보험 취득부호, 고용보험 직종을 넣으면 자격취득 신고서를 정보연계센터에 초안으로 저장하고 접수번호를 받습니다.
- [증명서 발급사실 확인](docs/products/edi-fourinsure-b1-certificate-issue-fact-confirm.md) — 발급번호로 증명서가 발급된 사실이 있는지와 발급일자, 발급처, 기관 안내 문구를 돌려줍니다.
- [증명서 신청/발급 제출](docs/products/edi-fourinsure-b1-certificate-apply-submit.md) — 사업장 가입내역 확인서와 가입자 명부 중 신청할 증명서를 기관에 제출하고 접수번호를 받습니다.
- [증명서 신청이력 목록 조회](docs/products/edi-fourinsure-b1-certificate-history-list.md) — 조건 없이 부르면 증명서 신청이력 화면 첫 쪽에 보이는 신청 건마다 접수번호, 증명서 종류, 접수일시, 처리 상태, 출력 가능 여부를 돌려줍니다.
- [증명서 신청이력 상세 조회](docs/products/edi-fourinsure-b1-certificate-history-detail.md) — 접수번호 하나로 증명서 신청 건의 상세를 열어 접수일시, 처리 기관마다의 상태, 발급일자, 출력 가능 여부를 받습니다.
- [증명서 신청이력 PDF 다운로드](docs/products/edi-fourinsure-b1-certificate-history-pdf-download.md) — 출력가능 상태인 증명서 신청 건의 PDF 를 받는 상품입니다.

#### 화면 단계

아래 항목은 업무 과정의 중간 단계입니다.

- [가사근로자종사 보험료지원 신청 입력 서식 조회](docs/products/edi-fourinsure-b1-workplace-support-household-worker-init.md) — 가사근로자를 고용한 사업장의 사회보험료 지원 신청 화면을 대신 열어, 제공기관 인증번호와 지원대상 근로자수처럼 채워야 할 항목과 이미 채워진 값을 정리해 돌려줍니다.
- [가입자 내용변경 신고 입력 초안 검증](docs/products/edi-fourinsure-b1-member-qualification-chg-draft-validate.md) — 정정할 가입자의 성명과 주민등록번호, 변경부호, 변경후 값, 변경일자를 넣으면 저장 없이 점검해 빠진 항목과 오류, 신고 가능 여부를 돌려줍니다.
- [가입자 내용변경 입력 서식 조회](docs/products/edi-fourinsure-b1-member-qualification-chg-init.md) — 가입자 내용변경 신고서 화면을 열어 변경 항목별 보험 변경후 입력란과 특수직종 선택 목록, 미리 채워진 사업장 값을 돌려줍니다.
- [두루누리 보험료지원 신청 입력 서식 조회](docs/products/edi-fourinsure-b1-workplace-support-insurance-support-init.md) — 로그인한 사업장의 두루누리 보험료지원 신청 화면에서 국민연금과 고용보험 신청서 선택 칸, 가입대상자수, 지원대상 근로자수, 지원신청월 칸과 채워진 사업장 정보를 돌려줍니다.
- [두루누리 보험료지원 신청 입력 초안 검증](docs/products/edi-fourinsure-b1-workplace-support-insurance-support-draft-validate.md) — 국민연금과 고용보험별 가입대상자수, 지원대상 근로자수, 지원신청월을 넣으면 빠진 항목과 형식 오류, 신고 가능 여부를 돌려줍니다.
- [보수월액 변경신청 입력 서식 조회](docs/products/edi-fourinsure-b1-payroll-amount-change-init.md) — 로그인한 연동으로 부르면 보수월액 변경신청 화면의 사업장 관리번호와 명칭, 소재지, 보험별 가입 여부, 전화와 팩스 칸을 받습니다.
- [보수월액 변경신청 입력 초안 검증](docs/products/edi-fourinsure-b1-payroll-amount-change-draft-validate.md) — 가입자별 성명과 주민등록번호, 변경 전후 기준소득월액, 근로자 동의, 보험별 변경 금액과 변경연월을 넣으면 오류와 신고 가능 여부를 돌려줍니다.
- [사업장 성립 신고](docs/products/edi-fourinsure-b1-business-establishment-init.md) — 사업장 성립 신고 화면의 초기 정보를 조회해 사업장 명칭과 관리번호, 공통 신고 목록, 화면에 채워진 신고 정보를 돌려줍니다.
- [사업장 성립 신고 입력 초안 검증](docs/products/edi-fourinsure-b1-business-establishment-draft-validate.md) — 사업장 성립 신고서에 적을 값을 넣으면 저장이나 신고 없이 점검해 빠진 필수 항목과 항목별 오류, 신고 가능 여부를 돌려줍니다.
- [사업장 자동이체 신청 입력 초안 검증](docs/products/edi-fourinsure-b1-workplace-auto-transfer-unagreement-draft-validate.md) — 은행, 계좌번호, 예금주, 신청구분과 이체희망일 같은 자동이체 신청 값을 넣으면 빠진 필수 항목과 형식 오류, 신고 가능 여부를 돌려줍니다.
- [사업장 탈퇴 신고 입력 서식 조회](docs/products/edi-fourinsure-b1-workplace-withdrawal-init.md) — 로그인한 사업장의 탈퇴 신고 화면에서 보험별 신고서 선택 칸, 폐업과 도산 같은 신고사유 선택지, 보험별 탈퇴일과 근로자수 칸, 채워진 사업장 정보를 돌려줍니다.
- [자격상실 신고 입력 초안 검증](docs/products/edi-fourinsure-b1-member-qualification-los-draft-validate.md) — 상실자 성명과 주민등록번호, 고른 보험, 상실일과 보험별 상실사유, 보수총액을 넣으면 빠진 항목과 오류, 신고 가능 여부를 돌려줍니다.
- [자격상실 입력 서식 조회](docs/products/edi-fourinsure-b1-member-qualification-los-init.md) — 로그인한 연동으로 부르면 자격상실 신고 화면의 채워진 사업장 정보와, 비어 있는 상실일과 보험별 상실사유, 보수총액 칸 구성을 받습니다.
- [자격취득 신고 입력 초안 검증](docs/products/edi-fourinsure-b1-member-qualification-acqs-draft-validate.md) — 입사자의 성명과 주민등록번호, 자격취득일, 보험별 값을 넣으면 저장 없이 점검해 빠진 항목과 형식 오류, 신고 가능 여부를 돌려줍니다.
- [자격취득 입력 서식 조회](docs/products/edi-fourinsure-b1-member-qualification-acqs-init.md) — 가입자 자격취득 신고서 화면을 열어 미리 채워진 사업장 정보와 보험별 가입 여부, 수정할 수 없는 항목을 돌려줍니다.
- [증명서 신청/발급 입력 서식 조회](docs/products/edi-fourinsure-b1-certificate-apply-init.md) — 로그인한 연동 계정의 증명서 신청 화면을 읽어 증명서 종류와 출력 순서 보기, 전화번호 칸, 미리 채워진 사업장 정보를 돌려줍니다.
- [증명서 신청이력 상세 입력 서식 조회](docs/products/edi-fourinsure-b1-certificate-history-detail-init.md) — 증명서 신청이력 목록 조회에서 받은 접수번호를 넣으면 그 건 상세 화면의 출력 양식 칸과 출력 처리 주소를 돌려줍니다.
- [피부양자 자격 신고 입력 초안 검증](docs/products/edi-fourinsure-b1-member-qualification-dependent-draft-validate.md) — 취득 또는 상실 구분, 직장가입자, 피부양자 명단, 연락처를 넣으면 빠진 필수 항목과 형식 오류, 신고 가능 여부를 돌려줍니다.
- [피부양자 자격 취득/상실 입력 서식 조회](docs/products/edi-fourinsure-b1-member-qualification-dependent-init.md) — 로그인한 연동으로 부르면 건강보험 피부양자 신고서 화면의 신고서 종류, 채워진 사업장 정보와 신고일, 빈 가입자와 연락처 칸을 받습니다.

### 고용24

- [고용24 기업지원금 대상자 저장](docs/products/work24-subsidy-application-target-save.md) — 조회한 후보 중에서 고른 근로자를 고용촉진, 청년추가고용장려금 같은 기업지원금 신청서의 지원 대상으로 지정합니다.
- [고용24 기업지원금 대상자 후보 조회](docs/products/work24-subsidy-application-target-search.md) — 사업장 피보험자 목록을 보여 주고 고용촉진 같은 지원사업의 대상으로 지정할 수 있는 근로자를 표시합니다.
- [고용24 기업지원금 사업장정보 저장](docs/products/work24-subsidy-application-workplace-save.md) — 고용촉진 같은 기업지원금 신청서에 사업장 주소와 담당자 연락처, 지원금을 받을 계좌를 저장하고 접수번호를 받습니다.
- [고용24 기업지원금 사전진단 조회](docs/products/work24-subsidy-diagnosis-search.md) — 고용촉진, 대체인력 지원금 등 사업주 사전진단이 있는 기업지원금 사업을 사업장 기준으로 한 번에 조회해, 사업별 진단 판정을 모아 보여 줍니다.
- [고용24 기업지원금 신청 수정](docs/products/work24-subsidy-application-modify.md) — 기관이 보완을 요청한 고용촉진 등 지원금 신청서에 같은 접수번호로 수정 요청을 보냅니다.
- [고용24 기업지원금 신청 이력 조회](docs/products/work24-subsidy-application-history.md) — 고용촉진, 청년추가고용장려금 등 선택한 지원사업의 신청 건을 처리 상태와 함께 확인합니다.
- [고용24 기업지원금 신청 제출](docs/products/work24-subsidy-application-submit.md) — 기업지원금 제출 전 확인에서 제출할 수 있다고 나온 고용촉진 같은 지원사업 신청서를 고용노동부에 제출합니다.
- [고용24 기업지원금 신청 철회](docs/products/work24-subsidy-application-withdraw.md) — 제출한 고용촉진, 청년추가고용장려금 같은 기업지원금 신청을 물러야 할 때 철회를 요청합니다.
- [고용24 기업지원금 신청 필요입력 안내](docs/products/work24-subsidy-application-requirements.md) — 고용촉진, 청년추가고용장려금 같은 기업지원금을 신청하기 전에 준비할 것을 정리해 드립니다.
- [고용24 기업지원금 작성중 초안 삭제](docs/products/work24-subsidy-application-delete.md) — 작성만 해두고 제출하지 않은 고용촉진 등 지원금 신청 초안을 정리합니다.
- [고용24 기업지원금 첨부 파일 삭제](docs/products/work24-subsidy-application-attachment-delete.md) — 작성중인 고용촉진 같은 기업지원금 신청 초안에 잘못 올린 첨부 파일을 한 건씩 지웁니다.

#### 화면 단계

아래 항목은 업무 과정의 중간 단계입니다.

- [고용24 기업지원금 대상자정보 단계 진입](docs/products/work24-subsidy-application-target-init.md) — 접수번호로 작성 중인 고용촉진 같은 기업지원금 신청서를 다시 열어 대상자정보 단계로 들어갑니다.
- [고용24 기업지원금 신청 진입](docs/products/work24-subsidy-application-init.md) — 고용촉진, 청년추가고용장려금 등 고용노동부 기업지원금 가운데 원하는 사업의 신청 가능 여부를 확인합니다.
- [고용24 기업지원금 제출 전 확인](docs/products/work24-subsidy-application-draft-validate.md) — 고용촉진 같은 기업지원금 신청서를 제출 전에 기관 화면 기준으로 점검해 제출 가능 여부와 필요한 첨부서류 목록을 받습니다.

### 공공데이터 기업 위험 조회

- [고용보험 및 산재보험 가입 사업장 조회](docs/products/opendata-comwel-workplace.md) — 사업자등록번호만 있으면 그 사업자가 고용보험과 산재보험에 가입한 사업장과 성립일자, 상시인원, 업종을 확인합니다.
- [국민연금 가입 사업장 조회](docs/products/opendata-nps-workplace.md) — 사업자등록번호와 상호로 국민연금에 가입된 사업장의 가입자 수와 당월 고지금액, 등록일, 업종을 확인합니다.
- [국세청 사업자등록 상태 조회](docs/products/opendata-nts-status.md) — 거래처 사업자등록번호로 휴업과 폐업 여부, 과세유형을 국세청 자료로 확인합니다.
- [국세청 사업자등록 진위 확인](docs/products/opendata-nts-validate.md) — 거래처가 적어 준 사업자등록번호와 개업일자, 대표자명이 국세청 자료와 실제로 맞는지 대조합니다.
- [국토교통부 건설업 행정처분 조회](docs/products/opendata-kiscon-sanction.md) — 건설업체 공시 자료를 기간을 정해 훑고 사업자등록번호가 일치하는 건만 돌려줍니다.
- [기업개요 조회](docs/products/opendata-fsc-corp-outline.md) — 상호나 법인등록번호, 사업자등록번호 하나로 법인의 설립일자와 산업분류, 소재지, 종업원 수, 상장 시장을 확인합니다.
- [사업장 건물 실거래 조회](docs/products/opendata-nrg-trades.md) — 사업장 주소나 사업자등록번호로 그 지번의 상업용과 업무용 부동산 매매 실거래를 최근 기간만큼 확인합니다.
- [사업장 건물 조회](docs/products/opendata-bld-register.md) — 사업장 주소나 사업자등록번호로 그 지번의 건축물대장 표제부를 확인합니다.
- [사업장폐기물 행정처분 조회](docs/products/opendata-env-waste-sanction.md) — 폐기물을 다루는 거래처가 행정처분을 받은 적이 있는지 사업자등록번호로 확인합니다.
- [상호로 사업자 찾기](docs/products/opendata-comwel-name-search.md) — 상호만 알아도 그 이름의 사업자를 찾아 사업자등록번호와 사업장명, 주소, 성립일을 확인합니다.
- [재무 요약 조회](docs/products/opendata-fsc-financials.md) — 법인등록번호나 사업자등록번호로 공시된 법인의 매출액과 영업이익, 당기순이익, 총자산, 총부채, 부채비율을 사업연도별로 확인합니다.
- [조달청 부정당업자 제재 조회](docs/products/opendata-g2b-sanction.md) — 공공 입찰과 계약에서 문제가 됐던 업체인지 사업자등록번호 하나로 확인합니다.
- [통신판매 사업자 조회](docs/products/opendata-ftc-mail-order.md) — 상호나 사업자등록번호로 통신판매를 신고한 사업자를 찾아 운영 상태와 신고일자, 소재지를 확인합니다.

### 교통민원24

- [교통민원24 기납과태료 조회](docs/products/efine-paid-penalty-query.md) — 이미 납부한 과태료를 전체 기간이나 석 달 이내 구간으로 조회합니다.
- [교통민원24 기납범칙금 조회](docs/products/efine-paid-violation-query.md) — 이미 납부한 범칙금을 페이지 단위로 조회합니다.
- [교통민원24 미납 과태료 조회](docs/products/efine-unpaid-penalty-query.md) — 남아 있는 과태료를 전체기간이나 기간을 정해 조회합니다.
- [교통민원24 미납범칙금 조회](docs/products/efine-unpaid-violation-query.md) — 남아 있는 범칙금을 페이지 단위로 조회합니다.
- [교통민원24 최근단속내역 조회](docs/products/efine-recent-enforcement-query.md) — 보유 차량에 최근 단속이 걸렸는지 차량번호로 조회합니다.

### 국민건강보험공단 EDI

- [건강검진 대상자 상세 조회](docs/products/edi-nhis-edi-health-checkups-targets-detail.md) — 최근 석 달 안에 받은 건강검진 대상자 문서에서 검진년도와 통보일, 사무직과 비사무직 대상자 수, 사업장 주소와 연락처를 돌려줍니다.
- [건강보험료 개인별 상세 조회](docs/products/edi-nhis-edi-hr-payroll-health-premiums-employee-details.md) — 고지 연월과 차수를 넣으면 가입자고지내역서(건강)를 열어 가입자마다 보수월액과 건강보험, 장기요양보험의 산출, 조정, 당월 보험료와 합계를 받습니다.
- [건강보험료 총괄 요약 조회](docs/products/edi-nhis-edi-hr-payroll-health-premiums-summary.md) — 고지 연월과 차수를 넣으면 사업장고지내역서(건강)를 열어 고지 인원과 건강보험, 장기요양보험의 산출, 조정, 고지 총액, 납부 마감일, 미납 금액을 받습니다.
- [문서함 보낸문서 목록 조회](docs/products/edi-nhis-edi-document-box-sent-documents-list.md) — 조회 기간을 넣어 부르면 보낸 신고서마다 이름과 제출 일시, 접수 건수, 보험별 정상, 반송, 반려 건수를 받습니다.
- [문서함 보낸문서 상세 조회](docs/products/edi-nhis-edi-document-box-sent-documents-detail.md) — 보낸문서 목록의 행 번호나 행 키로 고른 4대보험 기준소득월액, 보수월액, 월평균보수 변경신청서 한 건의 대상자와 보험별 신고 내용을 받습니다.
- [보수월액 보험료 고지 상세 조회](docs/products/edi-nhis-edi-hr-payroll-premium-notices-detail.md) — 탐색 결과의 행 키나 고지 연월과 문서 이름으로 고지내역서 하나를 열어 고지 연월과 차수, 보험 종류, 기관이 준 고지 항목 행을 받습니다.
- [보수월액 보험료 고지 선택](docs/products/edi-nhis-edi-hr-payroll-premium-notices-select.md) — 탐색 결과의 행 키나 고지 연월, 문서 이름으로 고지내역서 하나를 골라 같은 연동 계정의 다음 조회가 쓰도록 남기고, 고른 문서 정보와 이어 부를 조회 목록을 받습니다.
- [보수월액 보험료 고지 탐색](docs/products/edi-nhis-edi-hr-payroll-premium-notices-search.md) — 문서를 받은 기간이나 고지 연월을 넣으면 건강과 연금, 고용, 산재 보험료의 고지내역서 목록을 받습니다.
- [보수월액 수신문서 목록 조회](docs/products/edi-nhis-edi-hr-payroll-received-documents-options.md) — 기간이나 고지 연월을 넣으면 수신문서 목록의 행마다 행 번호, 문서 이름, 고지 연월과 차수, 작성 차수를 받습니다.
- [보수월액 수신문서 상세 조회](docs/products/edi-nhis-edi-hr-payroll-received-documents-detail.md) — 수신문서 목록에서 고른 행 한 건을 열어 문서 제목과 기관의 문서 코드, 표 이름별 열과 행을 받습니다.
- [보수월액 수신문서 일괄 상세 조회](docs/products/edi-nhis-edi-hr-payroll-received-documents-batch-details.md) — 보수월액 수신문서 목록 조회가 돌려준 행 번호를 넣으면 행마다 상세를 열어 결과 목록으로 받습니다.
- [보수총액 통보서 상세 조회](docs/products/edi-nhis-edi-hr-payroll-salary-total-notice-detail.md) — 보수총액 통보서 화면의 상세 데이터와 요약 정보를 조회합니다.
- [보험료 납부와 미납 내역 조회](docs/products/edi-nhis-edi-hr-payroll-payment-status-list.md) — 연동 계정으로 부르면 기본으로 올해 건강보험의 달마다 고지금액, 납부마감일, 납부일, 낸 보험료와 연체금, 미납 금액을 장기요양보험 몫과 함께 받습니다.
- [보험료 납부확인서 발급 실행](docs/products/edi-nhis-edi-certificates-payment-completion-issue.md) — 증명서 종류와 연도, 용도, 발급구분을 넣으면 사업장 건강보험 납부확인서나 4대보험 완납증명서를 발급해 PDF 파일로 받습니다.
- [사업장 기본정보 조회](docs/products/edi-nhis-edi-business-basic-info.md) — 연동 계정으로 부르면 로그인한 건강보험 EDI 세션이 가진 사업장 기본정보를 받습니다.
- [연말정산 산출내역서 조회](docs/products/edi-nhis-edi-hr-payroll-year-end-settlement-detail.md) — 수신문서 목록에서 직장가입자 보험료 연말정산 산출내역서 행을 찾아 열면 가입자별 행과 열을 받습니다.
- [인사급여 처리결과 목록 조회](docs/products/edi-nhis-edi-hr-payroll-processing-results-list.md) — 기간이나 고지 연월을 넣으면 받은 문서와 보낸 문서의 행을 한 목록으로 받습니다.
- [전자고지 검색옵션 조회](docs/products/edi-nhis-edi-hr-payroll-edi-electronic-notices-search-options.md) — 조회 기간을 넣어 부르면 전자고지마다 고지 연월과 차수, 작성 차수, 납부자번호, 문서 이름과 행 키를 받습니다.
- [전자고지 검색행 선택](docs/products/edi-nhis-edi-hr-payroll-edi-electronic-notices-select.md) — 전자고지 검색 결과에서 행 번호나 행 키, 고지 연월과 차수로 한 건을 골라 로그인 세션에 남기고 그 고지의 값을 받습니다.
- [전자고지 상세 조회](docs/products/edi-nhis-edi-hr-payroll-edi-electronic-notices-detail.md) — 검색해 고른 전자고지 한 건의 고지서 상세 행과 총 납부보험료, 총 체납액, 납부마감일 요약을 받습니다.

#### 화면 단계

아래 항목은 업무 과정의 중간 단계입니다.

- [자격취득 신고 입력 초안 검증](docs/products/edi-nhis-edi-qualification-acquisition-draft-validate.md) — 입사자 성명과 주민등록번호, 고른 보험별 취득 값, 피부양자 행을 넣으면 빠진 항목과 오류, 첨부서류 안내, 대상자 등록 가능 여부를 돌려줍니다.

### 국민연금공단 EDI

- [가입증명 발급 대상자 조회](docs/products/edi-nps-edi-b1-certificates-membership-subscribers-search.md) — 가입증명 신청서를 보낸 가장 최근 건에 딸린 가입자를 이름으로 찾아 성명, 가입 기간 표시와 행 번호, 행 키를 돌려줍니다.
- [가입증명 신청서 발송](docs/products/edi-nps-edi-b1-certificates-membership-apply.md) — 가입증명서를 발급하기 전에 대상 가입자 1명에서 100명의 가입증명 신청서를 기관에 보냅니다.
- [가입증명서 발급](docs/products/edi-nps-edi-b1-certificates-membership-issue.md) — 선택한 가입자의 국민연금 가입증명서를 한글로 발급합니다.
- [국민연금 가입자별 보험료 내역](docs/products/edi-nps-edi-b1-national-pension-premiums-subscribers.md) — 고지 연월과 차수로 고른 고지의 가입자별 기준소득월액과 연금보험료, 부담금을 줄마다 돌려주고 받은 줄의 가입자 수와 합계도 줍니다.
- [국민연금 납부와 징수 이력](docs/products/edi-nps-edi-b1-national-pension-premiums-payment-history.md) — 고지 연월과 차수 같은 값으로 고른 고지의 납부와 징수 이력이 있으면 기관이 준 줄을 돌려줍니다.
- [국민연금 보험료 결정 요약](docs/products/edi-nps-edi-b1-national-pension-premiums-summary.md) — 고지 연월과 차수로 고른 고지의 보험료 결정 요약을 한 건으로 돌려줍니다.
- [국민연금 보험료 고지 목록 검색](docs/products/edi-nps-edi-b1-pension-notices-search.md) — 기간이나 고지 연월을 넣으면 사업장에 온 국민연금 보험료 고지를 연월, 차수, 접수일, 열람 상태와 함께 목록으로 돌려줍니다.
- [국민연금 보험료 고지 선택](docs/products/edi-nps-edi-b1-pension-notices-select.md) — 행 번호나 고지 연월과 차수를 넣어 고지 한 건을 고르면, 그 고지를 같은 세션에 기억해 두고 고지 정보를 돌려줍니다.
- [국민연금 소급분 내역](docs/products/edi-nps-edi-b1-national-pension-premiums-retro-payments.md) — 고지 연월과 차수 같은 값으로 고른 고지에 소급분 내역이 있으면 기관이 준 줄을 돌려줍니다.
- [국민연금 지원금과 보조 내역](docs/products/edi-nps-edi-b1-national-pension-premiums-support-details.md) — 고지 연월과 차수를 넣거나 앞서 고른 고지가 있으면, 그 고지의 가입자 목록과 지원내역 목록, 지원금액 합계를 돌려줍니다.
- [사업장 가입자 현황 조회](docs/products/edi-nps-edi-b1-lookups-workplace-subscribers-status.md) — 로그인한 사업장의 국민연금 가입자마다 성명, 자격 상태, 기준소득월액, 최초 취득일, 최종 상실일을 사업장 정보와 함께 돌려줍니다.
- [사업장 기본정보 조회](docs/products/edi-nps-edi-b1-workplace-main-basic-info.md) — 로그인한 사업장의 기본정보와 가입자 수, 관할 지사, 기준소득월액 상하한 정보, 메인 화면의 공지와 배너가 있으면 함께 돌려줍니다.
- [사업장 보험료 과오납금 조회](docs/products/edi-nps-edi-b1-lookups-workplace-premium-notices-search.md) — 로그인한 사업장의 국민연금 보험료 과오납금 내역 목록과 납부금액 합계, 건수, 기관 안내 메시지를 조회합니다.
- [사업장 보험료 지원 내역 조회](docs/products/edi-nps-edi-b1-lookups-workplace-premium-support-details.md) — 로그인한 사업장의 국민연금 보험료 지원 내역을 가입자별 목록과 월별 결정 목록으로 나눠 돌려주고, 금액 합계도 목록마다 따로 냅니다.
- [신고 처리결과 목록 조회](docs/products/edi-nps-edi-b1-declarations-processing-results-search.md) — 조회 기간과 신고 서식, 처리 상태를 넣으면 국민연금 EDI로 낸 신고마다 신고일자, 접수번호, 처리 상태, 보험별 확인 상태를 돌려줍니다.
- [연금 지원금 환수 결정 조회](docs/products/edi-nps-edi-b1-lookups-pension-support-recovery-decisions-search.md) — 환수 결정 연월을 정해 국민연금 지원금의 환수 결정 금액과 대상자별 내역을 조회합니다.
- [연금 통지문서 목록 검색](docs/products/edi-nps-edi-b1-pension-notification-documents-search.md) — 기간과 통지 서식을 넣으면 사업장에 온 연금 통지문서를 서식명, 송수신 구분, 열람 상태, 통지일시와 함께 목록으로 돌려줍니다.
- [연금 통지문서 상세 조회](docs/products/edi-nps-edi-b1-pension-notification-documents-detail.md) — 연금 통지문서 목록 검색에서 고른 문서를 넣으면 가입자별 근무기간, 소득총액, 결정 기준소득월액과 월 보험료를 돌려줍니다.
- [증명서 문서 뷰 파라미터 준비](docs/products/edi-nps-edi-b1-certificates-application-results-document-view.md) — 증명서 신청 처리결과 검색에서 고른 한 건을 넣으면 처리 상태와 열람 사전 확인 결과를, 상세 화면이 있는 증명서는 여는 값까지 돌려줍니다.
- [증명서 신청 처리결과 검색](docs/products/edi-nps-edi-b1-certificates-application-results-search.md) — 접수 기간과 증명서 종류, 처리 상태를 넣으면 국민연금 증명서 신청 건마다 접수번호, 문서번호, 처리 상태를 돌려줍니다.

### 근로복지공단

- [개인별 부과고지보험료 근로자 검색](docs/products/comwel-info-individual-billed-premium-worker-select.md) — 개인별 부과고지보험료를 보려면 어느 근로자인지 먼저 정해야 합니다.
- [개인별 부과고지보험료 상세](docs/products/comwel-info-individual-billed-premium-detail.md) — 고른 근로자 한 사람의 부과고지보험료를 산재보험과 고용보험으로 나눠, 근로자 부담분과 사업장 부담분을 월별로 받아옵니다.
- [보험료 부과고지 검색](docs/products/comwel-info-premium-billing-notice-search.md) — 부과 연도와 월만 정하면 그 달 사업장에 고지된 산재보험료와 고용보험료를 월별 합계로 받아옵니다.
- [보험료 부과고지 상세](docs/products/comwel-info-premium-billing-notice-detail.md) — 부과고지 검색 결과를 넘기면 그 달 고지의 근로자별 산정 내역을 받습니다.

### 급여 묶음

- [4대보험 공제 자료](docs/products/payroll-pack-insurance-deduction-material-v1-generate.md) — 건강보험료, 장기요양보험료, 국민연금보험료, 고용보험료(실업급여분)를 기관마다 찾지 않고 한 번에 받고 합계도 계산합니다.

### 급여 문서

- [급여대장/명세서 통합팩](docs/products/register-xlsx.md) — 직원별 급여 자료를 한 번 정리하면 급여대장과 급여명세서를 표준 서식 엑셀로 함께 만들고, 급여대장의 합계 행은 자동으로 계산해 넣어 드립니다.

### 기업정보 브리프

- [기업 종합 프로필](docs/products/company-info-pack-profile-v1-generate.md) — 거래처나 투자 대상 회사의 사업자 상태와 공공 제재, 보험 가입 사업장, 재무 요약, 사업장 건물까지 한 번의 요청으로 한 장에 받습니다.
- [기업정보 리스크 브리프](docs/products/company-info-pack-brief-v1-generate.md) — 새 거래처의 사업자등록 상태, 부정당업자, 건설과 폐기물 행정처분 조회 결과를 한 번의 요청으로 한 장에 받습니다.

### 네이버 검색광고

- [네이버 검색광고 광고 만들기](docs/products/naver-searchad-ads-create.md) — 광고그룹 식별자와 광고 유형, 광고 내용을 넣으면 광고가 만들어지고 심사가 시작됩니다.
- [네이버 검색광고 광고 삭제](docs/products/naver-searchad-ads-delete.md) — 광고 식별자를 넣고 확인하면 광고가 지워지고, 다시 읽어 없어졌는지 확인합니다.
- [네이버 검색광고 광고 소재 목록 조회](docs/products/naver-searchad-ads.md) — 고른 광고그룹에 걸린 광고 소재 목록을 받아 옵니다.
- [네이버 검색광고 광고 수정](docs/products/naver-searchad-ads-update.md) — 광고 식별자를 넣고 일시정지 여부를 보내면 바로 반영되고 바뀐 상태가 결과로 돌아옵니다.
- [네이버 검색광고 광고그룹 만들기](docs/products/naver-searchad-adgroups-create.md) — 캠페인 식별자와 광고그룹 이름, 유형, 비즈채널을 넣으면 광고그룹이 일시정지 상태로 만들어집니다.
- [네이버 검색광고 광고그룹 목록 조회](docs/products/naver-searchad-adgroups.md) — 고른 캠페인 아래에 있는 광고그룹 목록을 받아 옵니다.
- [네이버 검색광고 광고그룹 삭제](docs/products/naver-searchad-adgroups-delete.md) — 광고그룹 식별자를 넣고 확인하면 광고그룹이 지워지고, 다시 읽어 없어졌는지 확인합니다.
- [네이버 검색광고 광고그룹 수정](docs/products/naver-searchad-adgroups-update.md) — 광고그룹 식별자와 바꿀 값을 넣으면 일시정지, 다시 시작, 네트워크 입찰 가중치, 지역, 시간, 매체, 성별 타기팅이 반영됩니다.
- [네이버 검색광고 노출 문제 점검](docs/products/naver-searchad-measurement-audit.md) — 넣을 값 없이 계정의 캠페인, 광고그룹, 광고, 키워드를 모두 읽고 광고가 나가지 않게 막는 네 가지 문제를 찾아 고칠 방법과 함께 알려 줍니다.
- [네이버 검색광고 비즈머니 잔액 조회](docs/products/naver-searchad-bizmoney.md) — 네이버 검색광고 광고비로 쓰는 비즈머니 잔액을 넣을 값 없이 확인합니다.
- [네이버 검색광고 성과 보고서 조회](docs/products/naver-searchad-performance.md) — 캠페인이나 광고그룹의 노출, 클릭, 비용 같은 성과를 받아 옵니다.
- [네이버 검색광고 캠페인 만들기](docs/products/naver-searchad-campaigns-create.md) — 캠페인 이름과 유형을 넣으면 캠페인이 만들어지고, 받은 캠페인 식별자로 광고그룹 만들기를 이어갑니다.
- [네이버 검색광고 캠페인 목록 조회](docs/products/naver-searchad-campaigns.md) — 연동한 네이버 검색광고 계정의 캠페인 목록을 넣을 값 없이 한 번에 받아 옵니다.
- [네이버 검색광고 캠페인 삭제](docs/products/naver-searchad-campaigns-delete.md) — 캠페인 식별자를 넣고 확인하면 캠페인과 그 아래 전부가 지워지고, 다시 읽어 정말 없어졌는지 확인합니다.
- [네이버 검색광고 캠페인 수정](docs/products/naver-searchad-campaigns-update.md) — 캠페인 식별자와 바꿀 값을 넣으면 일시정지, 다시 시작, 광고 기간이 바로 반영되고 바뀐 캠페인 설정이 결과로 돌아옵니다.
- [네이버 검색광고 키워드 만들기](docs/products/naver-searchad-keywords-create.md) — 광고그룹 식별자와 키워드 목록을 넣으면 키워드가 한꺼번에 만들어지고 심사가 시작됩니다.
- [네이버 검색광고 키워드 목록 조회](docs/products/naver-searchad-keywords.md) — 고른 광고그룹에 이미 등록한 키워드 목록을 받아 옵니다.
- [네이버 검색광고 키워드 삭제](docs/products/naver-searchad-keywords-delete.md) — 키워드 식별자를 넣고 확인하면 키워드가 지워지고, 다시 읽어 없어졌는지 확인합니다.
- [네이버 검색광고 키워드 수정](docs/products/naver-searchad-keywords-update.md) — 키워드 식별자와 일시정지 여부나 입찰가를 넣으면 바로 반영되고 바뀐 상태와 심사 상태가 결과로 돌아옵니다.

### 네이버 마케팅

- [네이버 블로그 글 초안 만들기](docs/products/naver-blog-post-draft-create.md) — 준비한 제목과 본문, 태그, 카테고리로 내 네이버 블로그에 새 글 초안을 만들어 임시저장합니다.
- [네이버 블로그 글 초안 수정](docs/products/naver-blog-post-draft-update.md) — 이미 임시저장한 네이버 블로그 초안 하나를 새 제목과 본문, 태그, 카테고리로 고쳐 다시 임시저장합니다.
- [네이버 블로그 글쓰기 임시저장](docs/products/naver-blog-post-draft-save.md) — 준비한 제목과 본문, 태그, 카테고리를 내 네이버 블로그에 임시저장합니다.
- [네이버 블로그 내 글 조회](docs/products/naver-blog-owner-post.md) — 연결한 내 네이버 블로그의 글을 글 번호로 조회하면 제목과 작성일, 본문까지 받아 옵니다.
- [네이버 블로그 방문 통계 조회](docs/products/naver-blog-owner-stats.md) — 연결한 내 네이버 블로그의 방문 통계를 넣은 지표와 기준일로 받아 옵니다.

### 네이버 블로그 검색

- [네이버 블로그 검색 조회](docs/products/naver-blog-search.md) — 검색어에 맞는 네이버 블로그 글을 목록으로 받아 옵니다.

### 마케팅 통합 보고

- [마케팅 통합 보고](docs/products/google-marketing-report.md) — 애널리틱스 측정 진단과 웹사이트 성과, Search Console 검색 실적을 한 번의 요청으로 조회해 보고서 하나로 묶어 줍니다.

### 부가세 신고

- [부가세 공제판정, 세무사 검토](docs/products/vat-deduction-review.md) — 모은 자료로 매입세액 공제 여부를 자동으로 판정해 세무사 검토용으로 정리합니다.
- [부가세 원천, 기관원본 준비](docs/products/vat-source-preparation.md) — 흩어진 매출과 매입 자료를 한 번에 끌어와 부가세 신고 준비 상태로 모읍니다.
- [카드 매입 공제변경 반영](docs/products/vat-card-change-apply.md) — 공제와 불공제로 바꿀 사업용 카드 매입 건을 한 번에 기관 목록에 반영합니다.

### 블로그 자동작성

- [블로그 본문 자동작성 (선택)](docs/products/blog-autowrite-generate.md) — 주제와 설정을 넣으면 엑스보스 스타일로 블로그 본문 초안을 만들어 돌려줍니다.

### 사회보험통합징수포털

- [사회보험통합징수포털 납부확인서 발급](docs/products/si4n-payment-confirmation-issue.md) — 건강보험과 국민연금, 고용보험, 산재보험의 납부확인서를 발급하고, 합산고지를 신청한 사업장은 네 보험 합산 확인서도 받습니다.
- [사회보험통합징수포털 보험료 산출내역 조회](docs/products/si4n-premium-calculation-inquiry.md) — 고지서 금액이 왜 그 숫자인지 항목별로 받아 봅니다.
- [사회보험통합징수포털 보험료 조회](docs/products/si4n-premium-inquiry.md) — 4대보험 보험료가 얼마이고 미납이 남아 있는지 고지년월과 함께 호출 한 번으로 받습니다.

### 신한은행 간편조회

- [신한은행 간편조회 거래내역 조회](docs/products/shinhan-easy-accounts-transaction-history-search.md) — 기간을 지정해 신한은행 계좌의 거래내역을 건별로 받습니다.
- [신한은행 간편조회 계좌 목록 조회](docs/products/shinhan-easy-accounts-list.md) — 신한은행에 연결된 조회 계좌를 한 번에 나열합니다.

### 우리은행 빠른조회

- [우리은행 빠른조회 거래내역 조회](docs/products/woori-bank-accounts-transaction-history-search.md) — 시작일과 종료일을 정해 우리은행 계좌의 거래내역을 받습니다.

### 위택스

- [지방세 고지 및 미납 내역 조회](docs/products/wetax-tax-local-due-query.md) — 사업장 인증서 연동으로 조회 기간과 세목을 지정해 지방세 고지 및 미납 내역을 페이지 단위로 확인합니다.
- [지방세 납부내역 조회](docs/products/wetax-tax-local-payment-history-query.md) — 납부일 기간과 세목을 지정해 지방세 납부 이력, 전자납부번호와 기관 식별자를 페이지별로 확인합니다.
- [지방세 환급 조회](docs/products/wetax-tax-local-refund-query.md) — 환급 가능 건수를 확인하고, 환급 기간과 유형 및 처리 상태를 지정해 신청 및 지급 이력을 확인합니다.
- [지방소득세 특별징수 납부 상태 조회](docs/products/wetax-tax-local-income-special-withholding-payment-status.md) — 제출한 신고가 납부까지 됐는지 신고 식별자 하나로 확인합니다.
- [지방소득세 특별징수 신고 검토](docs/products/wetax-tax-local-income-special-withholding-review.md) — 제출 전에 기관에 지금 저장된 신고 내용을 다시 읽어 요약으로 받습니다.
- [지방소득세 특별징수 신고 대상 저장](docs/products/wetax-tax-local-income-special-withholding-target-save.md) — 이번 신고의 귀속 연월과 지급 연월, 소득 종류별 내역을 한 번에 저장합니다.
- [지방소득세 특별징수 신고 명세 저장](docs/products/wetax-tax-local-income-special-withholding-statement-save.md) — 소득자별 명세가 필요할 때만 담아 저장합니다.
- [지방소득세 특별징수 신고 세액 저장](docs/products/wetax-tax-local-income-special-withholding-adjustment-save.md) — 과세표준과 산출세액은 대상 저장 합계와 같은 값을 넣고, 당월 기타 환급액과 중도 퇴사자 환급액, 추가납부액, 비고를 담습니다.
- [지방소득세 특별징수 신고 이력 조회](docs/products/wetax-tax-local-income-special-withholding-search-history.md) — 기간을 정해 그동안의 특별징수 신고 이력을 받습니다.
- [지방소득세 특별징수 신고 제출](docs/products/wetax-tax-local-income-special-withholding-submit.md) — 저장 네 단계를 마친 신고를 기관에 제출합니다.
- [지방소득세 특별징수 신고 취소](docs/products/wetax-tax-local-income-special-withholding-cancel.md) — 제출한 신고를 취소합니다.
- [지방소득세 특별징수 신고인 저장](docs/products/wetax-tax-local-income-special-withholding-declarant-save.md) — 신고인 정보를 저장하면 작성 중인 신고서가 생기고 신고 식별자가 돌아옵니다.

#### 화면 단계

아래 항목은 업무 과정의 중간 단계입니다.

- [지방소득세 특별징수 신고 시작](docs/products/wetax-tax-local-income-special-withholding-init.md) — 원천징수분 지방소득세 신고를 쓰기 전에 사업장 정보와 저장 단계마다 넣을 값을 한 번에 확인합니다.

### 정부24

- [정부24 사업자등록증명(법인) 발급](docs/products/gov24-business-registration-certificate-issue.md) — 거래처가 요구하는 법인 사업자등록증명을 기관 화면을 열지 않고 신청해 PDF 로 내려받습니다.
- [정부24 지방세 납세증명서(법인) 발급](docs/products/gov24-local-tax-certificate-issue.md) — 입찰과 계약에 내야 하는 법인 지방세 납세증명서를 기관 화면을 열지 않고 신청해 PDF 로 내려받습니다.

### 지원금 진단

- [기업지원금 진단](docs/products/subsidy-pack-diagnosis-v1-generate.md) — 고용촉진, 대체인력 지원금 등 고용 지원금 17개 사업의 사전진단을 한 번에 끝내고 신청 가능, 결격 사유, 판정 전으로 나눠 드립니다.

### 통합 묶음

- [세무 현황 통합관리팩](docs/products/mcp-bundle-tax-status-v1.md) — 홈택스에서 나눠 쓰던 세무 업무를 한 묶음으로 씁니다.
- [자금 및 카드 통합관리팩](docs/products/mcp-bundle-finance-card-v1.md) — 카드사와 은행 사이트를 따로 열던 일을 한 묶음이 대신합니다.

### 티스토리

- [티스토리 글 초안 만들기](docs/products/tistory-post-draft-create.md) — 준비한 제목과 본문, 태그, 카테고리로 내 티스토리에 새 글 초안을 만들어 임시저장합니다.
- [티스토리 글 초안 수정](docs/products/tistory-post-draft-update.md) — 이미 임시저장한 티스토리 초안 하나를 새 제목과 본문, 태그, 카테고리로 고쳐 다시 임시저장합니다.
- [티스토리 글쓰기 임시저장](docs/products/tistory-post-draft-save.md) — 고객이 만든 글을 태그, 카테고리와 함께 티스토리에 임시저장합니다.

### 하나은행 빠른조회

- [하나은행 빠른조회 거래내역 조회](docs/products/hana-fast-account-accounts-transaction-history-search.md) — 시작일과 종료일을 정해 하나은행 계좌의 거래내역을 받습니다.

### 홈택스

- [고지 납부 내역 조회](docs/products/%EC%84%B8%EA%B8%88-%EB%82%A9%EB%B6%80-%ED%99%98%EA%B8%89-%EA%B3%A0%EC%A7%80-%EC%B2%B4%EB%82%A9-%EB%82%B4%EC%97%AD.md) — 국세청이 보낸 고지서를 발송일 기준으로 최근 십 년 범위에서 되짚어 봅니다.
- [국세완납증명서 발급(신청)](docs/products/%EA%B5%AD%EC%84%B8%EC%99%84%EB%82%A9%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%8B%A0%EC%B2%AD.md) — 은행 대출과 공공 입찰, 거래처 계약에 필요한 국세완납증명서를 홈택스에 신청하고 증명서 ID를 받습니다.
- [나의 세무대리인 조회](docs/products/%EB%82%98%EC%9D%98%EC%84%B8%EB%AC%B4%EB%8C%80%EB%A6%AC%EC%9D%B8-%EC%A1%B0%ED%9A%8C.md) — 지금 우리 회사를 수임하고 있는 세무대리인이 누구인지, 언제부터 맡았고 어디까지 정보를 제공하기로 했는지 확인합니다.
- [납부할 세액 조회](docs/products/%EB%82%A9%EB%B6%80%ED%95%A0%EC%84%B8%EC%95%A1-%EC%A1%B0%ED%9A%8C%EB%82%A9%EB%B6%80.md) — 전자신고를 마쳤거나 고지서를 받은 뒤 지금 실제로 내야 할 세액을 세목별로 확인합니다.
- [납세사실증명서 발급(신청)](docs/products/%EB%82%A9%EC%84%B8%EC%82%AC%EC%8B%A4%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%8B%A0%EC%B2%AD.md) — 납부한 기간을 정해 증명하는 납세사실증명서를 홈택스에 신청하고 증명서 ID를 받습니다.
- [미수령 환급금 조회](docs/products/%EB%AF%B8%EC%88%98%EB%A0%B9-%ED%99%98%EA%B8%89%EA%B8%88-%EC%A1%B0%ED%9A%8C.md) — 환급 결정일부터 최근 5년 사이에 찾아가지 않은 국세 환급금이 남아 있는지 확인합니다.
- [부가가치세 과세표준증명원 발급(신청)](docs/products/%EB%B6%80%EA%B0%80%EA%B0%80%EC%B9%98%EC%84%B8-%EA%B3%BC%EC%84%B8%ED%91%9C%EC%A4%80%EC%A6%9D%EB%AA%85%EC%9B%90-%EC%8B%A0%EC%B2%AD.md) — 부가가치세 과세표준과 납부세액을 담은 증명원을 홈택스에 신청합니다.
- [부가가치세 신고내역 조회](docs/products/%EB%B6%80%EA%B0%80%EA%B0%80%EC%B9%98%EC%84%B8-%EC%8B%A0%EA%B3%A0%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 언제 어떤 내용으로 부가가치세를 신고했는지 신고일자 기간으로 되짚어 봅니다.
- [부가세 신고서 작성, 신고](docs/products/vat-return-filing.md) — 준비하고 검토한 자료로 부가세 신고서를 작성해 값을 검증하고 제출합니다.
- [부가세와 법인세 신고내역 조회](docs/products/%EC%84%B8%EA%B8%88-%EC%8B%A0%EA%B3%A0%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 경정청구를 준비할 때 지난 세금 신고를 신고일자 기간으로 최대 6년까지 한 번에 모아 봅니다.
- [부가세와 법인세 신고서 상세 조회](docs/products/%EC%84%B8%EA%B8%88-%EC%8B%A0%EA%B3%A0%EC%84%9C-%EC%83%81%EC%84%B8-%EC%A1%B0%ED%9A%8C.md) — 이미 낸 부가가치세 신고서와 법인세 과세표준 및 세액신고서를 표준재무상태표, 세액조정계산서 같은 부속서류까지 서식별 항목과 값으로 받습니다.
- [부가세와 법인세 신고서 원문 PDF 조회](docs/products/%EC%84%B8%EA%B8%88-%EC%8B%A0%EA%B3%A0%EC%84%9C-%EC%9B%90%EB%AC%B8-%EC%A1%B0%ED%9A%8C.md) — 지난 부가가치세 신고서와 법인세 과세표준 및 세액신고서를 원문 PDF 로 받습니다.
- [사업자 등록사항 및 담당자 안내](docs/products/%EC%82%AC%EC%97%85%EC%9E%90-%EB%93%B1%EB%A1%9D%EC%82%AC%ED%95%AD-%EB%B0%8F-%EB%8B%B4%EB%8B%B9%EC%9E%90-%EC%95%88%EB%82%B4.md) — 내 사업장의 등록사항을 상호와 사업상태, 과세유형, 주업종까지 한 번에 확인하고 관할 세무서와 담당자 이름, 전화번호를 함께 받습니다.
- [사업자등록 상태 조회(개인 휴폐업)](docs/products/%EA%B0%9C%EC%9D%B8%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D%EC%83%81%ED%83%9C-%EC%A1%B0%ED%9A%8C.md) — 거래를 트기 전 상대 사업자등록번호만 넣으면 계속 사업 중인지 휴업인지 폐업인지, 과세유형은 무엇인지 돌아옵니다.
- [사업자등록증 재발급(신청)](docs/products/%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D%EC%A6%9D-%EC%9E%AC%EB%B0%9C%EA%B8%89-%EC%8B%A0%EC%B2%AD.md) — 사업자등록증 원본을 잃어버렸거나 훼손됐을 때 재발급을 신청하고 증명서 ID를 받습니다.
- [사업자등록증명 발급](docs/products/%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D-%EC%A6%9D%EB%AA%85.md) — 상대 회사가 요구하는 사업자등록증명을 제출처 조건에 맞춰 홈택스에 신청하고 증명서 ID를 받습니다.
- [소득금액증명 발급](docs/products/%EC%A6%9D%EB%AA%85%EB%B0%9C%EA%B8%89-%EC%86%8C%EB%93%9D%EA%B8%88%EC%95%A1%EC%A6%9D%EB%AA%85%EC%9B%90.md) — 종합소득세 신고 내역을 근거로 한 소득금액증명을 홈택스에 신청하고 증명서 ID를 받습니다.
- [신용카드 매출자료 조회](docs/products/%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C-%EB%A7%A4%EC%B6%9C%EC%9E%90%EB%A3%8C-%EC%A1%B0%ED%9A%8C.md) — 홈택스에 모인 신용카드와 제로페이, 판매 결제대행 매출자료를 함께 받아옵니다.
- [원천세 기한후신고 기본정보 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EA%B8%B0%EB%B3%B8%EC%82%AC%ED%95%AD-%EC%A0%80%EC%9E%A5.md) — 기한후신고서의 신고 구분과 회사명, 대표자 같은 납세자 정보, 신고할 소득 종류를 저장합니다.
- [원천세 기한후신고 부표 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EB%B6%80%ED%91%9C-%EC%A0%80%EC%9E%A5.md) — 작성 중인 기한후신고서의 부표를 저장하고 홈택스에서 다시 읽어 저장된 내용을 확인합니다.
- [원천세 기한후신고 소득별 상세 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EC%86%8C%EB%93%9D%EB%B3%84-%EB%AA%85%EC%84%B8-%EC%A0%80%EC%9E%A5.md) — 기한후신고서에 소득 종류별 인원과 총지급액, 징수세액과 가산세를 저장합니다.
- [원천세 기한후신고 신고 내역 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EC%8B%A0%EA%B3%A0-%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 사업자등록번호와 접수일 기간을 정해 홈택스에 접수된 원천세 신고 목록을 불러옵니다.
- [원천세 기한후신고 작성 참고자료 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%84%B1-%EC%B0%B8%EA%B3%A0%EC%9E%90%EB%A3%8C-%EC%A1%B0%ED%9A%8C.md) — 기한후신고를 쓰는 동안 필요한 기납부세액과 가산세, 홈택스에 저장해 둔 신고서를 조회합니다.
- [원천세 기한후신고 작성 취소](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%84%B1-%EC%B7%A8%EC%86%8C.md) — 홈택스에 작성 중인 기한후신고서를 취소합니다.
- [원천세 기한후신고 저장 내용 검토](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EA%B2%80%ED%86%A0.md) — 저장한 기한후신고서를 홈택스 내용검증에 넣어 바로 제출할 수 있는지, 경고를 확인해야 하는지 알려 드립니다.
- [원천세 기한후신고 접수증 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EC%A0%91%EC%88%98%EC%A6%9D-%EC%A1%B0%ED%9A%8C.md) — 제출한 원천세 기한후신고가 홈택스에 제대로 접수됐는지 접수번호와 접수일로 다시 확인합니다.
- [원천세 기한후신고 제출](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EC%A0%9C%EC%B6%9C.md) — 미리보기까지 마친 원천세 기한후신고서를 홈택스에 접수합니다.
- [원천세 기한후신고 제출 전 미리보기](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.md) — 검토를 마친 기한후신고서가 실제로 접수될 모습을 제출 전에 그대로 펼쳐 봅니다.
- [원천세 수정신고 기본정보 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EA%B8%B0%EB%B3%B8%EC%82%AC%ED%95%AD-%EC%A0%80%EC%9E%A5.md) — 수정신고서의 신고 구분과 납세자 정보, 신고할 소득 종류를 작성 중인 신고서에 저장합니다.
- [원천세 수정신고 부표 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EB%B6%80%ED%91%9C-%EC%A0%80%EC%9E%A5.md) — 작성 중인 수정신고서의 부표를 저장하고 홈택스에서 다시 읽어 저장된 내용을 확인합니다.
- [원천세 수정신고 소득별 상세 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EC%86%8C%EB%93%9D%EB%B3%84-%EB%AA%85%EC%84%B8-%EC%A0%80%EC%9E%A5.md) — 작성 중인 수정신고서에 소득 종류별로 바로잡은 인원과 지급액, 징수세액을 저장합니다.
- [원천세 수정신고 신고 내역 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EC%8B%A0%EA%B3%A0-%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 기간을 정해 홈택스에 접수된 원천세 신고 내역을 받아 수정신고가 언제 어떤 연월로 접수됐는지 확인합니다.
- [원천세 수정신고 작성 참고자료 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%84%B1-%EC%B0%B8%EA%B3%A0%EC%9E%90%EB%A3%8C-%EC%A1%B0%ED%9A%8C.md) — 수정신고서를 고치는 데 필요한 기납부세액과 가산세, 홈택스에 저장된 수정신고서를 조회합니다.
- [원천세 수정신고 작성 취소](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%84%B1-%EC%B7%A8%EC%86%8C.md) — 홈택스에 작성 중인 수정신고서를 취소합니다.
- [원천세 수정신고 저장 내용 검토](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EA%B2%80%ED%86%A0.md) — 저장한 수정신고서를 홈택스 내용검증 기준으로 확인해 바로 제출할 수 있는지, 경고 확인이 필요한지 알려 드립니다.
- [원천세 수정신고 접수증 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EC%A0%91%EC%88%98%EC%A6%9D-%EC%A1%B0%ED%9A%8C.md) — 제출한 원천세 수정신고의 접수번호와 접수일을 홈택스 접수 목록에서 다시 확인합니다.
- [원천세 수정신고 제출](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EC%A0%9C%EC%B6%9C.md) — 미리보기까지 마친 원천세 수정신고서를 홈택스에 제출합니다.
- [원천세 수정신고 제출 전 미리보기](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.md) — 검토를 마친 수정신고서가 제출될 모습을 그대로 보여 드립니다.
- [원천세 신고 삭제신청 내역 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%8B%A0%EA%B3%A0-%EC%82%AD%EC%A0%9C%EC%8B%A0%EC%B2%AD-%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 기간을 정하면 그동안 낸 원천세 신고 삭제신청을 신청 일시와 처리 상태, 삭제 완료 여부와 함께 모아 보여 드립니다.
- [원천세 신고 삭제신청 대상 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%8B%A0%EA%B3%A0-%EC%82%AD%EC%A0%9C%EC%8B%A0%EC%B2%AD-%EB%8C%80%EC%83%81-%EC%A1%B0%ED%9A%8C.md) — 홈택스에 접수된 원천세 신고 가운데 삭제를 신청할 수 있는 신고를 귀속월과 접수번호로 보여 드립니다.
- [원천세 신고 삭제신청 접수증 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%8B%A0%EA%B3%A0-%EC%82%AD%EC%A0%9C%EC%8B%A0%EC%B2%AD-%EC%A0%91%EC%88%98%EC%A6%9D-%EC%A1%B0%ED%9A%8C.md) — 제출한 원천세 신고 삭제신청이 홈택스에 접수됐는지 접수번호와 접수 일시, 처리 상태로 보여 드립니다.
- [원천세 신고 삭제신청 제출](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%8B%A0%EA%B3%A0-%EC%82%AD%EC%A0%9C%EC%8B%A0%EC%B2%AD-%EC%A0%9C%EC%B6%9C.md) — 준비 단계에서 확인한 원천세 신고의 삭제신청을 홈택스에 제출합니다.
- [원천세 신고 삭제신청 준비](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%8B%A0%EA%B3%A0-%EC%82%AD%EC%A0%9C%EC%8B%A0%EC%B2%AD-%EC%A4%80%EB%B9%84.md) — 고른 원천세 신고가 조회 때와 그대로인지 다시 확인하고 신청인 이름과 연락처, 개인정보 동의를 점검합니다.
- [원천세 신고 접수 내역 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%8B%A0%EA%B3%A0-%EC%A0%91%EC%88%98-%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 기간을 정해 접수된 원천세 신고를 정기신고, 수정신고, 기한후신고 구분 없이 받아 접수번호와 접수일, 납부세액을 확인합니다.
- [원천세 전자파일 변환신고 내용검증 요청](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EB%82%B4%EC%9A%A9%EA%B2%80%EC%A6%9D-%EC%9A%94%EC%B2%AD.md) — 형식검증을 통과한 원천세 신고 전자파일의 내용검증을 홈택스에 요청합니다.
- [원천세 전자파일 변환신고 암호 입력 형식검증](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EC%95%94%ED%98%B8-%EC%9E%85%EB%A0%A5-%ED%98%95%EC%8B%9D%EA%B2%80%EC%A6%9D.md) — 홈택스가 암호 입력을 요청한 원천세 신고 전자파일에 암호를 넣어 형식검증을 다시 요청합니다.
- [원천세 전자파일 변환신고 원본 올리기](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EC%9B%90%EB%B3%B8-%EC%98%AC%EB%A6%AC%EA%B8%B0.md) — 미리 등록한 원천세 신고 전자파일 원본을 홈택스 변환 시스템에 올리고 곧바로 형식검증을 요청합니다.
- [원천세 전자파일 변환신고 접수증 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EC%A0%91%EC%88%98%EC%A6%9D-%EC%A1%B0%ED%9A%8C.md) — 제출한 원천세 전자파일 변환신고가 홈택스에 접수됐는지 접수번호로 다시 확인합니다.
- [원천세 전자파일 변환신고 제출](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EC%A0%9C%EC%B6%9C.md) — 미리보기로 확인한 원천세 전자파일 변환신고 대상을 홈택스에 접수합니다.
- [원천세 전자파일 변환신고 제출 전 미리보기](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.md) — 내용검증까지 끝나 변환이 완료된 원천세 신고 가운데 제출할 대상 전체를 제출 전에 펼쳐 봅니다.
- [원천세 전자파일 변환신고 진행현황 조회](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EC%A7%84%ED%96%89%ED%98%84%ED%99%A9-%EC%A1%B0%ED%9A%8C.md) — 원천세 신고 전자파일의 형식검증과 내용검증이 어디까지 왔는지 홈택스에서 다시 읽어 옵니다.
- [원천세 정기신고 기본정보 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%95%EA%B8%B0%EC%8B%A0%EA%B3%A0-%EA%B8%B0%EB%B3%B8%EC%82%AC%ED%95%AD-%EC%A0%80%EC%9E%A5.md) — 작성 중인 원천세 신고서의 첫 장을 채웁니다.
- [원천세 정기신고 소득별 상세 저장](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%95%EA%B8%B0%EC%8B%A0%EA%B3%A0-%EC%86%8C%EB%93%9D%EB%B3%84-%EB%AA%85%EC%84%B8-%EC%A0%80%EC%9E%A5.md) — 급여대장에서 뽑은 숫자를 신고서 명세에 채웁니다.
- [원천세 정기신고 저장 내용 검토](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%95%EA%B8%B0%EC%8B%A0%EA%B3%A0-%EA%B2%80%ED%86%A0.md) — 제출하기 전에 지금까지 저장한 내용이 신고서 기준에 맞는지 따져 봅니다.
- [원천세 정기신고 제출](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%95%EA%B8%B0%EC%8B%A0%EA%B3%A0-%EC%A0%9C%EC%B6%9C.md) — 작성과 검토가 끝난 원천세 신고서를 홈택스에 접수합니다.
- [원천세 정기신고 제출 전 미리보기](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%95%EA%B8%B0%EC%8B%A0%EA%B3%A0-%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.md) — 접수 직전의 신고서를 그대로 펼쳐 봅니다.
- [전자고지(전자송달) 신청 현황 조회](docs/products/%EC%A0%84%EC%9E%90%EA%B3%A0%EC%A7%80-%EC%8B%A0%EC%B2%AD-%ED%98%84%ED%99%A9-%EC%A1%B0%ED%9A%8C.md) — 연결에 로그인한 사용자가 전자고지를 신청했는지, 언제부터 언제까지 적용되는지 확인합니다.
- [전자세금계산서 거래처 정보 조회](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EA%B1%B0%EB%9E%98%EC%B2%98-%EC%A0%95%EB%B3%B4.md) — 홈택스 전자세금계산서 발급 화면에 등록해 둔 거래처 목록을 그대로 받아옵니다.
- [전자세금계산서 공급자 정보 조회](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EA%B3%B5%EA%B8%89%EC%9E%90-%EC%A0%95%EB%B3%B4.md) — 전자세금계산서 공급자 칸에 들어가는 상호, 대표자, 업태, 주소, 이메일을 홈택스에서 받습니다.
- [전자세금계산서 목록 조회](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EB%AA%A9%EB%A1%9D.md) — 홈택스에 쌓인 전자세금계산서를 기간과 매출 매입 구분으로 받아옵니다.
- [전자세금계산서 발행](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EB%B0%9C%ED%96%89.md) — 거래처 사업자등록번호와 품명, 수량, 단가, 공급일자를 넘기면 홈택스에 전자세금계산서를 발행합니다.
- [전자세금계산서 상세 조회](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EC%83%81%EC%84%B8.md) — 승인번호 한 건으로 그 전자세금계산서의 속을 전부 펼쳐 봅니다.
- [전자세금계산서 수정 취소](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EB%B0%9C%ED%96%89%EC%B7%A8%EC%86%8C.md) — 이미 발행한 전자세금계산서를 원본 승인번호로 지목해, 원본 전액을 취소하는 수정세금계산서를 발행합니다.
- [전자세금계산서 통계 조회](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EA%B8%B0%EA%B0%84%EB%B3%84-%EB%A7%A4%EC%B6%9C-%EB%A7%A4%EC%9E%85-%ED%86%B5%EA%B3%84.md) — 전자세금계산서 매출과 매입을 월별, 분기별, 연도별로 집계해 받습니다.
- [전자세금계산서 합계표 조회](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%ED%95%A9%EA%B3%84%ED%91%9C.md) — 부가가치세 신고에 붙이는 매출과 매입 합계표를 홈택스에서 그대로 받아옵니다.
- [증명서 내려받기](docs/products/%EC%A6%9D%EB%AA%85%EC%84%9C-%EB%82%B4%EB%A0%A4%EB%B0%9B%EA%B8%B0.md) — 국세완납증명, 사업자등록증명 등 신청해 둔 증명서를 증명서 ID와 접수번호로 출력해 PDF로 받습니다.
- [증명서 서식 지정 신청](docs/products/%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%84%9C%EC%8B%9D-%EC%A7%80%EC%A0%95-%EC%8B%A0%EC%B2%AD.md) — 국세완납증명, 사업자등록증명 등 증명서 서식을 골라 홈택스에 발급을 신청하고, 접수되면 증명서 ID를 받습니다.
- [증명서 신청 목록 조회](docs/products/%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%A7%84%EC%9C%84%ED%99%95%EC%9D%B8.md) — 홈택스에 신청해 둔 국세완납증명, 사업자등록증명 등 증명서가 어느 단계인지 목록으로 확인합니다.
- [증명서 자동 신청](docs/products/%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%9E%90%EB%8F%99-%EC%8B%A0%EC%B2%AD.md) — 로그인한 사업자 정보를 홈택스에서 가져와 신청서를 채우며, 서식을 정하지 않으면 국세완납증명으로 신청합니다.
- [증명서 자동 신청 후 내려받기](docs/products/%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%9E%90%EB%8F%99-%EC%8B%A0%EC%B2%AD-%EB%82%B4%EB%A0%A4%EB%B0%9B%EA%B8%B0.md) — 로그인한 사업자 명의로 국세완납증명 1매를 신청하고, 발급되면 PDF로 받습니다.
- [지급명세서 등 제출내역 조회](docs/products/%EC%A7%80%EA%B8%89%EB%AA%85%EC%84%B8%EC%84%9C-%EB%93%B1-%EC%A0%9C%EC%B6%9C%EB%82%B4%EC%97%AD.md) — 일용근로소득 지급명세서와 간이지급명세서를 제출 연월로 조회해 무엇을 언제 냈는지 확인합니다.
- [지급명세서 조회](docs/products/%EC%A7%80%EA%B8%89%EB%AA%85%EC%84%B8%EC%84%9C-%EC%A1%B0%ED%9A%8C.md) — 홈택스에 제출된 지급명세서를 소득 종류와 제출 연월로 좁혀 조회합니다.
- [체납 연체 납부 내역 조회](docs/products/%EC%B2%B4%EB%82%A9-%EC%97%B0%EC%B2%B4-%EB%82%A9%EB%B6%80-%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 납부기한을 넘긴 세금이 어느 세목에 얼마나 남아 있는지 봅니다.
- [폐업사실증명서 발급(신청)](docs/products/%ED%8F%90%EC%97%85%EC%82%AC%EC%8B%A4%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%8B%A0%EC%B2%AD.md) — 폐업 신고를 마친 사업자의 폐업사실증명서를 홈택스에 신청하고 증명서 ID를 받습니다.
- [표준재무제표증명원 발급(신청)](docs/products/%ED%91%9C%EC%A4%80%EC%9E%AC%EB%AC%B4%EC%A0%9C%ED%91%9C%EC%A6%9D%EB%AA%85%EC%9B%90-%EC%8B%A0%EC%B2%AD.md) — 은행 여신이나 투자 심사에서 요구하는 표준재무제표증명원을 필요한 연도로 정해 홈택스에 신청합니다.
- [현금영수증 개별 발급](docs/products/%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%B0%9C%ED%96%89.md) — 현금으로 결제한 고객의 현금영수증을 휴대전화 번호나 사업자등록번호로 발급합니다.
- [현금영수증 당일발행 내역 조회](docs/products/%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%8B%B9%EC%9D%BC%EB%B0%9C%ED%96%89-%EB%82%B4%EC%97%AD-%EC%A1%B0%ED%9A%8C.md) — 오늘 발급된 현금영수증이 몇 건이고 각각 얼마인지 영업 중에 바로 확인합니다.
- [현금영수증 당일발행 수정](docs/products/%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%8B%B9%EC%9D%BC%EB%B0%9C%ED%96%89-%EC%88%98%EC%A0%95.md) — 결제 금액을 잘못 입력해 나간 현금영수증을 취소하지 않고 바로잡습니다.
- [현금영수증 당일발행 취소](docs/products/%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%8B%B9%EC%9D%BC%EB%B0%9C%ED%96%89-%EC%B7%A8%EC%86%8C.md) — 고객이 결제를 취소했거나 잘못 발급한 현금영수증을 발급한 같은 날 안에 취소합니다.
- [현금영수증 매입 내역 조회](docs/products/%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EC%82%AC%EC%97%85%EC%9A%A9-%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C-%EB%A7%A4%EC%9E%85%EC%84%B8%EC%95%A1-%EA%B3%B5%EC%A0%9C-%ED%99%95%EC%9D%B8-%EB%B3%80%EA%B2%BD-%EC%A1%B0%ED%9A%8C.md) — 직원들이 현금으로 쓴 비용이 어디에 얼마나 잡혔는지 기간별로 받아옵니다.
- [현금영수증 매출 내역 조회](docs/products/%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%A7%A4%EC%B6%9C%EB%82%B4%EC%97%AD.md) — 가게에서 나간 현금영수증 매출을 기간별로 모아 봅니다.
- [현금영수증 매출 누계 조회](docs/products/%ED%98%84%EA%B8%88%EC%98%81%EC%88%98%EC%A6%9D-%EB%A7%A4%EC%B6%9C%EB%82%B4%EC%97%AD%EB%88%84%EA%B3%84.md) — 건별 목록을 모두 받지 않고도 한 해나 분기의 현금영수증 매출 총액을 확인합니다.
- [홈택스 거래처 목록 조회](docs/products/%EC%A0%84%EC%9E%90%EC%84%B8%EA%B8%88%EA%B3%84%EC%82%B0%EC%84%9C-%EA%B1%B0%EB%9E%98%EC%B2%98-%EA%B4%80%EB%A6%AC.md) — 홈택스에 등록해 둔 전자세금계산서 거래처를 등록번호나 상호, 대표자명으로 찾습니다.
- [환급세액 조회(정기 신고)](docs/products/%ED%99%98%EA%B8%89%EC%84%B8%EC%95%A1-%EC%A1%B0%ED%9A%8C-%EC%A0%95%EA%B8%B0%EC%8B%A0%EA%B3%A0.md) — 신고 뒤 결정된 국세 환급금이 실제로 지급됐는지 건별로 확인합니다.
- [휴업사실증명서 발급(신청)](docs/products/%ED%9C%B4%EC%97%85%EC%82%AC%EC%8B%A4%EC%A6%9D%EB%AA%85%EC%84%9C-%EC%8B%A0%EC%B2%AD.md) — 휴업 신고를 마친 사업자의 휴업사실증명서를 기관에 신청하고 증명서 ID를 받습니다.

#### 화면 단계

아래 항목은 업무 과정의 중간 단계입니다.

- [원천세 기한후신고 초안 초기화](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EA%B8%B0%ED%95%9C%ED%9B%84%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%84%B1%EC%8B%9C%EC%9E%91.md) — 기한을 넘긴 달의 귀속연월과 지급연월, 제출연월을 정해 원천세 기한후신고 작성을 시작합니다.
- [원천세 수정신고 초안 초기화](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%88%98%EC%A0%95%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%84%B1%EC%8B%9C%EC%9E%91.md) — 마감된 원천세 신고의 수정신고를 처음 작성하거나 이미 제출한 수정신고를 다시 고칠 수 있게 수정신고 초안을 엽니다.
- [원천세 전자파일 변환신고 작업 시작](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%84%EC%9E%90%ED%8C%8C%EC%9D%BC-%EB%B3%80%ED%99%98%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%97%85-%EC%8B%9C%EC%9E%91.md) — 정기, 수정, 기한후 중 신고 구분을 정해 원천세 전자파일 변환신고 작업을 시작합니다.
- [원천세 정기신고 초안 초기화](docs/products/%EC%9B%90%EC%B2%9C%EC%84%B8-%EC%A0%95%EA%B8%B0%EC%8B%A0%EA%B3%A0-%EC%9E%91%EC%84%B1%EC%8B%9C%EC%9E%91.md) — 이번 달 원천세 정기신고서를 새로 엽니다.

### Google 마케팅

- [검색 광고 성과 조회](docs/products/google-ads-search-report.md) — 광고 계정과 기간, 지표를 넣으면 검색 캠페인의 노출과 클릭 같은 성과를 행으로 받습니다.
- [검색 실적 조회](docs/products/google-search-performance.md) — 검색에서 얼마나 노출되고 눌렸는지, 어떤 검색어로 들어왔는지 받아 갑니다.
- [검색 캠페인 만들기](docs/products/google-ads-search-campaign-create.md) — 캠페인 이름과 일일 예산, 연결 페이지, 광고 제목과 설명, 키워드를 넣으면 일시정지 상태의 검색 캠페인을 만듭니다.
- [검색 캠페인 수정](docs/products/google-ads-search-campaign-update.md) — 캠페인 번호와 바꿀 이름이나 운영 상태, 일일 예산을 넣으면 그 검색 캠페인을 고칩니다.
- [광고 네 채널 합본 성과 조회](docs/products/google-ads-channels-report.md) — 광고 계정과 기간, 지표를 정하면 검색, 디스플레이, Performance Max, Demand Gen 네 유형의 성과를 함께 받습니다.
- [동영상 광고 성과 조회](docs/products/google-ads-video-report.md) — 광고 계정과 기간, 받을 지표를 정하면 동영상 캠페인의 노출과 조회수, 조회율을 행으로 돌려줍니다.
- [디스플레이 광고 성과 조회](docs/products/google-ads-display-report.md) — 광고 계정과 기간, 받을 지표를 정하면 디스플레이 캠페인의 노출과 클릭, 클릭률을 행으로 돌려줍니다.
- [디스플레이 캠페인 만들기](docs/products/google-ads-display-campaign-create.md) — 이름과 예산, 연결 페이지, 광고 문구, 먼저 올린 이미지 번호를 넣으면 멈춘 상태의 디스플레이 캠페인을 만듭니다.
- [디스플레이 캠페인 수정](docs/products/google-ads-display-campaign-update.md) — 디스플레이 캠페인 번호와 바꿀 값을 넣으면 이름이나 운영 상태, 하루 예산을 고칩니다.
- [버전 게시](docs/products/google-tag-manager-version-publish.md) — 작업공간 경로나 버전 경로 가운데 하나를 넣으면 그 내용을 실제 사이트에 게시합니다.
- [사이트 제거](docs/products/google-search-console-site-remove.md) — 사이트 주소를 넣으면 연결한 계정의 사이트 목록에서 그 사이트를 뺍니다.
- [사이트 추가](docs/products/google-search-console-site-add.md) — 사이트 주소를 넣으면 연결한 계정의 사이트 목록에 그 사이트를 더합니다.
- [사이트맵 목록 조회](docs/products/google-search-console-sitemap-list.md) — 사이트 주소를 넣으면 그 사이트에 제출된 사이트맵 목록을 받습니다.
- [사이트맵 삭제](docs/products/google-search-console-sitemap-delete.md) — 사이트 주소와 사이트맵 주소를 넣으면 그 사이트맵을 목록에서 뺍니다.
- [사이트맵 제출](docs/products/google-search-console-sitemap-submit.md) — 사이트 주소와 사이트맵 주소를 넣으면 그 사이트맵을 연결한 사이트에 제출합니다.
- [색인 상태 조회](docs/products/google-index-status.md) — 페이지 하나가 검색에 등록돼 있는지, 막혀 있다면 무엇이 막는지 알려 줍니다.
- [속성 만들기](docs/products/google-analytics-measurement-create.md) — 애널리틱스 계정 번호와 속성 이름, 시간대를 넣으면 그 계정 아래에 새 속성을 만듭니다.
- [속성 설정 수정](docs/products/google-analytics-measurement-update.md) — 속성 번호와 바꿀 설정을 넣으면 보낸 설정만 고치고 나머지는 그대로 둡니다.
- [썸네일 설정](docs/products/google-youtube-video-thumbnail-set.md) — 영상 번호와 먼저 올린 썸네일 이미지 번호를 넣으면 그 영상의 맞춤 썸네일을 바꿉니다.
- [영상 자산 연결](docs/products/google-ads-video-asset-create.md) — 영상 주소를 넣으면 그 영상을 광고 계정의 영상 자산으로 연결합니다.
- [영상 정보 수정](docs/products/google-youtube-video-update.md) — 영상 번호와 바꿀 항목을 넣으면 제목이나 설명, 태그, 카테고리, 공개 범위 같은 영상 정보를 고칩니다.
- [예약 보고 만들기](docs/products/google-youtube-report-job-create.md) — 보고 유형을 넣으면 그 보고서를 매일 만드는 정기 작업을 채널에 겁니다.
- [예약 보고 목록 조회](docs/products/google-youtube-report-job-read.md) — 작업 번호 없이 부르면 걸려 있는 정기 보고 작업 목록을, 번호를 넣으면 그 작업이 만든 보고서 목록을 받습니다.
- [웹사이트 성과 조회](docs/products/google-analytics-report.md) — 고른 기간의 방문과 이용 지표를 표로 받아 갑니다.
- [자막 추가](docs/products/google-youtube-video-caption-add.md) — 영상 번호와 먼저 올린 자막 파일 번호, 언어, 트랙 이름을 넣으면 그 영상에 자막 트랙을 더합니다.
- [재생목록 만들기](docs/products/google-youtube-playlist-create.md) — 채널과 재생목록 이름을 넣으면 그 채널에 새 재생목록을 만듭니다.
- [재생목록 목록 조회](docs/products/google-youtube-playlist-list.md) — 채널 번호를 넣으면 그 채널의 재생목록 목록을 받습니다.
- [재생목록에 영상 넣기](docs/products/google-youtube-playlist-item-add.md) — 채널과 재생목록 번호, 영상 번호를 넣으면 그 영상을 재생목록에 더합니다.
- [채널 성과 조회](docs/products/google-youtube-analytics-report.md) — 채널과 기간, 지표를 정하면 조회수와 시청 시간, 구독자 같은 채널 지표를 행으로 받습니다.
- [채널 영상 목록 조회](docs/products/google-youtube-video-list.md) — 채널 번호를 넣으면 그 채널에 올린 영상 목록을 받습니다.
- [태그 만들기](docs/products/google-tag-manager-tag-create.md) — 컨테이너와 작업공간, 태그 이름과 유형을 넣으면 그 작업공간에 태그를 만듭니다.
- [태그 설정 점검](docs/products/google-tag-manager-tag-audit.md) — 컨테이너 경로를 넣으면 게시된 태그가 모두 일시정지돼 있는지, 발동 트리거가 없어 동작하지 않는 태그가 있는지 점검합니다.
- [태그 수정](docs/products/google-tag-manager-tag-update.md) — 태그 경로와 바꿀 항목을 넣으면 그 태그를 고치고 보내지 않은 항목은 현재 값으로 남깁니다.
- [Demand Gen 광고 성과 조회](docs/products/google-ads-demand-gen-report.md) — 광고 계정과 기간, 지표를 정하면 Demand Gen 캠페인의 노출과 클릭 같은 성과를 행으로 받습니다.
- [Demand Gen 캠페인 만들기](docs/products/google-ads-demand-gen-campaign-create.md) — 이름과 예산, 연결 페이지, 제목과 설명, 이미지와 로고 번호를 넣으면 멈춘 상태의 Demand Gen 캠페인을 만듭니다.
- [Demand Gen 캠페인 수정](docs/products/google-ads-demand-gen-campaign-update.md) — Demand Gen 캠페인 번호와 바꿀 값을 넣으면 이름이나 운영 상태, 하루 예산을 고칩니다.
- [Google 연동 상태 조회](docs/products/google-account-status.md) — 연결한 Google 계정으로 지금 무엇을 조회할 수 있는지 확인합니다.
- [Google 측정 설정 진단](docs/products/google-analytics-measurement-audit.md) — 연결한 계정의 측정 설정에서 데이터 수집 경로와 주요 이벤트가 빠졌거나 지정되지 않은 자리를 목록으로 알려 줍니다.
- [Performance Max 광고 성과 조회](docs/products/google-ads-pmax-report.md) — 광고 계정과 기간, 지표를 정하면 Performance Max 캠페인의 성과를 행으로 받습니다.
- [Performance Max 캠페인 만들기](docs/products/google-ads-pmax-campaign-create.md) — 이름과 예산, 연결 페이지, 제목과 설명, 이미지와 로고 번호를 넣으면 멈춘 상태의 Performance Max 캠페인을 만듭니다.
- [Performance Max 캠페인 수정](docs/products/google-ads-pmax-campaign-update.md) — Performance Max 캠페인 번호와 바꿀 이름, 운영 상태, 하루 예산을 넣으면 그 캠페인을 고칩니다.

### IBK기업은행 빠른조회

- [IBK기업은행 빠른조회 계좌 잔액 요약 조회](docs/products/ibk-fast-account-accounts-quick-summary-get.md) — IBK기업은행 계좌의 예금주와 원장잔액, 최근 일자별 입금과 출금 요약을 한 번에 받습니다.

### KB국민은행 빠른조회

- [KB국민은행 빠른조회 거래내역 조회](docs/products/kb-fast-account-accounts-transaction-history-search.md) — KB국민은행 계좌의 거래내역을 기간으로 조회하고, 건마다 거래 상대방이 붙어 어디서 들어온 돈인지 확인합니다.

### KB국민카드 기업카드

- [KB국민카드 기업카드 결제내역 전체 수집](docs/products/kb-biz-card-payments-result.md) — 법인카드 결제 자료를 구간별로 나눠 부르지 않고 조건에 걸린 것을 한 번에 받습니다.
- [KB국민카드 기업카드 결제내역 조건 조회](docs/products/kb-biz-card-payments-search.md) — 법인카드 대금이 언제 얼마 청구됐고 결제됐는지 기간을 정해 한 페이지씩 받습니다.
- [KB국민카드 기업카드 결제내역 페이지 조회](docs/products/kb-biz-card-payments-page.md) — 이미 정해 둔 법인카드 결제내역 조회 조건에서 볼 페이지를 지정해 그 구간만 받아옵니다.
- [KB국민카드 기업카드 매입내역 전체 수집](docs/products/kb-biz-card-purchases-result.md) — 매입일이 지정한 기간 안에 드는 법인카드 매입 확정 건을 페이지를 넘겨 가며 받지 않고 전부 모아 한 번에 돌려받습니다.
- [KB국민카드 기업카드 매입내역 조건 조회](docs/products/kb-biz-card-purchases-search.md) — 카드사가 법인카드의 가맹점 매입을 확정한 건 가운데 매입일이 지정한 기간에 드는 건을 한 페이지(최대 열 건)씩 받아옵니다.
- [KB국민카드 기업카드 매입내역 페이지 조회](docs/products/kb-biz-card-purchases-page.md) — 정해 둔 법인카드 매입 조회 조건에서 몇 번째 페이지를 볼지 지정해 그 페이지의 매입 확정 건만 받습니다.
- [KB국민카드 기업카드 부서 목록 조회](docs/products/kb-biz-card-common-departments-select.md) — KB국민카드 기업카드에 등록된 부서를 부서번호와 부서명, 사용 상태까지 받아옵니다.
- [KB국민카드 기업카드 승인내역 전체 수집](docs/products/kb-biz-card-approvals-result.md) — 페이지를 하나씩 넘겨 가며 받는 대신, 조건에 걸린 법인카드 승인 건을 전부 모아 한 번에 돌려받습니다.
- [KB국민카드 기업카드 승인내역 조건 조회](docs/products/kb-biz-card-approvals-search.md) — 기간을 정해 법인카드 승인이 일어난 건별 기록을 한 페이지(최대 열 건)씩 조회합니다.
- [KB국민카드 기업카드 승인내역 페이지 조회](docs/products/kb-biz-card-approvals-page.md) — 정해 둔 조회 조건에서 몇 번째 페이지를 볼지 지정해 그 페이지만 받습니다.
- [KB국민카드 기업카드 카드 목록 조회](docs/products/kb-biz-card-common-cards-select.md) — 회사에 발급된 법인카드를 부서별로 받아, 어느 임직원에게 나간 카드인지 확인합니다.

#### 화면 단계

아래 항목은 업무 과정의 중간 단계입니다.

- [KB국민카드 기업카드 결제내역 조회 시작](docs/products/kb-biz-card-payments-init.md) — 법인카드 결제내역을 조회하기 전에 카드사에 등록된 부서 목록과 부서별 사용 상태를 받아옵니다.
- [KB국민카드 기업카드 매입내역 조회 시작](docs/products/kb-biz-card-purchases-init.md) — 카드사가 법인카드의 가맹점 매입을 확정한 기록을 조회하기 전에, 등록된 부서 목록과 첫 번째 부서의 카드 목록을 받아옵니다.
- [KB국민카드 기업카드 승인내역 조회 시작](docs/products/kb-biz-card-approvals-init.md) — 법인카드 승인내역을 조회하기 전에 회사에 등록된 부서 목록과 첫 번째 부서의 카드 목록을 받아옵니다.

### NH농협은행 빠른조회

- [NH농협은행 빠른조회 거래내역 조회](docs/products/nh-fast-account-transaction-history-search.md) — 시작일과 종료일을 정해 NH농협은행 계좌의 거래내역을 받습니다.
- [NH농협은행 빠른조회 계좌 목록 조회](docs/products/nh-fast-account-accounts-list.md) — NH농협은행에 등록한 조회 계좌 연동을 한 번에 나열합니다.
- [NH농협은행 빠른조회 잔액 조회](docs/products/nh-fast-account-balance-query.md) — 등록한 NH농협은행 계좌 하나의 현재 잔액과 출금 가능 금액을 받습니다.

### XBOSS 마케팅 분석

- [광고 개선 제안](docs/products/marketing-optimization-suggest.md) — 키워드와 검색어, 소재, 입찰의 성과 숫자와 직접 정한 기준을 넣으면 손볼 후보를 근거 숫자와 함께 골라 드립니다.
- [광고 매출 연결 계산](docs/products/marketing-lead-to-revenue-reconcile.md) — 광고비와 같은 기간의 매출, 신규 유료 고객 수를 넣으면 ROAS와 고객 획득 비용을 계산해 돌려줍니다.
- [마케팅 보고 보관](docs/products/marketing-report-archive-save.md) — 만들어 둔 마케팅 성과 보고를 기간과 채널 정보와 함께 보관합니다.
- [마케팅 성과 보고](docs/products/marketing-growth-review.md) — 보고 기간과 채널별 광고비를 넣으면 통화별 광고비 합계와 ROAS, 고객 획득 비용 CAC, 목표 달성률을 한 번에 계산합니다.
- [보관한 마케팅 보고 찾기](docs/products/marketing-report-archive-list.md) — 보관해 둔 마케팅 성과 보고를 기간과 채널로 골라 최근 기간부터 돌려줍니다.
