const { getStatus } = require("./inventoryService");

function printInventory(inventory) {
  console.table(inventory.map((i) => ({ ...i, status: getStatus(i.quantity) })));
}

function printMessage(msg) {
  console.log(msg);
}

function printSummary(s) {
  console.table([
    { metric: "Total items", value: s.totalItems },
    { metric: "Total quantity", value: s.totalQuantity },
    { metric: "Available items", value: s.available },
    { metric: "Low stock items", value: s.low },
    { metric: "Out of stock items", value: s.out },
  ]);
}

module.exports = { printInventory, printMessage, printSummary };
