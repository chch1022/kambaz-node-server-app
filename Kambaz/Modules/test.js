console.log("Testing imports...");

try {
  console.log("1. Testing schema import...");
  const schema = await import("./schema.js");
  console.log("✓ Schema imported successfully");

  console.log("2. Testing model import...");
  const model = await import("./model.js");
  console.log("✓ Model imported successfully");

  console.log("3. Testing dao import...");
  const dao = await import("./dao.js");
  console.log("✓ DAO imported successfully");

} catch (error) {
  console.error("❌ Import failed:", error);
}