function getStatus(quantity) {
  if (quantity === 0) return "out of stock";
  if (quantity <= 2) return "low stock";
  return "available";
}

module.exports = { getStatus };
