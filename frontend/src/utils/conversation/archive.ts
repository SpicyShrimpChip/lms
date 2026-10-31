import { strFromU8, unzip } from 'fflate';

// 내보내기 zip을 브라우저 안에서 연다. 서버로는 아무것도 보내지 않는다.
// zip 목차의 파일 이름만 먼저 보고, 대화 기록 파일만 푼다. 다른 파일(로그인 기록·메모리·이미지 등)은 풀지 않는다

// 풀어서 읽을 대화 기록 파일 이름. ChatGPT는 conversations.json(나뉘면 conversations-000.json 등),
// Claude는 conversations-000.zip 안의 conversations.json
const CONVERSATIONS_ENTRY = /(^|\/)conversations(-\d+)?\.json$/i;

// 풀었을 때 이보다 크면 열지 않는다 (잘못 만든 압축 파일로 브라우저가 멈추지 않게)
// 실제 Claude 대화 기록은 31MB였다(2026-10-31)
export const MAX_UNZIPPED_BYTES = 300 * 1024 * 1024;

export interface ZipProblem {
  title: string;
  message: string;
}

export type ZipReadResult =
  | { ok: true; files: { name: string; text: string }[] }
  | ({ ok: false } & ZipProblem);

// 대화 기록이 없는 zip이면 무엇인지 알아보고 안내 문구를 만든다 (이름만 보고 판단한다)
export function describeZipWithoutConversations(names: string[]): ZipProblem {
  const has = (pattern: RegExp) => names.some((name) => pattern.test(name));

  if (has(/^Takeout\//)) {
    return {
      title: 'Gemini 대화는 아직 가져올 수 없어요',
      message:
        'Gemini 가져오기는 준비 중이에요. 지금은 ChatGPT나 Claude에서 내보낸 zip을 올려 주세요.',
    };
  }
  // Claude 내보내기의 다른 zip들 (users.json 등은 계정 정보, projects/ 등은 프로젝트·메모리)
  if (
    has(
      /^(users\.json|login_history\.json|projects\/|memories\/|reflections\/|claude_code_cloud\/)/,
    )
  ) {
    return {
      title: '대화 기록이 들어 있는 zip이 아니에요',
      message:
        'Claude 내보내기는 zip이 여러 개로 와요. 그중 conversations-000.zip을 올려 주세요.',
    };
  }
  return {
    title: '대화 기록 파일이 아니에요',
    message: 'ChatGPT나 Claude에서 내보낸 zip을 그대로 올려 주세요.',
  };
}

export function readExportZip(bytes: Uint8Array): Promise<ZipReadResult> {
  return new Promise((resolve) => {
    const names: string[] = [];
    let tooLarge = false;
    unzip(
      bytes,
      {
        filter: (file) => {
          names.push(file.name);
          if (!CONVERSATIONS_ENTRY.test(file.name)) return false;
          if (file.originalSize > MAX_UNZIPPED_BYTES) {
            tooLarge = true;
            return false;
          }
          return true;
        },
      },
      (error, files) => {
        if (error) {
          resolve({
            ok: false,
            title: '압축 파일을 열지 못했어요',
            message:
              '파일이 중간에 잘리지 않았는지 확인하고, 내보내기 파일을 다시 받아 주세요.',
          });
          return;
        }
        const found = Object.entries(files).map(([name, data]) => ({
          name,
          text: strFromU8(data),
        }));
        if (found.length > 0) {
          resolve({ ok: true, files: found });
        } else if (tooLarge) {
          resolve({
            ok: false,
            title: '대화 기록이 너무 커요',
            message: `풀었을 때 ${MAX_UNZIPPED_BYTES / 1024 / 1024}MB가 넘는 파일은 브라우저에서 열지 않아요.`,
          });
        } else {
          resolve({ ok: false, ...describeZipWithoutConversations(names) });
        }
      },
    );
  });
}
