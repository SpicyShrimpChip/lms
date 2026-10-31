import { describe, expect, it } from 'vitest';
import { readClaudeManifest, safeClaudeExportUrl } from './manifest';
import { parseConversationExport } from './parse';

// 2026-10-31 실제 Claude 다운로드 목록 파일의 구조를 본뜬 가짜 데이터 (링크는 가짜)
function manifest(conversationsUrl: string) {
  return {
    instructions: 'Download each file using the export_url.',
    created_at: '2026-10-31T10:08:23.756934+00:00',
    total_files: 3,
    data_files: [
      {
        batch_index: 0,
        export_url: 'https://claude.ai/export/acct/download/meta',
        category: 'light_metadata',
        part: 0,
        filename: 'light_metadata-000.zip',
      },
      {
        batch_index: 1,
        export_url: 'https://claude.ai/export/acct/download/memories',
        category: 'memories',
        part: 0,
        filename: 'memories-000.zip',
      },
      {
        batch_index: 2,
        export_url: conversationsUrl,
        category: 'conversations',
        part: 0,
        filename: 'conversations-000.zip',
      },
    ],
    version: '1.0',
  };
}

describe('safeClaudeExportUrl', () => {
  it('https claude.ai의 /export/ 주소만 통과시킨다', () => {
    expect(
      safeClaudeExportUrl('https://claude.ai/export/acct/download/abc'),
    ).toBe('https://claude.ai/export/acct/download/abc');

    for (const url of [
      'http://claude.ai/export/acct/download/abc', // https 아님
      'https://claude.ai.evil.com/export/abc', // 비슷한 다른 사이트
      'https://evil.com/claude.ai/export/abc',
      'https://sub.claude.ai/export/abc',
      'https://claude.ai/settings', // 내보내기 주소 아님
      'https://claude.ai:8443/export/abc',
      'https://user:pw@claude.ai/export/abc',
      'javascript:alert(1)',
      '/export/abc',
      '',
      123,
      undefined,
    ]) {
      expect(safeClaudeExportUrl(url)).toBeUndefined();
    }
  });
});

describe('readClaudeManifest', () => {
  it('대화 기록 zip 링크와 만료 시각(24시간 뒤)만 꺼낸다', () => {
    const result = readClaudeManifest(
      manifest('https://claude.ai/export/acct/download/conv'),
    );
    expect(result).toEqual({
      downloadUrl: 'https://claude.ai/export/acct/download/conv',
      fileName: 'conversations-000.zip',
      expiresAt: '2026-11-01T10:08:23.756Z',
    });
  });

  it('대화 기록 링크가 claude.ai 주소가 아니면 링크를 넘기지 않는다', () => {
    const result = readClaudeManifest(
      manifest('https://evil.com/export/acct/download/conv'),
    );
    expect(result?.downloadUrl).toBeUndefined();
  });

  it('다른 JSON은 목록 파일로 보지 않는다', () => {
    for (const json of [null, [], {}, { data_files: [] }, [{ uuid: 'x' }]]) {
      expect(readClaudeManifest(json)).toBeNull();
    }
  });

  it('목록 파일을 올리면 대화가 아니라 받기 안내를 돌려준다', () => {
    const result = parseConversationExport(
      'manifest-abc.json',
      JSON.stringify(manifest('https://claude.ai/export/acct/download/conv')),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.title).toBe('Claude 다운로드 목록 파일이에요');
      expect(result.manifest?.downloadUrl).toBe(
        'https://claude.ai/export/acct/download/conv',
      );
      // 다른 항목의 링크는 결과에 들어가지 않는다
      expect(JSON.stringify(result)).not.toContain('memories');
    }
  });
});
