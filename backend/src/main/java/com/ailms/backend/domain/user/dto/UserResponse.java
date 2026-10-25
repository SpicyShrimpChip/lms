package com.ailms.backend.domain.user.dto;

import com.ailms.backend.domain.user.entity.User;

// frontend/src/types/auth.ts의 User와 같은 모양. 비밀번호 해시·토큰은 넣지 않는다
public record UserResponse(Long id, String email, String name, boolean aiAnalysisConsent) {

	public static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.isAiAnalysisConsent());
	}
}
