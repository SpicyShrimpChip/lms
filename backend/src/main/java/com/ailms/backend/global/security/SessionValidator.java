package com.ailms.backend.global.security;

/**
 * Access Token에 담긴 로그인 세션이 아직 살아 있는지 확인한다 (로그아웃·재사용 감지로 폐기된 세션의 토큰을 바로 막기 위해).
 * 구현은 domain/auth에 있다.
 */
public interface SessionValidator {

	boolean isActive(String sessionId);
}
