// TODO(미결): 자료 지원 형식은 백엔드 자료 파싱 범위에 맞춰 확정 (프론트 안: PDF·PPTX·HWP·HWPX)
export const MATERIAL_EXTENSIONS = ['pdf', 'txt', 'md'] as const;

// TODO(미결): 최대 크기는 백엔드와 정해서 맞춘다
export const MATERIAL_MAX_SIZE_MB = 20;

export const MATERIAL_TITLE_MAX_LENGTH = 60;
