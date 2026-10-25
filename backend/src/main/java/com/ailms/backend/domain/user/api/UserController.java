package com.ailms.backend.domain.user.api;

import com.ailms.backend.domain.user.application.UserService;
import com.ailms.backend.domain.user.dto.UserResponse;
import com.ailms.backend.global.common.ApiResponse;
import com.ailms.backend.global.security.AuthUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "회원")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@Operation(summary = "내 정보", description = "로그인한 사용자 본인의 정보만 돌려준다.")
	@GetMapping("/me")
	public ApiResponse<UserResponse> getMe(@AuthenticationPrincipal AuthUser authUser) {
		return ApiResponse.success(userService.getMe(authUser.userId()));
	}
}
