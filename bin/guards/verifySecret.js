module.exports = (secret) => {
  const isSecretVerified = secret !== undefined && secret === process.env.SECRET;
  console.log('Secret verified: ' + isSecretVerified);
  return isSecretVerified;
};
