
latest_commit=$(curl -s https://api.github.com/repos/dudaji-vn/middo-translate/commits?sha=develop | jq -r '.[0].sha')
echo "export const COMMIT_SHA = '$latest_commit'" > src/configs/commit-data.ts