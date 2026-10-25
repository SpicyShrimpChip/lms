package com.ailms.backend.domain.notice.application;

import com.ailms.backend.domain.notice.dao.NoticeRepository;
import com.ailms.backend.domain.notice.dto.NoticeResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

	private final NoticeRepository noticeRepository;

	public List<NoticeResponse> getNotices() {
		return noticeRepository.findAllByOrderByCreatedAtDescIdDesc().stream()
				.map(NoticeResponse::from)
				.toList();
	}
}
