package com.ailms.backend.domain.user.dto;

import com.ailms.backend.domain.user.entity.Role;
import com.ailms.backend.domain.user.entity.User;

// frontend/src/types/auth.ts의 User와 같은 모양. 비밀번호 해시·토큰은 넣지 않는다.
// role은 화면에서 관리자 메뉴를 보일지 정하는 데만 쓴다 (권한은 서버가 매번 확인한다)
public record UserResponse(Long id, String email, String name, boolean aiAnalysisConsent, Role role) {

	public static UserResponse from(User user) {
		return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.isAiAnalysisConsent(),
				user.getRole());
	}
}
