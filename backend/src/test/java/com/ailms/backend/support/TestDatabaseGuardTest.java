package com.ailms.backend.support;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class TestDatabaseGuardTest {

	@ParameterizedTest
	@ValueSource(strings = {
			"jdbc:h2:mem:lms;MODE=MySQL",
			"jdbc:mysql://localhost:3306/ai_lms_test?characterEncoding=UTF-8",
			"jdbc:mysql://127.0.0.1:3306/ai_lms_test"
	})
	void H2_메모리_DB와_test_DB에서는_실행한다(String url) {
		assertThatCode(() -> TestDatabaseGuard.check(url)).doesNotThrowAnyException();
	}

	@ParameterizedTest
	@ValueSource(strings = {
			"jdbc:mysql://localhost:3306/ai_lms?characterEncoding=UTF-8",
			"jdbc:mysql://localhost:3306/ai_lms",
			"jdbc:mysql://localhost:3306/ai_lms_testing",
			"jdbc:mysql://localhost:3306/",
			""
	})
	void 서비스_DB나_알_수_없는_DB에서는_멈춘다(String url) {
		assertThatThrownBy(() -> TestDatabaseGuard.check(url))
				.isInstanceOf(IllegalStateException.class)
				.hasMessageContaining("_test로 끝나는 DB");
	}
}
