function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate value", details: err.keyValue });
  }

  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation error", details });
  }

  console.error(err);
  res.status(500).json({ message: "Server error" });
}

module.exports = errorHandler;
