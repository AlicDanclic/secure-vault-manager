const fs = require('fs');
const crypto = require('crypto');

const VERSION = 2;

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function encryptEntries(entries, password) {
  if (!password) throw new Error('需要主密码');
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', crypto.scryptSync(password, salt, 32), iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(entries), 'utf-8')), cipher.final()]);
  return {
    secureVaultVersion: VERSION,
    cipher: 'aes-256-gcm',
    kdf: 'scrypt',
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: encrypted.toString('base64')
  };
}

function decryptEntries(payload, password) {
  if (!password) throw new Error('需要主密码');
  if (!payload || payload.secureVaultVersion !== VERSION || payload.cipher !== 'aes-256-gcm') {
    throw new Error('不是支持的加密数据文件');
  }
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      crypto.scryptSync(password, Buffer.from(payload.salt, 'base64'), 32),
      Buffer.from(payload.iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
    return JSON.parse(Buffer.concat([
      decipher.update(Buffer.from(payload.data, 'base64')),
      decipher.final()
    ]).toString('utf-8'));
  } catch {
    throw new Error('解密失败，请检查主密码或文件内容');
  }
}

module.exports = { encryptEntries, decryptEntries, readJsonFile };
