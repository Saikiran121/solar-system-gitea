#!/usr/bin/env bash
# integration-ec2-testing.sh
# Run lightweight integration tests against an EC2 instance tagged for deployment.
#
# Requirements:
#   - aws CLI v2 configured (aws credentials & region)
#   - jq
#   - curl
#
# Usage: ./integration-ec2-testing.sh
# Adjust the TAG_VALUE below if you use a different tag.

set -u

TAG_VALUE="dev-deploy"            # the tag value to look for (adjust if needed)
PORT="3000"
LIVENESS_PATH="/live"
PLANET_PATH="/planet"
# If you want a specific aws profile/region, export AWS_PROFILE/AWS_REGION before running.

log() { printf '%s %s\n' "$(date --iso-8601=seconds)" "$*"; }

# Ensure required commands exist
for cmd in aws jq curl; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    log "ERROR: required command '$cmd' not found in PATH"
    exit 2
  fi
done

log "Starting integration-ec2-testing (looking for tag value: ${TAG_VALUE})"

# Find an IP address (prefer PublicIpAddress, fallback to PrivateIpAddress)
IP="$(aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --output json \
  | jq -r --arg TAG_VALUE "$TAG_VALUE" '
      .Reservations[].Instances[]
      | select(.Tags != null and (.Tags[]?.Value == $TAG_VALUE))
      | (.PublicIpAddress // .PrivateIpAddress // empty)
    ' \
  | grep -Eo '^[^ ]+' \
  | head -n1
)"

if [[ -z "$IP" ]]; then
  log "ERROR: No running EC2 instance found with tag value '${TAG_VALUE}'."
  log "Full describe-instances output (first 200 chars):"
  aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --output json | head -c 200
  exit 3
fi

log "Found instance IP: ${IP}"

BASE_URL="http://${IP}:${PORT}"
LIVENESS_URL="${BASE_URL}${LIVENESS_PATH}"
PLANET_URL="${BASE_URL}${PLANET_PATH}"

# Check liveness endpoint
log "Checking liveness: ${LIVENESS_URL}"
http_code="$(curl -s -o /dev/null -w '%{http_code}' "${LIVENESS_URL}")" || http_code=""

log "Liveness HTTP code: ${http_code}"

# POST to /planet (example payload uses id=3 as in your screenshot)
log "Posting to ${PLANET_URL}"
planet_data="$(curl -s -X POST "${PLANET_URL}" -H "Content-Type: application/json" -d '{"id":"3"}' || true)"
# Extract name from response, if present
planet_name="$(echo "${planet_data}" | jq -r '.name // empty' 2>/dev/null || echo "")"

log "Planet response (raw): ${planet_data}"
log "Planet name extracted: '${planet_name}'"

# Validation logic: expect HTTP 200 and planet_name == "Earth"
if [[ "${http_code}" == "200" && "${planet_name}" == "Earth" ]]; then
  log "SUCCESS: HTTP 200 and planet name == Earth"
  exit 0
fi

# on failure, print helpful debug info and exit non-zero
log "FAILURE: Integration tests failed."
log "Details:"
log "  liveness_http_code=${http_code}"
log "  planet_name='${planet_name}'"
log "  raw_planet_response='${planet_data}'"

exit 1

