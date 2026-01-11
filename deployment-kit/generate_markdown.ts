import fs from "fs";
import path from "path";

const DOMAINS = [
  "F","G","H","I","J",
  "K","L","M","N","O",
  "P","Q","R","S","T",
  "U","V","W","X","Y","Z"
];

const DOC_NAMES = [
  "Start",
  "Overview",
  "Structure",
  "Roles",
  "Processes",
  "Guidelines",
  "Standards",
  "Models",
  "Review",
  "Final"
];

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateMarkdown() {
  const baseDir = path.join(process.cwd(), "content", "governance");
  ensureDir(baseDir);

  DOMAINS.forEach(domain => {
    const domainDir = path.join(baseDir, domain);
    ensureDir(domainDir);

    DOC_NAMES.forEach((name, index) => {
      const num = index + 1;
      const filePath = path.join(domainDir, `${domain}${num}.md`);

      // Не перезаписуємо, якщо файл вже існує
      if (fs.existsSync(filePath)) {
        return;
      }

      const content = `# ${domain}${num} — ${name}

This document is part of the IVYAR Governance Corpus.

- **Domain:** ${domain}
- **Document:** ${domain}${num}
- **Title:** ${name}

Generated automatically.
`;

      fs.writeFileSync(filePath, content, "utf8");
    });
  });

  console.log("✔ All markdown documents generated successfully");
}

generateMarkdown();

