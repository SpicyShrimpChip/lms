package com.ailms.backend.domain.notice.dto;

import com.ailms.backend.domain.notice.entity.Notice;
import java.time.LocalDate;

/** 프론트의 Notice 타입과 같은 모양: { id, title, createdAt("2026-10-24") } */
public record NoticeResponse(long id, String title, LocalDate createdAt) {

	public static NoticeResponse from(Notice notice) {
		return new NoticeResponse(notice.getId(), notice.getTitle(), notice.getCreatedAt());
	}
}
