const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "inventory.json");

function loadInventory() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const content = fs.readFileSync(DATA_FILE, "utf-8").trim();
  if (!content) return [];
  return JSON.parse(content);
}

function saveInventory(inventory) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(inventory, null, 2));
}

module.exports = { loadInventory, saveInventory };
