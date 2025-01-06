import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const url = "https://kpx.or.kr/main/#section-2";
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // SMP 평균가 가져오기
    const smpAverage = await page.evaluate(() => {
      const table = document.querySelector("table");
      if (!table) return null;
      const rows = table.querySelectorAll("tr");
      const smpRow = rows[3]; // 4번째 행
      if (!smpRow) return null; // smpRow가 null인지 확인
      const smpCell = smpRow.querySelectorAll("td");
      if (!smpCell) return null; // smpCell이 null인지 확인
      return smpCell[smpCell.length - 1]?.textContent?.trim() || null;
    });

    // REC 평균가 가져오기
    const recValue = await page.evaluate(() => {
      const recTable = document.querySelector(
        ".power_item.item04 .table_style",
      ); // REC 테이블 선택
      if (!recTable) return null;
      const recRows = recTable.querySelectorAll("tr");
      const recRow = recRows[1]; // 2번째 행
      if (!recRow) return null; // recRow가 null인지 확인
      const recCell = recRow.querySelectorAll("td");
      if (!recCell) return null; // recCell이 null인지 확인
      return recCell[0]?.textContent?.trim() || null;
    });

    await browser.close();

    return NextResponse.json({ smpAverage, recValue });
  } catch (error: unknown) {
    // Error 타입 캐스팅
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch data", details: message },
      { status: 500 },
    );
  }
}
