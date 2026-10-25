package com.ailms.backend.global.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** 서버 PC의 폴더(app.storage.local-dir)에 저장한다. 폴더는 .gitignore의 backend/uploads/. */
@Component
public class LocalFileStorage implements FileStorage {

	private final Path root;

	public LocalFileStorage(@Value("${app.storage.local-dir}") String dir) {
		this.root = Path.of(dir).toAbsolutePath().normalize();
	}

	@Override
	public String save(String originalFilename, InputStream content) throws IOException {
		Files.createDirectories(root);
		// 파일 이름은 사용자가 정한 값을 쓰지 않는다 (경로 조작 방지). 확장자만 남긴다.
		String key = UUID.randomUUID() + extensionOf(originalFilename);
		Files.copy(content, resolve(key), StandardCopyOption.REPLACE_EXISTING);
		return key;
	}

	@Override
	public InputStream load(String key) throws IOException {
		return Files.newInputStream(resolve(key));
	}

	@Override
	public void delete(String key) throws IOException {
		Files.deleteIfExists(resolve(key));
	}

	private Path resolve(String key) {
		Path path = root.resolve(key).normalize();
		if (!path.startsWith(root)) {
			throw new IllegalArgumentException("저장 폴더 밖의 경로예요.");
		}
		return path;
	}

	private static String extensionOf(String filename) {
		if (filename == null) return "";
		int dot = filename.lastIndexOf('.');
		if (dot < 0 || dot == filename.length() - 1) return "";
		String ext = filename.substring(dot).toLowerCase();
		return ext.matches("\\.[a-z0-9]{1,10}") ? ext : "";
	}
}
