const TRUSTED_ISSUERS = Object.freeze({
  Google: "critical",
  Microsoft: "critical",
  "Amazon Web Services": "critical",
  IBM: "verified",
  Meta: "verified",
  "Duke University": "verified",
});

const credentialIndex = new Map();
const configure = (credentials = []) => {
  credentialIndex.clear();
  credentials.forEach((credential) => {
    if (!credential?.id || !credential?.meta?.credentialId) return;
    credentialIndex.set(credential.id, credential);
    credentialIndex.set(credential.meta.credentialId, credential);
  });
  return credentialIndex.size;
};
const getTrustLevel = (issuer = "") =>
  TRUSTED_ISSUERS[issuer.trim()] ?? "standard";
const verify = (credentialId) => {
  const credential = credentialIndex.get(credentialId);
  if (!credential) {
    return {
      verified: false,
      trustLevel: "compromised",
      credential: null,
    };
  }
  return {
    verified: Boolean(credential.verificationUrl),
    trustLevel: getTrustLevel(credential.issuer),
    credential: { ...credential },
  };
};
const canVerify = (credentialId) =>
  Boolean(credentialIndex.get(credentialId)?.verificationUrl);
const SecurityAuthority = Object.freeze({
  configure,
  verify,
  canVerify,
  getTrustLevel,
});

export default SecurityAuthority;
