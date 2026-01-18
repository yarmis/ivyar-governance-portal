const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying IVYAR Smart Contracts...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy LandParcelRegistry
  console.log("\n📝 Deploying LandParcelRegistry...");
  const LandParcelRegistry = await hre.ethers.getContractFactory("LandParcelRegistry");
  const registry = await LandParcelRegistry.deploy();
  await registry.waitForDeployment();
  console.log("✅ LandParcelRegistry:", await registry.getAddress());
  
  // Deploy VeteranLandGrant
  console.log("\n🎖️  Deploying VeteranLandGrant...");
  const VeteranLandGrant = await hre.ethers.getContractFactory("VeteranLandGrant");
  const grant = await VeteranLandGrant.deploy();
  await grant.waitForDeployment();
  console.log("✅ VeteranLandGrant:", await grant.getAddress());
  
  // Deploy AntiCorruptionOracle
  console.log("\n🔐 Deploying AntiCorruptionOracle...");
  const AntiCorruptionOracle = await hre.ethers.getContractFactory("AntiCorruptionOracle");
  const oracle = await AntiCorruptionOracle.deploy();
  await oracle.waitForDeployment();
  console.log("✅ AntiCorruptionOracle:", await oracle.getAddress());
  
  console.log("\n🎉 Deployment Complete!");
  console.log("\n🇺🇦 Слава Україні!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
