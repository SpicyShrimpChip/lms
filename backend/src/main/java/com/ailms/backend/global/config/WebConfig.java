package com.ailms.backend.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 개발 중에는 프론트 개발 서버(5173)가 /api를 8080으로 넘겨 주고, 배포 때는 Vercel이 같은 일을 해서
 * 브라우저 입장에서 같은 출처다. 그래서 CORS는 프론트를 다른 도메인에서 직접 호출할 때만 필요하다.
 * 허용 출처는 설정값(app.cors.allowed-origins)으로 관리한다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final String[] allowedOrigins;

	public WebConfig(@Value("${app.cors.allowed-origins}") String[] allowedOrigins) {
		this.allowedOrigins = allowedOrigins;
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
				.allowedOrigins(allowedOrigins)
				.allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE")
				.allowCredentials(true);
	}
}
