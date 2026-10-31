import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { describeZipWithoutConversations, readExportZip } from './archive';

// 테스트 안에서 가짜 zip을 만든다 (실제 내보내기 파일은 레포에 넣지 않는다)
function zip(files: Record<string, string>): Uint8Array {
  return zipSync(
    Object.fromEntries(
      Object.entries(files).map(([name, text]) => [name, strToU8(text)]),
    ),
  );
}

describe('readExportZip', () => {
  it('대화 기록 파일만 풀어서 돌려준다', async () => {
    const result = await readExportZip(
      zip({
        'conversations.json': '[{"uuid":"a"}]',
        'users.json': '[{"email_address":"비밀"}]',
        'images/photo.png': 'png',
      }),
    );
    expect(result).toEqual({
      ok: true,
      files: [{ name: 'conversations.json', text: '[{"uuid":"a"}]' }],
    });
  });

  it('ChatGPT처럼 여러 개로 나뉜 대화 파일과 폴더 안의 파일도 찾는다', async () => {
    const result = await readExportZip(
      zip({
        'conversations-000.json': '[1]',
        'conversations-001.json': '[2]',
        'export/conversations.json': '[3]',
        'chat.html': '<html></html>',
      }),
    );
    if (!result.ok) throw new Error(result.message);
    expect(result.files.map((file) => file.name).sort()).toEqual([
      'conversations-000.json',
      'conversations-001.json',
      'export/conversations.json',
    ]);
  });

  it('대화 기록이 없는 Claude zip이면 conversations-000.zip을 고르라고 알려 준다', async () => {
    const result = await readExportZip(
      zip({ 'users.json': '[]', 'login_history.json': '{}' }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.title).toBe('대화 기록이 들어 있는 zip이 아니에요');
      expect(result.message).toMatch(/conversations-000\.zip/);
    }
  });

  it('zip이 아니면 열지 못했다고 알려 준다', async () => {
    const result = await readExportZip(strToU8('zip 아님'));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.title).toBe('압축 파일을 열지 못했어요');
  });
});

describe('describeZipWithoutConversations', () => {
  it('파일 이름만 보고 어떤 zip인지 알아본다', () => {
    expect(describeZipWithoutConversations(['projects/a.json']).title).toBe(
      '대화 기록이 들어 있는 zip이 아니에요',
    );
    expect(describeZipWithoutConversations(['memories/a.json']).title).toBe(
      '대화 기록이 들어 있는 zip이 아니에요',
    );
    expect(
      describeZipWithoutConversations(['Takeout/내 활동/Gemini 앱/내활동.html'])
        .title,
    ).toBe('Gemini 대화는 아직 가져올 수 없어요');
    expect(describeZipWithoutConversations(['photo.png']).title).toBe(
      '대화 기록 파일이 아니에요',
    );
  });
});
