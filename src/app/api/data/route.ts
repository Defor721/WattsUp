import path from "path";
import fs from "fs";

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

// GET 요청 핸들러
export async function GET(
  request: Request,
  { params }: { params: { filename: string } },
) {
  try {
    const { filename } = params;

    // 파일 경로 설정 (public/assets)
    const filePath = path.join(
      process.cwd(),
      "public",
      "assets",
      `${filename}.xlsx`,
    );

    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Excel 파일 읽기
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // 첫 번째 시트를 JSON 형태로 변환
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // JSON 데이터 반환
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
