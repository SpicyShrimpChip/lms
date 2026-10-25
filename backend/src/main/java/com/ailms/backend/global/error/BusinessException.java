package com.ailms.backend.global.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 업무 규칙 위반을 알리는 예외. message는 응답에 그대로 실리므로 사용자용 문구로 쓴다.
 * 예: new BusinessException(HttpStatus.CONFLICT, "이 학기에 같은 이름의 과목이 이미 있어요.")
 */
@Getter
public class BusinessException extends RuntimeException {

	private final HttpStatus status;

	public BusinessException(HttpStatus status, String message) {
		super(message);
		this.status = status;
	}
}
