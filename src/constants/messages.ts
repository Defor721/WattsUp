/** 요청하는 메시지 */
export const VALIDATION_MESSAGES = {
  // 이메일
  EMAIL_REQUIRED: "이메일을 입력해주세요.",

  // 비밀번호
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  PASSWORD_CONFIRM_REQUIRED: "비밀번호 확인을 위해 다시 입력해주세요.",

  // 사업자 등록
  BUSINESS_NUMBER_REQUIRED: "사업자 번호 10자리 모두 입력해주셔야 합니다.",
  VALID_BUSINESS_NUMBER: "유효한 사업자 등록번호입니다.",
  INVALID_BUSINESS_NUMBER: "올바른 사업자 등록번호를 입력해주세요.",
  BUSINESS_NUMBER_TOOLTIP:
    "'-' 기호를 제외한 사업자 번호 10자리를 입력해주세요.",

  // 개업일자
  START_DATE_REQUIRED: "개업일자 8자리 모두 입력해주셔야 합니다.",
  START_DATE_TOOLTIP:
    "YYYYMMDD 포맷으로 개업일자 8자리를 입력해주세요. 예) 20000101",

  // 상호
  COMPANY_NAME_TOOLTIP:
    "주식회사인 경우 예: (주)회사명, 주식회사 회사명 으로 입력해주세요.",

  // 법인등록번호
  CORPORATE_NUMBER_TOOLTIP:
    "'-' 기호를 제외한 법인등록번호 13자리를 입력해주세요.",
  CORPORATE_NUMBER_REQUIRED: "법인등록번호 13자리 모두 입력해주셔야 합니다.",

  // 대표자 성명
  PRINCIPAL_NAME_TOOLTIP: "외국인 사업자의 경우에는 영문명 입력해주세요.",
};

export const VALIDATION_NUMERIC = {
  BUSINESS_NUMBER_LENGTH: 10,
  START_DATE_NUMBER_LENGTH: 8,
  COMPANY_NAME_MAX_LENGTH: 30,
  CORPORATE_NUMBER_LENGTH: 13,
  PRINCIPAL_NAME_MAX_LENGTH: 50,
  MAX_CHARGE_AMOUNT: 10000000,
  MIN_CHARGE_AMOUNT: 1000,
};

/** 회원가입, 로그인 관련 메시지 */
export const AUTH_MESSAGES = {
  LOGIN_ERROR: "로그인 중 오류가 발생했습니다.",
  EMAIL_REGISTERED_AS_NATIVE:
    "해당 이메일은 일반 회원가입된 계정입니다. 일반 로그인을 이용해 주세요.",
  SIGNUP_SUCCESS: "회원가입이 완료되었습니다.",
  ACCOUNT_DELETION_SUCCESS: "회원 탈퇴가 완료되었습니다.",
};

export const SYSTEM_MESSAGES = {
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
  ACTION_FAILED: "실패하였습니다. 아래의 실패 사유를 참고해주세요.",
};
