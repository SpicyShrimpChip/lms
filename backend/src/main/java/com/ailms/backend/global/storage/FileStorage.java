package com.ailms.backend.global.storage;

import java.io.IOException;
import java.io.InputStream;

/**
 * 업로드 파일 저장 창구. 로컬 폴더 구현과 S3 구현을 갈아 끼울 수 있게 인터페이스로 둔다.
 */
// TODO(미결): 업로드한 학습 자료 원본을 보관할지(처리 후 삭제하고 추출한 텍스트·개념만 남기는 안을 검토 중)
// TODO(미결): AWS 세부 서비스(S3 등). 정해지기 전까지는 LocalFileStorage만 쓴다.
public interface FileStorage {

	/** 파일을 저장하고, 나중에 꺼낼 때 쓰는 키를 돌려준다. */
	String save(String originalFilename, InputStream content) throws IOException;

	InputStream load(String key) throws IOException;

	void delete(String key) throws IOException;
}
