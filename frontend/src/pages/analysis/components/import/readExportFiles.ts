import {
  mergeParseResults,
  parseConversationExport,
  type FileParseResult,
  type MergedImport,
} from '@/utils';
import { readExportZip } from '@/utils/conversation/archive';

// 고른 파일들을 브라우저 안에서만 읽는다. 서버로는 아무것도 보내지 않는다.
// zip은 압축을 풀지 않고 올려도 되고, 안에서 대화 기록 파일만 꺼내 읽는다
// TODO: 파일이 수십 MB를 넘으면 화면이 잠깐 멈출 수 있다. 실제 파일로 확인한 뒤 필요하면 Web Worker로 옮긴다
export async function readExportFiles(files: File[]): Promise<MergedImport> {
  const results: FileParseResult[] = [];
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.zip')) {
      const zip = await readExportZip(new Uint8Array(await file.arrayBuffer()));
      if (!zip.ok) {
        results.push({ fileName: file.name, result: zip });
        continue;
      }
      for (const entry of zip.files) {
        results.push({
          fileName: file.name,
          result: parseConversationExport(entry.name, entry.text),
        });
      }
      continue;
    }
    results.push({
      fileName: file.name,
      result: parseConversationExport(file.name, await file.text()),
    });
  }
  return mergeParseResults(results);
}
