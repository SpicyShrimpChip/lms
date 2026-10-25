package com.ailms.backend.global.llm;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

/** 다른 구현체가 없을 때(키가 없을 때) 쓰는 가짜 구현체. 항상 같은 안내 문장을 돌려준다. */
@Component
@ConditionalOnMissingBean(value = LlmClient.class, ignored = MockLlmClient.class)
public class MockLlmClient implements LlmClient {

	@Override
	public String complete(String prompt) {
		return "(목업 응답) 실제 LLM이 연결되지 않아 준비된 문장을 보여 드려요.";
	}
}
