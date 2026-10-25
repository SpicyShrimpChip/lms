package com.ailms.backend.domain.auth.dao;

import com.ailms.backend.domain.auth.entity.RefreshToken;
import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByTokenHash(String tokenHash);

	// 같은 토큰으로 동시에 갱신해도 한 번만 회전되도록 행을 잠근다
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select t from RefreshToken t where t.tokenHash = :tokenHash")
	Optional<RefreshToken> findByTokenHashForUpdate(String tokenHash);

	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("update RefreshToken t set t.revokedAt = :now where t.sessionId = :sessionId and t.revokedAt is null")
	int revokeSession(String sessionId, LocalDateTime now);

	boolean existsBySessionIdAndRevokedAtIsNullAndExpiresAtAfter(String sessionId, LocalDateTime now);
}
