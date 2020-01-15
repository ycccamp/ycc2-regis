const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  env: {
    FULLSTORY: process.env.FULLSTORY,
  },
  exportTrailingSlash: true,
})
