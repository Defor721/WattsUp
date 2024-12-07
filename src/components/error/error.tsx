"use client";

import React, { ReactNode } from "react";
import { toast } from "react-toastify";

/** interface : props, API응답의 데이터 타입 명확히 정의 */

/** ErrorBoundaryProps : ErrorBoundary라는 컴포넌트가 받을 수 있는 props의 타입을 지정한 인터페이스. */
/** children : ErrorBoundary 컴포넌트가 감싸고 있는 자식 컴포넌트 */
interface ErrorBoundaryProps {
  children: ReactNode;
}
/**ReactNode:React에서 렌더링 가능한 모든 타입을 포함.
예: JSX, 문자열, 숫자, 배열, null, undefined, 그리고 ReactElement. */

/** ErrorBoundaryState : ErrorBoundary 컴포넌트의 상태를 정의하는 인터페이스. */
interface ErrorBoundaryState {
  hasError: boolean;
}
/** true일 경우 : 에러가 발생했음을 나타내며 대체 UI를 렌더링 */

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // 에러 상태 업데이트
    return { hasError: true };
  }

  /** componentDidCatch 메서드 : ErrorBoundary 컴포넌트에서 에러를 잡아서 처리하는 역할 */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러를 콘솔에 로깅
    console.error("ErrorBoundary가 잡은 에러", error, errorInfo);

    // 사용자에게 알림 표시
    toast.error("에러가 났습니다. 다시 한 번 확인 부탁드림요 ㅋㅋ");
  }

  /** render() 메서드 : React 컴포넌트에서 UI를 렌더링하는 역할 */
  render() {
    if (this.state.hasError) {
      // 에러 발생 시 대체 UI 표시
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h1>에레가 발생했습니다.</h1>
          <p>분명히 확인하라고 했습니다 알겠쬬</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
