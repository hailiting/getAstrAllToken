# npm run gitSubsquidClone
CURRENT_DIR=$(cd $(dirname $0); pwd)
jq -c ".list[]" ${CURRENT_DIR}/github_address.json |
  while read i; do 
  k=`echo $i | sed 's#"#\ #g'`
  # $k = $i | sed 's#"#\ #g'
  # $k = `$i | sed 's#"#\ #g'`
  git clone $k
done