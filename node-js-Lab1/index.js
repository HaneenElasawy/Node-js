const {
  addItem,
  destockItem,
  restockItem,
  editItem,
  deleteItem,
  listItems,
  summary,
} = require("./src/inventoryService");

const { requireArg, parsePositiveInt } = require("./src/validators");
const { printInventory, printMessage, printSummary } = require("./src/ui");

const [, , command, arg1, arg2] = process.argv;

if (command === "add") {
  const check = requireArg(arg1, 'Usage: node index.js add "ItemName"');
  if (!check.ok) return printMessage(check.message);
  const inv = addItem(arg1);
  return printInventory(inv);
}

if (command === "destock") {
  const check1 = requireArg(arg1, "Usage: node index.js destock <id> <quantity>");
  const check2 = requireArg(arg2, "Usage: node index.js destock <id> <quantity>");
  if (!check1.ok || !check2.ok) return printMessage(check1.message);

  const idRes = parsePositiveInt(arg1, "id");
  const qtyRes = parsePositiveInt(arg2, "quantity");
  if (!idRes.ok) return printMessage(idRes.message);
  if (!qtyRes.ok) return printMessage(qtyRes.message);

  const res = destockItem(idRes.value, qtyRes.value);
  if (!res.ok) return printMessage(res.message);
  return printInventory(res.inventory);
}

if (command === "restock") {
  const check1 = requireArg(arg1, "Usage: node index.js restock <id> <quantity>");
  const check2 = requireArg(arg2, "Usage: node index.js restock <id> <quantity>");
  if (!check1.ok || !check2.ok) return printMessage(check1.message);

  const idRes = parsePositiveInt(arg1, "id");
  const qtyRes = parsePositiveInt(arg2, "quantity");
  if (!idRes.ok) return printMessage(idRes.message);
  if (!qtyRes.ok) return printMessage(qtyRes.message);

  const res = restockItem(idRes.value, qtyRes.value);
  if (!res.ok) return printMessage(res.message);
  return printInventory(res.inventory);
}

if (command === "edit") {
  const check1 = requireArg(arg1, 'Usage: node index.js edit <id> "New Name"');
  const check2 = requireArg(arg2, 'Usage: node index.js edit <id> "New Name"');
  if (!check1.ok || !check2.ok) return printMessage(check1.message);

  const idRes = parsePositiveInt(arg1, "id");
  if (!idRes.ok) return printMessage(idRes.message);

  const res = editItem(idRes.value, arg2);
  if (!res.ok) return printMessage(res.message);
  return printInventory(res.inventory);
}

if (command === "delete") {
  const check = requireArg(arg1, "Usage: node index.js delete <id>");
  if (!check.ok) return printMessage(check.message);

  const idRes = parsePositiveInt(arg1, "id");
  if (!idRes.ok) return printMessage(idRes.message);

  const res = deleteItem(idRes.value);
  if (!res.ok) return printMessage(res.message);
  return printInventory(res.inventory);
}

if (command === "list") {
  const inv = listItems();
  return printInventory(inv);
}

if (command === "summary") {
  const s = summary();
  return printSummary(s);
}

printMessage("Invalid command.");
