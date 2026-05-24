const fs = require('fs');
const { encryptEntries, decryptEntries, readJsonFile } = require('./crypto-vault');
const { parseBody, sendJson } = require('./http-utils');

async function handleApi(req, res) {
  try {
    const body = await parseBody(req);
    if (req.url === '/api/load') return loadVault(res, body);
    if (req.url === '/api/save') return saveVault(res, body);
    if (req.url === '/api/migrate') return migrateVault(res, body);
    sendJson(res, 404, { success: false, message: '接口不存在' });
  } catch (err) {
    sendJson(res, 400, { success: false, message: err.message });
  }
}

function loadVault(res, body) {
  if (!body.filePath || !fs.existsSync(body.filePath)) {
    return sendJson(res, 200, { success: true, data: [] });
  }
  const payload = readJsonFile(body.filePath);
  if (Array.isArray(payload)) throw new Error('检测到明文旧格式，请先使用迁移工具生成加密 JSON 文件');
  return sendJson(res, 200, { success: true, data: decryptEntries(payload, body.password) });
}

function saveVault(res, body) {
  if (!body.filePath) throw new Error('No path provided');
  fs.writeFileSync(body.filePath, JSON.stringify(encryptEntries(body.data || [], body.password), null, 2), 'utf-8');
  return sendJson(res, 200, { success: true });
}

function migrateVault(res, body) {
  if (!body.sourcePath || !body.targetPath) throw new Error('请填写源文件和目标文件路径');
  const legacyData = readJsonFile(body.sourcePath);
  if (!Array.isArray(legacyData)) throw new Error('源文件不是旧版明文数组 JSON');
  fs.writeFileSync(body.targetPath, JSON.stringify(encryptEntries(legacyData, body.password), null, 2), 'utf-8');
  return sendJson(res, 200, { success: true, count: legacyData.length });
}

module.exports = { handleApi };
