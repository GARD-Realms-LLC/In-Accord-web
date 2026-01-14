import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name = 'mod', category = 'category' } = data;
    const safeModName = String(name).replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeCategory = String(category).replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${safeModName}-${safeCategory}.json`;
    const dir = path.resolve(process.cwd(), 'Submited Mods');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, file: fileName });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}
