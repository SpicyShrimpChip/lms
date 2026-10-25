package com.ailms.backend.domain.notice;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class NoticeControllerTest {

	@Autowired
	MockMvc mockMvc;

	@Test
	void 공지_목록은_공통_응답_형식으로_최신순이다() throws Exception {
		mockMvc.perform(get("/api/notices"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.message").value(""))
				.andExpect(jsonPath("$.data.length()").value(3))
				.andExpect(jsonPath("$.data[0].title").value("AI 대화 가져오기 기능을 준비하고 있어요"))
				.andExpect(jsonPath("$.data[0].createdAt").value("2026-10-24"))
				.andExpect(jsonPath("$.data[2].title").value("서비스를 시작했어요"));
	}

	@Test
	void 없는_주소는_공통_오류_형식의_404다() throws Exception {
		mockMvc.perform(get("/api/does-not-exist"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.success").value(false))
				.andExpect(jsonPath("$.message").value("요청한 주소를 찾을 수 없어요."));
	}
}
