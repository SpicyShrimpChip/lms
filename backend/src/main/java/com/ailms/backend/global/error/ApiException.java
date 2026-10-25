package com.ailms.backend.global.error;

import org.springframework.http.HttpStatus;

/**
 * 서비스 계층에서 던지는 오류. status는 HTTP 상태 코드, message는 사용자에게 보여 줄 문구다.
 * 예: throw new ApiException(HttpStatus.CONFLICT, "이 학기에 같은 이름의 과목이 이미 있어요.");
 */
public class ApiException extends RuntimeException {

	private final HttpStatus status;

	public ApiException(HttpStatus status, String message) {
		super(message);
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}
}
