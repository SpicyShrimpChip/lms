# CI·Git·배포 교훈

## 패키지가 늘어난 뒤에는 다른 컴퓨터에서 `npm ci`를 다시 한다 (2026-10-28, #72·#74)

- 상황: `clsx`·`tailwind-merge`·`prettier-plugin-tailwindcss`가 추가된 뒤 main을 받았다.
- 원인: 패키지가 설치되지 않은 상태에서 커밋하면 커밋 훅(lint-staged)이 정렬 플러그인을 찾지 못해 오류로 멈춘다.
- 해결: main을 받은 뒤 `frontend`에서 `npm ci`를 한 번 한다.
- 다음에는: `package.json`이 바뀐 PR을 받았다면 먼저 `npm ci`를 한다.

## Prettier 검사는 CI가, 고치는 건 커밋 훅이 한다 (2026-10-28, #75)

- 상황: 커밋 훅을 건너뛰거나 GitHub 웹에서 파일을 고친 경우 형식이 어긋난다.
- 원인: CI가 형식을 자동으로 고치게 하면, CI가 만든 커밋은 CI를 다시 돌리지 않고 쓰기 권한도 필요하다.
- 해결: `frontend-ci.yml`이 `npm run format:check`로 검사만 한다. 실패하면 `frontend`에서 `npm run format` 후 커밋한다.
- 다음에는: `package-lock.json`은 npm이 만드는 파일이라 `.prettierignore`로 제외한다.

## 도커: `docker --version`은 되는데 연결 오류가 난다 (2026-10-31)

- 상황: Windows에서 Docker Desktop을 막 설치하고 `docker run`을 했더니 `//./pipe/docker_engine` 연결 오류가 났다.
- 원인: `docker` 명령은 설치만 되면 나오지만, 엔진은 Docker Desktop 앱을 실행해야 켜진다.
- 해결: Docker Desktop을 실행해 왼쪽 아래가 초록색(Engine running)이 된 뒤 다시 실행한다. 계속 멈추면 `wsl --update`와 재부팅.
- 다음에는: PC를 재부팅하면 컨테이너도 꺼지니 Docker Desktop을 켠 뒤 `docker start lms`.

## 백엔드 CI를 필수 검사로 켜는 순서 (2026-10-27, #65)

- 상황: 규칙셋 "backend CI required"를 켜려 한다(지금은 꺼 둠).
- 원인: 백엔드 CI가 `paths` 필터로 `backend/` 변경 때만 돈다. 필수로 켜면 `backend/` 밖만 바꾼 PR은 검사가 돌지 않아 머지되지 않는다.
- 해결: ① `backend-ci.yml`의 `pull_request`에서 `paths` 줄을 지운다. ② 규칙셋을 Active로 바꾼다. 순서가 반대면 안 된다.
- 다음에는: 필수 검사 이름은 job 이름(`build-and-test`, `postgres-test`)과 같아야 한다. job 이름을 바꾸면 규칙셋도 같이 고친다.

## npm 12가 공식 registry 파일까지 막는다 (2026-10-28, #73)

- 상황: Renovate의 lockfile 갱신이 실패한다.
- 원인: npm 12.0.0~12.2.1에서 공식 registry tarball까지 막는 문제(`EALLOWREMOTE`)가 재현됐다.
- 해결: `.github/renovate.json5`에 `constraints: { npm: "<12" }`를 임시로 넣었다.
- 다음에는: npm에서 고쳐지면 이 줄을 지운다. 확인은 최신 npm으로 `@tailwindcss/vite`를 올려 lockfile이 갱신되는지 본다.

## Claude는 강제 푸시가 막혀 있다 (2026-10-28, #74)

- 상황: 머지된 PR 위에 쌓은 브랜치를 main 위로 옮겨야 했다.
- 원인: Claude에게는 강제 푸시(`--force`) 권한이 없다.
- 해결: 옮긴 브랜치를 새 이름으로 올리고, 옛 원격 브랜치는 지운다.

## GitHub Actions 대기열이 길 때 (2026-10-27)

- 상황: PR을 올렸는데 CI가 몇 분 동안 시작하지 않았다(한 번은 7분).
- 원인: Actions 대기열이 밀린 것이다.
- 해결: 오래 걸리면 최신 main을 합쳐 다시 올린다. 새 실행으로 돈다.

## Vercel 환경변수가 빠지면 화면이 `/api`를 실제로 부른다 (2026-10-27, #43)

- 상황: 백엔드가 없는 목업 모드로 배포했다.
- 원인: `.env.development`는 개발 서버에서만 읽히고, 배포 빌드에는 쓰이지 않는다. `VITE_USE_MOCK`이 빠지면 화면이 `/api`를 실제로 호출해 오류가 난다.
- 해결: Vercel 환경변수에 `VITE_USE_MOCK`(Production·Preview 모두)과 `HUSKY=0`(배포 서버에는 `.git`이 없다)을 넣는다.
- 다음에는: `VITE_`로 시작하는 값은 빌드 결과에 그대로 들어가 누구나 볼 수 있으므로 비밀값을 넣지 않는다. 자세한 설정은 `docs/deploy.md`.
