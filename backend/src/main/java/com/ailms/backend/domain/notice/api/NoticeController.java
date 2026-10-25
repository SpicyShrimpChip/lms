package com.ailms.backend.domain.notice.api;

import com.ailms.backend.domain.notice.application.NoticeService;
import com.ailms.backend.domain.notice.dto.NoticeResponse;
import com.ailms.backend.global.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

	private final NoticeService noticeService;

	public NoticeController(NoticeService noticeService) {
		this.noticeService = noticeService;
	}

	@GetMapping
	public ApiResponse<List<NoticeResponse>> list() {
		return ApiResponse.ok(noticeService.findAll());
	}
}
