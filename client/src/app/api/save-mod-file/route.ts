import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const json = formData.get('json');
    const file = formData.get('file');
    let fileName = 'mod-category.json';
    let modData = {};
    if (json && typeof json === 'string') {
      modData = JSON.parse(json);
      const safeModName = (modData.name || 'mod').replace(/[^a-zA-Z0-9-_]/g, '_');
      const safeCategory = (modData.category || 'category').replace(/[^a-zA-Z0-9-_]/g, '_');
      fileName = `${safeModName}-${safeCategory}.json`;
    }
    const dir = path.resolve(process.cwd(), 'Submited Mods');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const jsonPath = path.join(dir, fileName);
    fs.writeFileSync(jsonPath, JSON.stringify(modData, null, 2), 'utf-8');
    let savedFileName = null;
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name || 'attachment';
      const filePath = path.join(dir, originalName);
      fs.writeFileSync(filePath, buffer);
      savedFileName = originalName;
    }
    return NextResponse.json({ success: true, json: fileName, file: savedFileName });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}
