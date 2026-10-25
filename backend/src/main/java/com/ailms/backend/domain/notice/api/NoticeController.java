package com.ailms.backend.domain.notice.api;

import com.ailms.backend.domain.notice.application.NoticeService;
import com.ailms.backend.domain.notice.dto.NoticeResponse;
import com.ailms.backend.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "공지사항")
@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

	private final NoticeService noticeService;

	@Operation(summary = "공지 목록", description = "최신 공지가 위로 온다 (작성일 내림차순, 같으면 id 큰 순).")
	@GetMapping
	public ApiResponse<List<NoticeResponse>> getNotices() {
		return ApiResponse.success(noticeService.getNotices());
	}
}
