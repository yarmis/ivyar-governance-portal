import * as fs from "fs";
import * as path from "path";

const domains = [
  "F","G","H","I","J",
  "K","L","M","N","O",
  "P","Q","R","S","T",
  "U","V","W","X","Y","Z"
];

function generateDocuments(domain: string) {
  const names = [
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

  return names.map((name, index) => {
    const num = index + 1;
    return {
      code: `${domain}${num}`,
      key: `${domain}${num}`,
      name,
      path: `/governance/${domain}/${domain}${num}`,
      order: num
    };
  });
}

function generateMasterIndex() {
  const categories = domains.map((domain, index) => ({
    code: domain,
    name: domain,
    route: `/governance/${domain}`,
    order: index + 1,
    documents: generateDocuments(domain)
  }));

  const output = `import { GovernanceCategory } from "@/types/governance";

export const governanceMasterIndex: GovernanceCategory[] = ${JSON.stringify(categories, null, 2)};
`;

  const outputPath = path.join(process.cwd(), "data", "governance-master-index.ts");
  fs.writeFileSync(outputPath, output, "utf8");

  console.log("✔ governance-master-index.ts generated successfully");
}

generateMasterIndex();

