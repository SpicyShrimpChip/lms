package com.ailms.backend.global.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	// TODO(백엔드): 인증을 만들면서 아래를 바꾼다. docs/frontend-requests.md의 "인증·마이페이지" 참고.
	//  - JWT access token 검사 필터를 추가한다 (토큰: Authorization 헤더, refresh: HttpOnly 쿠키)
	//  - /api/auth/** 와 공지 목록(GET /api/notices), Swagger만 열어 두고 나머지는 로그인 필수로 바꾼다
	//  - 지금은 프론트와 API를 먼저 연결해 볼 수 있도록 전부 열어 두었다. 이 상태로 배포하면 안 된다.
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.cors(Customizer.withDefaults())
				// refresh 토큰을 쿠키로 쓰게 되면 CSRF 대책(SameSite 설정 등)을 같이 정한다
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
		return http.build();
	}

	// 비밀번호는 BCrypt로 해시한다. 평문 저장·로그 출력 금지.
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
