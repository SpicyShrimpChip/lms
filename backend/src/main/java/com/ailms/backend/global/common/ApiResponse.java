package com.ailms.backend.global.common;

/**
 * 모든 API의 공통 응답 형식: { success, message, data }
 * 프론트(frontend/src/types/api.ts의 ApiResponse)와 같은 모양이다.
 * 실패 때의 message는 사용자에게 그대로 보여 주므로 쉬운 한국어로 쓴다.
 */
public record ApiResponse<T>(boolean success, String message, T data) {

	public static <T> ApiResponse<T> ok(T data) {
		return new ApiResponse<>(true, "", data);
	}

	public static ApiResponse<Void> ok() {
		return new ApiResponse<>(true, "", null);
	}

	public static ApiResponse<Void> fail(String message) {
		return new ApiResponse<>(false, message, null);
	}
}
