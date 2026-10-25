package com.ailms.backend.domain.notice.dao;

import com.ailms.backend.domain.notice.entity.Notice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

	// 최신 공지가 위로. 날짜가 같으면 나중에 쓴 글이 위로
	List<Notice> findAllByOrderByCreatedAtDescIdDesc();
}
