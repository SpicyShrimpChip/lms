package com.ailms.backend.domain.notice.application;

import com.ailms.backend.domain.notice.dao.NoticeRepository;
import com.ailms.backend.domain.notice.dto.NoticeResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class NoticeService {

	private final NoticeRepository noticeRepository;

	public NoticeService(NoticeRepository noticeRepository) {
		this.noticeRepository = noticeRepository;
	}

	public List<NoticeResponse> findAll() {
		return noticeRepository.findAllByOrderByCreatedAtDescIdDesc().stream()
				.map(NoticeResponse::from)
				.toList();
	}

	// TODO(백엔드): 공지 상세(GET /api/notices/{id})는 본문 필드가 정해지면 추가한다 (docs/frontend-requests.md 참고).
	//  없는 id는 throw new ApiException(HttpStatus.NOT_FOUND, "공지사항을 찾을 수 없어요.")
}
