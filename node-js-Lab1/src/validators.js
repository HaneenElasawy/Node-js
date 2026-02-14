function requireArg(value, usage) {
  if (value === undefined || value === null || value === "") {
    return { ok: false, message: usage };
  }
  return { ok: true };
}

function parsePositiveInt(value, label) {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    return { ok: false, message: `Invalid ${label}.` };
  }
  return { ok: true, value: num };
}

module.exports = { requireArg, parsePositiveInt };
