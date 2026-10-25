package com.ailms.backend.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI().info(new Info()
				.title("AI LMS API")
				.description("프론트가 기대하는 API는 docs/frontend-requests.md에 있다. 바뀌면 그 문서도 같이 고친다.")
				.version("v0"));
	}
}
