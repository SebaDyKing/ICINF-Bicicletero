export const formatRut = (value) => {
  let cleanValue = value.replace(/[^0-9kK]/g, "");

  if (cleanValue.length > 9) {
    cleanValue = cleanValue.slice(0, 9);
  }

  if (cleanValue.length < 2) return cleanValue;

  const body = cleanValue.slice(0, -1);
  const dv = cleanValue.slice(-1).toUpperCase();

  const bodyFormat = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${bodyFormat}-${dv}`;
};
