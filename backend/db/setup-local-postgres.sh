#!/usr/bin/env bash
# 도커로 켠 로컬 PostgreSQL(backend/db/compose.yaml, 컨테이너 이름 lms)에 AI LMS 전용 DB와 계정을 만든다.
# 직접 터미널에서 실행한다 (컨테이너가 켜져 있어야 한다):
#   cd backend && ./db/setup-local-postgres.sh
#
# 하는 일
#   1. 컨테이너 안의 psql로 기존 DB·계정 목록을 보여 준다 (읽기만 함)
#   2. ai_lms / ai_lms_test DB나 ai_lms_app / ai_lms_migrator 계정이 이미 있으면 아무것도 바꾸지 않고 멈춘다
#   3. DB 2개(UTF-8)와 계정 2개를 만들고 각 DB에만 최소 권한을 준다
#        ai_lms_migrator: DB 소유자. 테이블 생성·변경(Flyway 마이그레이션 전용)
#        ai_lms_app     : 데이터 읽기·쓰기만 (애플리케이션이 쓰는 계정)
#   4. backend/.env(커밋 안 됨, 권한 600)에 접속 정보와 JWT 시크릿을 저장한다
#
# 비밀번호는 화면에 보이지 않게 입력받고, 명령줄 인자·셸 기록에 남기지 않는다 (SQL은 표준 입력으로만 넘긴다).
# 관리자(postgres)는 컨테이너 안에서 소켓으로 접속하므로 비밀번호가 필요 없다.
set -euo pipefail

CONTAINER="${CONTAINER:-lms}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DATABASES=(ai_lms ai_lms_test)
APP_USER="ai_lms_app"
MIGRATION_USER="ai_lms_migrator"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if ! command -v docker >/dev/null 2>&1; then
	echo "docker 명령을 찾을 수 없어요. Docker Desktop을 설치하고 켠 뒤 새 터미널에서 다시 실행해 주세요." >&2
	exit 1
fi

if [ -e "$ENV_FILE" ]; then
	echo "backend/.env가 이미 있어요. 덮어쓰지 않도록 멈춥니다. 필요하면 파일을 옮긴 뒤 다시 실행해 주세요." >&2
	exit 1
fi

# 컨테이너 안의 psql에 SQL을 표준 입력으로 넘긴다
run_sql() {
	docker exec -i "$CONTAINER" psql -U postgres -v ON_ERROR_STOP=1 -X -q -t -A "$@"
}

if ! run_sql -c "SELECT 1;" >/dev/null 2>&1; then
	echo "컨테이너 '$CONTAINER'에 접속하지 못했어요. Docker Desktop이 켜져 있고 'docker start $CONTAINER'로 컨테이너가 켜져 있는지 확인해 주세요." >&2
	exit 1
fi

echo "== PostgreSQL 서버"
run_sql -c "SHOW server_version;"

echo
echo "== 기존 데이터베이스 (변경하지 않음)"
run_sql -c "SELECT datname FROM pg_database WHERE NOT datistemplate ORDER BY datname;"

echo
echo "== 기존 계정 (변경하지 않음)"
run_sql -c "SELECT rolname FROM pg_roles WHERE rolname NOT LIKE 'pg\_%' ORDER BY rolname;"

existing_db=$(run_sql -c "SELECT datname FROM pg_database WHERE datname IN ('ai_lms', 'ai_lms_test');")
existing_user=$(run_sql -c "SELECT rolname FROM pg_roles WHERE rolname IN ('$APP_USER', '$MIGRATION_USER');")
if [ -n "$existing_db" ] || [ -n "$existing_user" ]; then
	echo
	echo "이미 있는 항목이 있어 아무것도 바꾸지 않고 멈춥니다:" >&2
	[ -n "$existing_db" ] && echo "  DB: $existing_db" >&2
	[ -n "$existing_user" ] && echo "  계정: $existing_user" >&2
	exit 1
fi

read_password() {
	local label=$1 first second
	while true; do
		read -r -s -p "$label 비밀번호 (12자 이상): " first
		echo >&2
		read -r -s -p "$label 비밀번호 다시 입력: " second
		echo >&2
		if [ "$first" != "$second" ]; then
			echo "두 번 입력한 비밀번호가 달라요. 다시 입력해 주세요." >&2
		elif [ "${#first}" -lt 12 ]; then
			echo "12자 이상으로 정해 주세요." >&2
		else
			printf '%s' "$first"
			return
		fi
	done
}

# SQL 문자열 리터럴: 작은따옴표를 두 번 쓴다. .env(.properties)는 \ 를 두 번 쓴다
sql_escape() { printf '%s' "$1" | sed -e "s/'/''/g"; }
prop_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g'; }

echo
echo "새로 만들 계정의 비밀번호를 정해 주세요. (backend/.env에만 저장되고 커밋되지 않아요)"
APP_PASSWORD="${APP_PASSWORD:-}"
MIGRATION_PASSWORD="${MIGRATION_PASSWORD:-}"
[ -n "$APP_PASSWORD" ] || APP_PASSWORD=$(read_password "$APP_USER")
[ -n "$MIGRATION_PASSWORD" ] || MIGRATION_PASSWORD=$(read_password "$MIGRATION_USER")

# 계정과 DB (마이그레이션 계정이 DB 소유자라 public 스키마에 표를 만들 수 있다)
{
	echo "CREATE ROLE $MIGRATION_USER LOGIN PASSWORD '$(sql_escape "$MIGRATION_PASSWORD")';"
	echo "CREATE ROLE $APP_USER LOGIN PASSWORD '$(sql_escape "$APP_PASSWORD")';"
	for db in "${DATABASES[@]}"; do
		echo "CREATE DATABASE $db OWNER $MIGRATION_USER ENCODING 'UTF8' TEMPLATE template0;"
		echo "REVOKE ALL ON DATABASE $db FROM PUBLIC;"
		echo "GRANT CONNECT ON DATABASE $db TO $APP_USER;"
	done
} | run_sql

# DB마다: 앱 계정은 마이그레이션 계정이 만든 표를 읽고 쓰기만 한다 (앞으로 만들 표에도 적용)
for db in "${DATABASES[@]}"; do
	{
		echo "GRANT USAGE ON SCHEMA public TO $APP_USER;"
		echo "ALTER DEFAULT PRIVILEGES FOR ROLE $MIGRATION_USER IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO $APP_USER;"
		echo "ALTER DEFAULT PRIVILEGES FOR ROLE $MIGRATION_USER IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO $APP_USER;"
	} | run_sql -d "$db"
done

JWT_SECRET=$(openssl rand -base64 48)
umask 077
cat >"$ENV_FILE" <<EOF
# 로컬 전용 비밀값 (setup-local-postgres.sh가 만듦). 절대 커밋하지 않는다
DB_URL=jdbc:postgresql://$DB_HOST:$DB_PORT/ai_lms
DB_USERNAME=$APP_USER
DB_PASSWORD=$(prop_escape "$APP_PASSWORD")
DB_MIGRATION_USERNAME=$MIGRATION_USER
DB_MIGRATION_PASSWORD=$(prop_escape "$MIGRATION_PASSWORD")
JWT_SECRET=$JWT_SECRET
EOF
unset APP_PASSWORD MIGRATION_PASSWORD JWT_SECRET

echo
echo "== 만든 항목"
run_sql -c "SELECT datname, pg_get_userbyid(datdba) AS owner, pg_encoding_to_char(encoding) AS encoding FROM pg_database WHERE datname IN ('ai_lms', 'ai_lms_test') ORDER BY datname;"
echo
echo "완료했어요. backend/.env를 만들었습니다 (권한 600)."
echo "테이블은 서버를 처음 띄울 때 Flyway가 만듭니다: ./gradlew bootRun"
echo "실제 PostgreSQL로 테스트: ./gradlew postgresTest  (backend/.env의 계정을 쓰고 ai_lms_test에서만 실행돼요)"
