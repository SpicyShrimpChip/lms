# 프론트 배포 (Vercel)

프론트(`frontend/`)를 Vercel에 올려 링크로 바로 볼 수 있게 한다. 백엔드가 아직 배포되지 않았으므로 처음에는 **목업 모드**로 올린다(로그인·서버 없이 모든 화면이 뜬다). 링크가 공개되어도 화면에 나오는 것은 `src/mocks/`의 예시 데이터뿐이다.

## 지금 연결 상태 (2026-10-27 연결)

- 운영 주소: https://lms-seven-tawny.vercel.app/ (목업 모드)
- Vercel: 팀 `SSC`(Hobby 무료 플랜) / 프로젝트 `lms`, GitHub `SpicyShrimpChip/lms`의 `main`에 Git 연결
- 설정: 아래 1번 표 그대로(Root Directory `frontend`, 환경변수 `VITE_USE_MOCK=true`·`HUSKY=0`)
- main에 머지되면 운영 주소가 자동으로 새로 배포되고, PR마다 미리보기 주소가 달린다
- 무료 플랜은 조직 소유 비공개 레포를 연결하지 못해서, 같은 날 레포를 **공개로 바꾼 뒤** 연결했다(팀원 동의, 대회 제출에도 공개 링크가 필요했다). 그래서 아래 3번은 지금은 쓰지 않는다
- 서비스 이름이 정해지면: 프로젝트 이름은 Settings → General에서 바꾸고, 주소는 자동으로 바뀌지 않으므로 Settings → Domains에서 `<새 이름>.vercel.app`을 추가한다
- 목업의 퀴즈 결과·자료 목록 변경은 보는 사람 브라우저(localStorage)에만 남는다. 다른 사람이 링크로 들어오면 처음 상태부터 보인다

## 1. 연결하기 (처음 한 번, 사람이 직접 — 10/27 완료, 다시 연결할 때 참고)

1. Vercel에 가입·로그인하고 **Add New → Project**에서 GitHub의 `SpicyShrimpChip/lms`를 고른다.
   - 조직(SpicyShrimpChip) 레포가 목록에 없으면 GitHub 연결 화면에서 조직 접근을 허용한다(조직 관리자 승인이 필요할 수 있다).
   - 무료(Hobby) 플랜은 **조직 소유 비공개 레포**를 가져오지 못할 수 있다. 막히면 아래 "막혔을 때"를 본다.
2. 설정 값을 아래 표대로 넣고 **Deploy**를 누른다.

| 항목                       | 값                                                                   |
| -------------------------- | -------------------------------------------------------------------- |
| Root Directory             | `frontend`                                                           |
| Framework Preset           | Vite (자동으로 잡힌다)                                               |
| Install Command            | `npm ci`                                                             |
| Build Command              | `npm run build`                                                      |
| Output Directory           | `dist`                                                               |
| Node.js Version (Settings) | 24.x (CI와 같게)                                                     |
| 환경변수 `VITE_USE_MOCK`   | `true` (Production·Preview 모두)                                     |
| 환경변수 `HUSKY`           | `0` (설치할 때 커밋 훅을 설치하지 않게. 배포 서버에는 `.git`이 없다) |

- `.env.development`는 개발 서버에서만 읽힌다. 배포 빌드에는 쓰이지 않으므로 `VITE_USE_MOCK`은 Vercel 환경변수로 꼭 넣는다. 빠지면 화면이 `/api`를 실제로 부르고, 아직 백엔드가 없어 오류가 난다.
- 비밀값(API 키 등)은 프론트 환경변수에 넣지 않는다. `VITE_`로 시작하는 값은 빌드 결과에 그대로 들어가 누구나 볼 수 있다.

연결이 끝나면 main에 머지될 때마다 운영 주소가, PR마다 미리보기 주소가 자동으로 만들어진다(PR 화면에 Vercel 봇이 링크를 단다).

## 2. `frontend/vercel.json`

React Router로 화면을 나누기 때문에 `/analysis`처럼 바로 들어오거나 새로고침한 주소도 `index.html`을 돌려줘야 한다(없으면 Vercel이 404를 낸다). 실제 파일(`/assets/...`)이 있으면 그 파일이 먼저 나가고, 없을 때만 `index.html`로 넘긴다.

**백엔드를 배포한 뒤(예: Render)**: `/api` 요청을 백엔드로 넘기는 규칙을 **맨 앞에** 추가하고, Vercel 환경변수 `VITE_USE_MOCK`을 `false`로 바꾼다. 같은 출처로 요청하므로 로그인 쿠키·CORS 설정이 단순해진다(`frontend/CLAUDE.md` "백엔드 연동").

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://<백엔드 주소>/api/:path*"
    },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- TODO(미결): 백엔드 배포 주소 (`docs/frontend-requests.md` 5번 "배포")

## 3. 막혔을 때 (조직 비공개 레포를 가져오지 못함)

레포를 공개로 바꿔서 지금은 해당하지 않는다. 다시 비공개로 돌리면 새 배포가 막힐 수 있으니 그때 본다. 정책은 바뀔 수 있으니 연결 화면의 안내를 먼저 본다. 쓸 수 있는 방법:

- **Pro 무료 체험**(기간 한정): 체험이 끝나기 전에 아래 방법으로 옮겨야 한다.
- **GitHub Actions + Vercel CLI**: Vercel에서 프로젝트를 만들고(Git 연결 없이) `VERCEL_TOKEN`·`VERCEL_ORG_ID`·`VERCEL_PROJECT_ID`를 GitHub Actions 시크릿에 넣은 뒤, 워크플로에서 `vercel deploy`로 올린다. 토큰은 시크릿에만 두고 커밋하지 않는다.
- **다른 정적 호스팅**: Netlify, Cloudflare Pages도 같은 방식(빌드 명령 `npm run build`, 결과 폴더 `dist`, 모든 경로를 `index.html`로)으로 올릴 수 있다. 이때 `vercel.json` 대신 각 서비스의 리다이렉트 설정이 필요하다.
- **레포 공개 전환을 앞당기기**: 공개 전에 커밋 기록·`docs/`의 실명·경력 정보를 먼저 점검한다(루트 `CLAUDE.md` 보안 원칙).
