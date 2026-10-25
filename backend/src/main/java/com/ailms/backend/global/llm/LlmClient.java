package com.ailms.backend.global.llm;

/**
 * LLM 호출 창구. 제공사·모델 수가 정해지지 않았으므로 서비스 코드는 이 인터페이스만 쓴다.
 * 구현체는 설정(app.llm.provider)으로 고르고, 키가 없으면 MockLlmClient로 동작한다.
 */
// TODO(미결): LLM 제공사와 모델 수. GPT·Gemini·Claude 3개가 독립 판단한 뒤 통합하는 구상은 핵심 차별점이므로
//  단일 모델로 시작하더라도 구현체를 여러 개 붙여 결과를 비교·통합할 수 있는 구조를 유지한다.
// TODO(백엔드): 실제 제공사 구현체를 추가한다. API 키는 환경변수로만 읽고, 자료·대화를 보낼 때는
//  학습에 쓰지 않는 API 설정을 쓴다(루트 CLAUDE.md의 학습 자료 저작권 원칙).
public interface LlmClient {

	/** 프롬프트를 보내고 답변 글을 받는다. */
	String complete(String prompt);
}
