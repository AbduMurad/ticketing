module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    STRIPE_PUBLISHABLE_KEY:
      'pk_test_51Jb4aZL1JqLLZK62dKr5mg2sNxGOmVvhSfioqYxaYmDFYlsuyf2iKsB3Sh13M7yiDG82IvOH9YpBazHC4FehpD2J00cNyrGCPS',
  },
};
