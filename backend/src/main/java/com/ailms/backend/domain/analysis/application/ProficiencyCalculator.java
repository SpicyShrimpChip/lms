package com.ailms.backend.domain.analysis.application;

import java.util.List;

/**
 * 개념별 숙련도 점수(0~100)를 계산한다. 점수는 LLM이 아니라 이 코드가 명시적 규칙으로 계산하고,
 * LLM은 그 근거를 설명만 한다(루트 CLAUDE.md의 판단 근거 투명성 원칙).
 */
// TODO(미결): 점수 산식. 대화 분류 결과(이해 못 함 / 재설명 요청 / 스스로 활용)와 퀴즈 정답률의 가중치를
//  설정값(예: app.proficiency.weights.*)으로 빼서 정한다.
// TODO(백엔드): 구현 클래스와 단위 테스트를 만든다. 입력은 아래 Signal 목록, 출력은 점수와 사용한 근거다.
//  docs/frontend-requests.md의 ConceptMastery(score, level, evidence)와 모양을 맞춘다.
public interface ProficiencyCalculator {

	int calculate(List<Signal> signals);

	/** 한 개념에 대한 근거 하나. docs/frontend-requests.md의 Evidence.signal과 같은 값이다. */
	enum Signal {
		NOT_UNDERSTOOD,
		ASKED_AGAIN,
		APPLIED,
		QUIZ_CORRECT,
		QUIZ_WRONG
	}
}
