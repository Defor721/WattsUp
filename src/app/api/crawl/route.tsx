import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let page;
  try {
    page = await browser.newPage();
    const url = "https://kpx.or.kr/main/#section-2";
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const smpAverage = await page.evaluate(() => {
      const table = document.querySelector("table");
      if (!table) return null;
      const rows = table.querySelectorAll("tr");
      const smpRow = rows[3];
      if (!smpRow) return null;
      const smpCell = smpRow.querySelectorAll("td");
      if (!smpCell) return null;
      return smpCell[smpCell.length - 1]?.textContent?.trim() || null;
    });

    const recValue = await page.evaluate(() => {
      const recTable = document.querySelector(
        ".power_item.item04 .table_style",
      );
      if (!recTable) return null;
      const recRows = recTable.querySelectorAll("tr");
      const recRow = recRows[1];
      if (!recRow) return null;
      const recCell = recRow.querySelectorAll("td");
      if (!recCell) return null;
      return recCell[0]?.textContent?.trim() || null;
    });

    return NextResponse.json({ smpAverage, recValue });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  } finally {
    if (page) await page.close();
    await browser.close();
  }
}
