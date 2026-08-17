#!/usr/bin/env bash
# Deploy the built SPA to S3 and invalidate CloudFront.
#
# Usage:
#   S3_BUCKET=my-bucket CF_DISTRIBUTION_ID=E123ABC ./deploy/deploy.sh
#
# Prereqs: aws cli v2 configured with credentials that can write to the
# bucket and create CloudFront invalidations.

set -euo pipefail

: "${S3_BUCKET:?Set S3_BUCKET to your bucket name}"
CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:-}"

echo "Building..."
npm run build

echo "Syncing hashed assets (long cache)..."
aws s3 sync dist/assets "s3://${S3_BUCKET}/assets" \
  --cache-control "public,max-age=31536000,immutable" \
  --delete

echo "Uploading index.html (no cache)..."
aws s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html"

if [ -n "${CF_DISTRIBUTION_ID}" ]; then
  echo "Invalidating CloudFront..."
  aws cloudfront create-invalidation \
    --distribution-id "${CF_DISTRIBUTION_ID}" \
    --paths "/index.html"
fi

echo "Deployed."
