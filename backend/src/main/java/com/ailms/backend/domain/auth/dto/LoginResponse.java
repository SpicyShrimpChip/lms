package com.ailms.backend.domain.auth.dto;

import com.ailms.backend.domain.user.dto.UserResponse;

// Refresh Token은 본문에 넣지 않고 HttpOnly 쿠키로만 보낸다
public record LoginResponse(String accessToken, UserResponse user) {
}
