// eslint-disable-next-line no-unused-vars
const ensureAuth = () => (req, res, next) => {
  return next();
};

module.exports = { 
  ensureAuth
};
