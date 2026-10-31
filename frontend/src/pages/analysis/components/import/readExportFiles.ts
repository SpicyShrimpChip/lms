import {
  mergeParseResults,
  parseConversationExport,
  type FileParseResult,
  type MergedImport,
} from '@/utils';

const ZIP_MESSAGE =
  '압축 파일은 아직 바로 읽지 못해요. 압축을 풀고 안에 있는 conversations.json을 골라 주세요.';

// 고른 파일들을 브라우저 안에서만 읽는다. 서버로는 아무것도 보내지 않는다
// TODO: 파일이 수십 MB를 넘으면 화면이 잠깐 멈출 수 있다. 실제 파일로 확인한 뒤 필요하면 Web Worker로 옮긴다
export async function readExportFiles(files: File[]): Promise<MergedImport> {
  const results: FileParseResult[] = [];
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.zip')) {
      results.push({
        fileName: file.name,
        result: { ok: false, message: ZIP_MESSAGE },
      });
      continue;
    }
    results.push({
      fileName: file.name,
      result: parseConversationExport(file.name, await file.text()),
    });
  }
  return mergeParseResults(results);
}
