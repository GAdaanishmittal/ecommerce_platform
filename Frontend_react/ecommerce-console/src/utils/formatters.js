export const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'INR 0.00';
  return `INR ${amount.toFixed(2)}`;
};
