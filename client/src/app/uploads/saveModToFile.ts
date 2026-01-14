import fs from 'fs';
import path from 'path';

export function saveModToFile(form: any, attachedFile?: File) {
  const safeModName = (form.name || 'mod').replace(/[^a-zA-Z0-9-_]/g, '_');
  const safeCategory = (form.category || 'category').replace(/[^a-zA-Z0-9-_]/g, '_');
  const fileName = `${safeModName}-${safeCategory}.json`;
  const dir = path.resolve(process.cwd(), 'Submited Mods');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(form, null, 2), 'utf-8');

  if (attachedFile) {
    const fileSavePath = path.join(dir, attachedFile.name);
    // In a real Node.js environment, you would use fs.writeFileSync(fileSavePath, attachedFileBuffer)
    // Here, you would need to handle the file upload on the server side.
  }
  return filePath;
}
