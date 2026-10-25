package com.ailms.backend.domain.user.application;

import com.ailms.backend.domain.user.dao.UserRepository;
import com.ailms.backend.domain.user.dto.UserResponse;
import com.ailms.backend.global.error.BusinessException;
import com.ailms.backend.global.security.ApiErrorResponder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	private final UserRepository userRepository;

	public UserResponse getMe(Long userId) {
		return userRepository.findById(userId)
				.map(UserResponse::from)
				// 토큰은 유효하지만 계정이 사라진 경우 (탈퇴 직후 등)
				.orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, ApiErrorResponder.UNAUTHORIZED_MESSAGE));
	}
}
