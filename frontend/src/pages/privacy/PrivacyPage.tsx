import { SubPage } from '@/components';

// 개인정보처리방침 초안. 항목 순서는 개인정보보호위원회 「개인정보 처리방침 작성지침」을 따르고,
// 내용은 지금 코드가 실제로 하는 처리(docs/backend-design.md, docs/frontend-requests.md)에 맞춘다.
// 처리 방식이 바뀌면 이 파일도 같은 PR에서 고친다.
// TODO(미결): LLM 제공사, 호스팅·DB 서비스, 학습 자료 원본 보관 여부, 만 14세 미만 가입, 보호책임자, 시행일
// → 정해지면 아래 "정해지는 대로" 문구를 실제 값으로 바꾼다 (서비스 공개 전 필수, 팀 검토 필요)

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

const PENDING = '(정해지는 대로 적어 둘게요)';

const SECTIONS: Section[] = [
  {
    id: 'purpose',
    title: '1. 개인정보를 처리하는 목적',
    blocks: [
      {
        type: 'p',
        text: 'ai-lms(이하 "서비스")는 아래 목적으로만 개인정보를 처리해요. 목적이 바뀌면 미리 알리고 필요한 경우 다시 동의를 받아요.',
      },
      {
        type: 'ul',
        items: [
          '회원 가입과 관리: 본인 확인, 로그인 유지, 부정 이용 방지',
          '학습 분석: 올린 학습 자료와 사용자가 고른 AI 대화로 개념별 숙련도를 계산하고 판단 근거를 보여 주기',
          '학습 도움: 요약·퀴즈·맞춤 학습 순서 만들기',
          '서비스 안내: 공지와 문의 답변',
        ],
      },
    ],
  },
  {
    id: 'items',
    title: '2. 처리하는 개인정보 항목',
    blocks: [
      {
        type: 'table',
        head: ['구분', '항목', '모으는 때'],
        rows: [
          [
            '필수',
            '이메일, 이름, 비밀번호(암호화해서 저장), 이용약관·개인정보 수집 동의 시각',
            '회원가입',
          ],
          [
            '필수',
            '내 과목(이름·학기·키워드), 올린 학습 자료와 그 내용에서 뽑은 글, 퀴즈 풀이 기록',
            '서비스를 이용할 때',
          ],
          [
            '선택',
            '사용자가 직접 고른 AI 대화(이메일·전화번호 같은 개인정보를 가린 뒤의 글), AI 대화 분석 동의 시각',
            'AI 대화 분석에 동의하고 대화를 보낼 때',
          ],
          [
            '자동 생성',
            '로그인 유지용 토큰, 로그인 시도 기록(접속 IP)',
            '로그인할 때',
          ],
        ],
      },
      {
        type: 'p',
        text: 'AI 대화 분석에 동의하지 않아도 학습 자료로 공부하는 기능은 그대로 쓸 수 있어요.',
      },
    ],
  },
  {
    id: 'conversations',
    title: '3. AI 대화 파일은 이렇게 다뤄요',
    blocks: [
      {
        type: 'ul',
        items: [
          'ChatGPT·Claude에서 내보낸 대화 파일은 서버로 보내지 않고 내 브라우저 안에서만 읽어요.',
          '내 과목 키워드가 들어 있는 공부 대화만 고르고, 이메일·전화번호·주민등록번호·카드번호·API 키·IP 주소, 내가 입력한 이름과 단어를 가린 뒤 미리 보여 드려요.',
          '내가 최종으로 고른 대화만, 가린 상태로 서버에 보내요. 이미지와 첨부 파일 내용은 보내지 않고 "[이미지]" 표시만 남겨요.',
          '서버도 개인정보 형식이 남아 있는지 한 번 더 검사하고, 남아 있으면 그 대화는 저장하지 않고 알려 드려요.',
        ],
      },
    ],
  },
  {
    id: 'retention',
    title: '4. 개인정보의 처리 및 보유 기간',
    blocks: [
      {
        type: 'ul',
        items: [
          '회원 정보와 학습 기록: 탈퇴할 때까지. 탈퇴하면 바로 삭제해요.',
          '가져온 AI 대화와 그로부터 계산한 분석 결과: AI 대화 분석 동의를 철회하거나 탈퇴할 때까지. 대화 한 건을 지우면 그 대화로 계산한 근거도 함께 지우고 점수를 다시 계산해요.',
          `올린 학습 자료 원본: 보관 여부를 정하고 있어요 ${PENDING}`,
          '로그인 유지용 토큰: 14일. 로그아웃하면 바로 폐기해요.',
          '로그인 시도 기록(접속 IP): 반복 실패를 막는 데만 쓰고, 서버 메모리에 15분 동안만 두며 따로 저장하지 않아요.',
        ],
      },
      {
        type: 'p',
        text: '다른 법령에서 보관하라고 정한 정보가 생기면 그 기간과 근거를 여기에 적어요.',
      },
    ],
  },
  {
    id: 'destruction',
    title: '5. 개인정보의 파기 절차 및 방법',
    blocks: [
      {
        type: 'p',
        text: '보유 기간이 끝났거나 처리 목적을 이룬 개인정보는 지체 없이 파기해요. 데이터베이스의 정보는 다시 살릴 수 없는 방법으로 삭제하고, 저장된 파일은 파일째 지워요.',
      },
    ],
  },
  {
    id: 'third-party',
    title: '6. 개인정보의 제3자 제공',
    blocks: [
      {
        type: 'p',
        text: '이용자의 개인정보를 다른 사람이나 회사에 제공하지 않아요. 법령에 따라 요구되는 경우에만 예외로 해요.',
      },
    ],
  },
  {
    id: 'outsourcing',
    title: '7. 개인정보 처리의 위탁과 국외 이전',
    blocks: [
      {
        type: 'p',
        text: '분석·요약·퀴즈를 만들기 위해 외부 AI 서비스(생성형 AI API)를 쓰고, 서비스 운영을 위해 서버·데이터베이스 호스팅을 이용해요. 이때 아래 정보가 해외 서버로 전송될 수 있어요.',
      },
      {
        type: 'table',
        head: ['받는 곳', '보내는 정보', '목적', '보관'],
        rows: [
          [
            `생성형 AI API 제공사 ${PENDING}`,
            '개인정보를 가린 AI 대화, 학습 자료에서 뽑은 글',
            '개념 분류, 판단 근거 설명, 요약·퀴즈 생성',
            '이용자 데이터를 모델 학습에 쓰지 않는 API를 써요. 제공사의 보관 정책은 정해지면 적어요.',
          ],
          [
            `서버·데이터베이스 호스팅 ${PENDING}`,
            '2번의 모든 항목',
            '서비스 운영',
            '4번의 보유 기간과 같아요.',
          ],
        ],
      },
      {
        type: 'p',
        text: '국외 이전을 원하지 않으면 AI 대화 분석에 동의하지 않거나, 학습 자료를 올리지 않으면 돼요. 이 경우 해당 분석 기능은 쓸 수 없어요.',
      },
    ],
  },
  {
    id: 'rights',
    title: '8. 이용자의 권리와 행사 방법',
    blocks: [
      {
        type: 'ul',
        items: [
          '언제든 내 개인정보를 열람·정정·삭제하거나 처리 정지를 요구할 수 있어요.',
          '마이페이지에서 내 정보를 확인하고, AI 대화 분석 동의 철회와 탈퇴를 할 수 있어요(동의 철회·탈퇴 기능은 준비 중이에요).',
          `그 밖의 요청은 아래 보호책임자에게 연락해 주세요. 받은 요청은 지체 없이 처리하고 결과를 알려 드려요.`,
        ],
      },
    ],
  },
  {
    id: 'security',
    title: '9. 개인정보의 안전성 확보 조치',
    blocks: [
      {
        type: 'ul',
        items: [
          '비밀번호는 원래 글자로 저장하지 않고 BCrypt로 바꿔 저장해요.',
          '로그인 유지용 토큰은 자바스크립트가 읽을 수 없는 쿠키에 두고, 쓸 때마다 새 토큰으로 바꾸며, 이미 쓴 토큰이 다시 오면 그 로그인을 모두 끊어요.',
          '같은 계정·같은 곳에서 로그인을 여러 번 틀리면 잠시 막아요.',
          '모든 데이터는 로그인한 본인 것만 조회하도록 서버에서 확인해요. 올린 자료와 그로부터 만든 요약·퀴즈는 올린 본인만 볼 수 있어요.',
          '서버 기록(로그)에 대화 본문과 비밀번호를 남기지 않아요.',
          '서비스 운영에 쓰는 비밀값은 코드에 넣지 않고 환경변수로만 관리해요.',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: '10. 자동으로 수집하는 장치',
    blocks: [
      {
        type: 'ul',
        items: [
          '쿠키: 로그인 유지용 토큰 한 가지만 써요(14일, 로그인 기능에서만 전송).',
          '브라우저 저장소: 화면 모드(밝게·어둡게) 선택과 "로그인한 적이 있는지" 표시만 저장해요. 토큰은 저장하지 않아요.',
          '방문 분석·광고용 추적 도구는 쓰지 않아요.',
          '브라우저 설정에서 쿠키를 막을 수 있지만, 그러면 로그인 상태가 유지되지 않아요.',
        ],
      },
    ],
  },
  {
    id: 'children',
    title: '11. 만 14세 미만 아동의 개인정보',
    blocks: [
      {
        type: 'p',
        text: `대학생을 위한 서비스예요. 만 14세 미만 아동의 가입을 어떻게 다룰지 정하고 있어요 ${PENDING}`,
      },
    ],
  },
  {
    id: 'officer',
    title: '12. 개인정보 보호책임자',
    blocks: [
      {
        type: 'p',
        text: `개인정보 처리에 관한 문의, 불만, 피해 구제는 보호책임자에게 알려 주세요. 담당자와 연락처 ${PENDING}`,
      },
    ],
  },
  {
    id: 'remedy',
    title: '13. 권익침해 구제 방법',
    blocks: [
      {
        type: 'p',
        text: '개인정보 침해에 대한 상담이나 분쟁 해결이 필요하면 아래 기관에 문의할 수 있어요.',
      },
      {
        type: 'ul',
        items: [
          '개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)',
          '개인정보침해신고센터: 118 (privacy.kisa.or.kr)',
          '대검찰청: 1301 (www.spo.go.kr)',
          '경찰청: 182 (ecrm.police.go.kr)',
        ],
      },
    ],
  },
  {
    id: 'changes',
    title: '14. 처리방침의 변경',
    blocks: [
      {
        type: 'p',
        text: `내용이 바뀌면 시행 7일 전부터 공지사항으로 알려 드려요. 이 처리방침은 아직 초안이고, 시행일은 ${PENDING}`,
      },
    ],
  },
];

function SectionBlock({ block }: { block: Block }) {
  if (block.type === 'p') {
    return <p className="leading-relaxed text-ink-soft">{block.text}</p>;
  }
  if (block.type === 'ul') {
    return (
      <ul className="flex list-disc flex-col gap-1.5 pl-5 leading-relaxed text-ink-soft">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-150 border-collapse border-t-2 border-heading text-body">
        <thead>
          <tr className="bg-surface-muted text-caption text-ink-soft">
            {block.head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border-b border-line px-3.5 py-3 text-left font-bold"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, index) => (
                <td
                  key={block.head[index]}
                  className={`border-b border-line px-3.5 py-3 align-top leading-relaxed ${index === 0 ? 'font-bold text-heading' : 'text-ink-soft'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrivacyPage() {
  return (
    <SubPage
      title="개인정보처리방침"
      description="어떤 정보를 왜 모으고, 얼마나 보관하고, 어떻게 지울 수 있는지 알려 드려요"
    >
      <p className="rounded-xl bg-surface-muted px-4 py-3 text-body text-ink-soft">
        초안이에요. 아직 정하지 않은 부분은 {PENDING}로 표시했고, 정해지는 대로
        고쳐서 공지할게요.
      </p>

      <nav aria-label="목차" className="rounded-2xl border border-line p-5">
        <p className="mb-2 font-bold text-heading">목차</p>
        <ol className="grid gap-x-6 gap-y-1.5 text-body sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-ink-soft hover:text-primary hover:underline"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex max-w-3xl flex-col gap-10">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="flex scroll-mt-6 flex-col gap-3"
          >
            <h2
              id={`${section.id}-title`}
              className="text-xl font-extrabold text-heading"
            >
              {section.title}
            </h2>
            {section.blocks.map((block, index) => (
              // 고정된 문서 내용이라 순서가 바뀌지 않는다
              // eslint-disable-next-line react-x/no-array-index-key
              <SectionBlock key={index} block={block} />
            ))}
          </section>
        ))}
      </div>
    </SubPage>
  );
}

export default PrivacyPage;
