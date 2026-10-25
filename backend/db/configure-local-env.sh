#!/usr/bin/env bash
# 이미 만들어 둔 MySQL DB(ai_lms)와 계정(ai_lms_app, ai_lms_migrator)을 쓰도록 backend/.env를 만든다.
# DB·계정은 만들거나 바꾸지 않는다 (접속 확인용 SELECT만 실행한다). 직접 터미널에서 실행한다:
#   cd backend && ./db/configure-local-env.sh
#
# - 비밀번호·JWT 시크릿은 화면에 보이지 않게 입력받고, 화면·명령줄 인자·셸 기록에 남기지 않는다
# - 두 계정으로 실제 접속(TCP, 앱과 같은 방식)이 되는지 확인한 뒤에만 .env를 쓴다 (권한 600, git에서 제외됨)
# 새 MySQL에 DB·계정까지 만들려면 setup-local-mysql.sh를 쓴다.
set -euo pipefail

MYSQL="${MYSQL:-mysql}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-ai_lms}"
TEST_DB_NAME="${TEST_DB_NAME:-ai_lms_test}"
APP_USER="${APP_USER:-ai_lms_app}"
MIGRATION_USER="${MIGRATION_USER:-ai_lms_migrator}"

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
	echo "backend/.env가 이미 있어요. 덮어쓰지 않도록 멈춥니다. 다시 만들려면 파일을 옮긴 뒤 실행해 주세요." >&2
	exit 1
fi

# 특수문자 이스케이프 (macOS 기본 bash 3.2에서도 같게 동작하도록 sed 사용, 값은 표준 입력으로만 넘긴다)
cnf_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }
prop_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g'; }

CNF="$(mktemp)"
chmod 600 "$CNF"
trap 'rm -f "$CNF"' EXIT

# 앱과 같은 방식(TCP)으로 접속해 현재 계정과 DB만 출력한다
check_login() {
	local user=$1 password=$2 database=$3
	printf '[client]\nuser="%s"\npassword="%s"\nhost="%s"\nport=%s\nprotocol=TCP\n' \
		"$user" "$(cnf_escape "$password")" "$DB_HOST" "$DB_PORT" >"$CNF"
	"$MYSQL" --defaults-extra-file="$CNF" --batch --skip-column-names \
		-e "SELECT CONCAT('  접속 확인: ', CURRENT_USER(), ' → ', DATABASE());" "$database"
}

read -r -s -p "$APP_USER 비밀번호: " APP_PASSWORD
echo
read -r -s -p "$MIGRATION_USER 비밀번호: " MIGRATION_PASSWORD
echo
read -r -s -p "JWT 시크릿 (Enter를 누르면 새로 만들어요): " JWT_SECRET
echo

if [ -z "$JWT_SECRET" ]; then
	JWT_SECRET=$(openssl rand -base64 48)
	echo "  JWT 시크릿을 새로 만들었어요."
else
	# Base64이고 32바이트 이상인지 확인한다 (값은 출력하지 않는다)
	bytes=$(printf '%s' "$JWT_SECRET" | openssl base64 -d -A 2>/dev/null | wc -c | tr -d ' ')
	if [ "${bytes:-0}" -lt 32 ]; then
		echo "JWT 시크릿은 Base64로 인코딩한 32바이트 이상이어야 해요. (예: openssl rand -base64 48)" >&2
		exit 1
	fi
fi

echo
echo "== 접속 확인 ($DB_HOST:$DB_PORT)"
if ! check_login "$APP_USER" "$APP_PASSWORD" "$DB_NAME"; then
	echo "$APP_USER 계정으로 $DB_NAME에 접속하지 못했어요. 비밀번호·권한을 확인해 주세요. (.env는 만들지 않았어요)" >&2
	exit 1
fi
if ! check_login "$MIGRATION_USER" "$MIGRATION_PASSWORD" "$DB_NAME"; then
	echo "$MIGRATION_USER 계정으로 $DB_NAME에 접속하지 못했어요. 비밀번호·권한을 확인해 주세요. (.env는 만들지 않았어요)" >&2
	exit 1
fi
# 테스트 DB는 있어도 없어도 된다 (없으면 ./gradlew mysqlTest만 쓸 수 없다)
if check_login "$APP_USER" "$APP_PASSWORD" "$TEST_DB_NAME" 2>/dev/null; then
	echo "  테스트 DB($TEST_DB_NAME)도 쓸 수 있어요."
else
	echo "  테스트 DB($TEST_DB_NAME)는 아직 쓸 수 없어요. ./gradlew mysqlTest 전에 만들어 주세요 (docs/backend-design.md 8번)."
fi

umask 077
cat >"$ENV_FILE" <<EOF
# 로컬 전용 비밀값 (configure-local-env.sh가 만듦). 절대 커밋하지 않는다
DB_URL=jdbc:mysql://$DB_HOST:$DB_PORT/$DB_NAME?characterEncoding=UTF-8
DB_USERNAME=$APP_USER
DB_PASSWORD=$(prop_escape "$APP_PASSWORD")
DB_MIGRATION_USERNAME=$MIGRATION_USER
DB_MIGRATION_PASSWORD=$(prop_escape "$MIGRATION_PASSWORD")
JWT_SECRET=$JWT_SECRET
EOF
unset APP_PASSWORD MIGRATION_PASSWORD JWT_SECRET

echo
echo "backend/.env를 만들었어요 (권한 600, git에서 제외됨)."
echo "다음: ./gradlew bootRun  (처음 실행할 때 Flyway가 테이블을 만들어요)"
