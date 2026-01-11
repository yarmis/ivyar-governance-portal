import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function generatePDF() {
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // URL порталу (локальний dev-сервер)
  await page.goto("http://localhost:3000/governance", {
    waitUntil: "networkidle"
  });

  await page.pdf({
    path: path.join(pdfDir, "governance.pdf"),
    format: "A4",
    printBackground: true
  });

  await browser.close();

  console.log("✔ PDF generated successfully");
}

generatePDF();

