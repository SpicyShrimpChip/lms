package com.ailms.backend.domain.auth.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 회원가입 요청 (frontend/src/types/auth.ts의 SignupInput과 같은 모양).
 * 비밀번호 규칙은 AuthService에서 PasswordPolicy로 따로 검사한다.
 * 동의 항목은 boolean이라 빠지면 false가 되어 필수 동의 검사에 걸린다.
 */
public record SignupRequest(
		@NotBlank(message = "이메일을 입력해 주세요.")
		@Size(max = 254, message = "이메일이 너무 길어요.")
		@Email(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", message = "이메일 형식을 확인해 주세요. (예: name@example.com)")
		String email,

		@NotBlank(message = "이름을 입력해 주세요.")
		@Size(max = 30, message = "이름은 30자까지 입력할 수 있어요.")
		String name,

		@NotBlank(message = "비밀번호를 입력해 주세요.")
		String password,

		@NotBlank(message = "비밀번호 확인을 입력해 주세요.")
		String passwordConfirm,

		@AssertTrue(message = "서비스 이용약관에 동의해 주세요.")
		boolean agreedTerms,

		@AssertTrue(message = "개인정보 수집·이용에 동의해 주세요.")
		boolean agreedPrivacy,

		// 선택 동의. 동의하지 않아도 자료로 공부할 수 있다
		boolean agreedAiAnalysis) {
}
