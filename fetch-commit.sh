set -e 
latest_commit=$(curl -s https://api.github.com/repos/dudaji-vn/middo-translate/commits?sha=$1 | jq -r '.[0].sha')
echo "export const COMMIT_SHA = '$latest_commit'" > src/configs/commit-data.ts

latest_tag=$(curl -s "https://api.github.com/repos/dudaji-vn/middo-translate/tags" | jq -r '.[0].name')
echo "export const LATEST_TAG = '$latest_tag'" >> src/configs/commit-data.ts

