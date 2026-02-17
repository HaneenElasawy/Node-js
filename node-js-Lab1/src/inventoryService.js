const { loadInventory, saveInventory } = require("./storage");

function getStatus(qty) {
  if (qty > 2) return "available";
  if (qty > 0) return "low stock";
  return "out of stock";
}

function findItemById(inventory, id) {
  return inventory.find((i) => i.id === id);
}

function nextId(inventory) {
  const maxId = inventory.reduce((m, i) => (i.id > m ? i.id : m), 0);
  return maxId + 1;
}

function addItem(name, quantity = 1, category = "General") {
  const inventory = loadInventory();
  const newItem = { id: nextId(inventory), name, quantity, category };
  inventory.push(newItem);
  saveInventory(inventory);
  return inventory;
}

function destockItem(id, quantity) {
  const inventory = loadInventory();
  const item = findItemById(inventory, id);
  if (!item) return { ok: false, message: `Item with ID ${id} not found.` };
  if (item.quantity < quantity)
    return {
      ok: false,
      message: `Not enough stock. Current quantity: ${item.quantity}`,
    };
  item.quantity -= quantity;
  saveInventory(inventory);
  return { ok: true, inventory };
}

function restockItem(id, quantity) {
  const inventory = loadInventory();
  const item = findItemById(inventory, id);
  if (!item) return { ok: false, message: `Item with ID ${id} not found.` };
  item.quantity += quantity;
  saveInventory(inventory);
  return { ok: true, inventory };
}

function editItem(id, newName) {
  const inventory = loadInventory();
  const item = findItemById(inventory, id);
  if (!item) return { ok: false, message: `Item with ID ${id} not found.` };
  item.name = newName;
  saveInventory(inventory);
  return { ok: true, inventory };
}

function deleteItem(id) {
  const inventory = loadInventory();
  const before = inventory.length;
  const updated = inventory.filter((i) => i.id !== id);
  if (updated.length === before)
    return { ok: false, message: `Item with ID ${id} not found.` };
  saveInventory(updated);
  return { ok: true, inventory: updated };
}

function listItems() {
  const inventory = loadInventory();
  return inventory;
}

function summary() {
  const inventory = loadInventory();
  let totalQty = 0;
  let available = 0;
  let low = 0;
  let out = 0;

  for (const item of inventory) {
    totalQty += item.quantity;
    const s = getStatus(item.quantity);
    if (s === "available") available++;
    else if (s === "low stock") low++;
    else out++;
  }

  return {
    totalItems: inventory.length,
    totalQuantity: totalQty,
    available,
    low,
    out,
  };
}

module.exports = {
  getStatus,
  addItem,
  destockItem,
  restockItem,
  editItem,
  deleteItem,
  listItems,
  summary,
};
