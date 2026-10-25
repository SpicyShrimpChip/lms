#!/usr/bin/env bash
# 로컬 MySQL에 AI LMS 전용 DB와 계정을 만든다. 직접 터미널에서 실행한다:
#   cd backend && ./db/setup-local-mysql.sh
#
# 하는 일
#   1. 관리자(root) 비밀번호를 입력받아 기존 DB·계정 목록을 보여 준다 (읽기만 함)
#   2. ai_lms / ai_lms_test DB나 ai_lms_app / ai_lms_migrator 계정이 이미 있으면 아무것도 바꾸지 않고 멈춘다
#   3. DB 2개(utf8mb4)와 계정 2개를 만들고 각 DB에만 최소 권한을 준다
#        ai_lms_migrator: 테이블 생성·변경(Flyway 마이그레이션 전용)
#        ai_lms_app     : 데이터 읽기·쓰기만 (애플리케이션이 쓰는 계정)
#   4. backend/.env(커밋 안 됨, 권한 600)에 접속 정보와 JWT 시크릿을 저장한다
#
# 비밀번호는 화면에 보이지 않게 입력받고, 명령줄 인자·셸 기록에 남기지 않는다.
set -euo pipefail

MYSQL="${MYSQL:-mysql}"
ADMIN_USER="${MYSQL_ADMIN_USER:-root}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DATABASES=(ai_lms ai_lms_test)
APP_USER="ai_lms_app"
MIGRATION_USER="ai_lms_migrator"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if ! command -v "$MYSQL" >/dev/null 2>&1; then
	if [ -x /usr/local/mysql/bin/mysql ]; then
		MYSQL=/usr/local/mysql/bin/mysql
	else
		echo "mysql 명령을 찾을 수 없어요. MYSQL=/경로/mysql 로 지정해 주세요." >&2
		exit 1
	fi
fi

if [ -e "$ENV_FILE" ]; then
	echo "backend/.env가 이미 있어요. 덮어쓰지 않도록 멈춥니다. 필요하면 파일을 옮긴 뒤 다시 실행해 주세요." >&2
	exit 1
fi

# 관리자 비밀번호는 권한 600 임시 파일로만 mysql에 넘기고, 끝나면 지운다
ADMIN_CNF="$(mktemp)"
chmod 600 "$ADMIN_CNF"
trap 'rm -f "$ADMIN_CNF"' EXIT

# 비밀번호 특수문자 이스케이프. macOS 기본 bash(3.2)에서도 같게 동작하도록 sed를 쓴다 (값은 표준 입력으로만 넘긴다)
# - mysql 옵션 파일: 큰따옴표 안의 \ 와 "
cnf_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }
# - SQL 문자열: 작은따옴표 안의 \ 와 '
sql_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e "s/'/\\\\'/g"; }
# - Spring이 읽는 .properties: \
prop_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g'; }

read -r -s -p "MySQL 관리자($ADMIN_USER) 비밀번호: " ADMIN_PASSWORD
echo
printf '[client]\nuser="%s"\npassword="%s"\nhost="%s"\nport=%s\n' \
	"$ADMIN_USER" "$(cnf_escape "$ADMIN_PASSWORD")" "$DB_HOST" "$DB_PORT" >"$ADMIN_CNF"
unset ADMIN_PASSWORD

run_sql() {
	"$MYSQL" --defaults-extra-file="$ADMIN_CNF" --batch --skip-column-names "$@"
}

echo
echo "== MySQL 서버"
run_sql -e "SELECT VERSION();"

echo
echo "== 기존 데이터베이스 (변경하지 않음)"
run_sql -e "SHOW DATABASES;"

echo
echo "== 기존 계정 (변경하지 않음)"
run_sql -e "SELECT CONCAT(user, '@', host) FROM mysql.user ORDER BY user, host;"

existing_db=$(run_sql -e "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME IN ('ai_lms', 'ai_lms_test');")
existing_user=$(run_sql -e "SELECT CONCAT(user, '@', host) FROM mysql.user WHERE user IN ('$APP_USER', '$MIGRATION_USER');")
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

echo
echo "새로 만들 계정의 비밀번호를 정해 주세요. (backend/.env에만 저장되고 커밋되지 않아요)"
APP_PASSWORD=$(read_password "$APP_USER")
MIGRATION_PASSWORD=$(read_password "$MIGRATION_USER")

{
	for db in "${DATABASES[@]}"; do
		echo "CREATE DATABASE $db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
	done
	echo "CREATE USER '$MIGRATION_USER'@'localhost' IDENTIFIED BY '$(sql_escape "$MIGRATION_PASSWORD")';"
	echo "CREATE USER '$APP_USER'@'localhost' IDENTIFIED BY '$(sql_escape "$APP_PASSWORD")';"
	for db in "${DATABASES[@]}"; do
		echo "GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES ON $db.* TO '$MIGRATION_USER'@'localhost';"
		echo "GRANT SELECT, INSERT, UPDATE, DELETE ON $db.* TO '$APP_USER'@'localhost';"
	done
} | run_sql

JWT_SECRET=$(openssl rand -base64 48)
umask 077
cat >"$ENV_FILE" <<EOF
# 로컬 전용 비밀값 (setup-local-mysql.sh가 만듦). 절대 커밋하지 않는다
DB_URL=jdbc:mysql://$DB_HOST:$DB_PORT/ai_lms?characterEncoding=UTF-8
DB_USERNAME=$APP_USER
DB_PASSWORD=$(prop_escape "$APP_PASSWORD")
DB_MIGRATION_USERNAME=$MIGRATION_USER
DB_MIGRATION_PASSWORD=$(prop_escape "$MIGRATION_PASSWORD")
JWT_SECRET=$JWT_SECRET
EOF
unset APP_PASSWORD MIGRATION_PASSWORD JWT_SECRET

echo
echo "== 만든 항목"
run_sql -e "SELECT SCHEMA_NAME, DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME IN ('ai_lms', 'ai_lms_test');"
run_sql -e "SHOW GRANTS FOR '$APP_USER'@'localhost';"
run_sql -e "SHOW GRANTS FOR '$MIGRATION_USER'@'localhost';"
echo
echo "완료했어요. backend/.env를 만들었습니다 (권한 600)."
echo "테이블은 서버를 처음 띄울 때 Flyway가 만듭니다: ./gradlew bootRun"
