import crypto from 'node:crypto';
import fs from 'node:fs';
import type { EncryptedVaultPayload, VaultEntry } from '../../shared/types/vault';

const VAULT_VERSION = 2;
const KDF = {
  name: 'scrypt',
  keyLength: 32
} as const;

function requirePassword(password: string): void {
  if (!password || typeof password !== 'string') {
    throw new Error('需要主密码');
  }
}

function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.scryptSync(password, salt, KDF.keyLength);
}

export function encryptEntries(entries: VaultEntry[], password: string): EncryptedVaultPayload {
  requirePassword(password);

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = deriveKey(password, salt);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(entries), 'utf-8');
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    secureVaultVersion: VAULT_VERSION,
    cipher: 'aes-256-gcm',
    kdf: KDF.name,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64')
  };
}

export function decryptEntries(payload: unknown, password: string): VaultEntry[] {
  requirePassword(password);
  if (!isEncryptedVaultPayload(payload)) {
    throw new Error('不是支持的加密数据文件');
  }

  const salt = Buffer.from(payload.salt, 'base64');
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const encrypted = Buffer.from(payload.data, 'base64');
  const key = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  try {
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    const entries = JSON.parse(decrypted.toString('utf-8'));
    if (!Array.isArray(entries)) {
      throw new Error('解密后的数据格式无效');
    }
    return entries as VaultEntry[];
  } catch {
    throw new Error('解密失败，请检查主密码或文件内容');
  }
}

export function readJsonFile(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function isEncryptedVaultPayload(payload: unknown): payload is EncryptedVaultPayload {
  if (!payload || typeof payload !== 'object') return false;
  const value = payload as Partial<EncryptedVaultPayload>;
  return value.secureVaultVersion === VAULT_VERSION && value.cipher === 'aes-256-gcm';
}
