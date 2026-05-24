export interface VaultEntry {
  id: number;
  site: string;
  username: string;
  password: string;
}

export interface EncryptedVaultPayload {
  secureVaultVersion: 2;
  cipher: 'aes-256-gcm';
  kdf: 'scrypt';
  salt: string;
  iv: string;
  tag: string;
  data: string;
}

export interface LoadVaultRequest {
  filePath: string;
  password: string;
}

export interface SaveVaultRequest {
  filePath: string;
  data: VaultEntry[];
  password: string;
}

export interface MigrateVaultRequest {
  sourcePath: string;
  targetPath: string;
  password: string;
}

export interface SaveVaultResponse {
  success: boolean;
  message?: string;
}

export interface MigrateVaultResponse {
  success: boolean;
  count: number;
}
