module.exports = (secret) => {
  return secret === process.env.SECRET;
};
