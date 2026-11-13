export const getFarmerNameError = (value: string): string =>
  value.trim() && /\p{L}/u.test(value) ? '' : 'Please enter a valid farmer name.';

// Native date inputs use local calendar values, not UTC dates.
export const localDateMinimum = (withTime = false, now = new Date()): string => {
  const date = new Date(now);
  if (withTime) date.setMinutes(date.getMinutes() + 1, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return withTime ? `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}` : day;
};

export const getBookingDateError = (value: string, withTime = false): string => {
  if (!value) return '';
  const parsed = new Date(withTime ? value : `${value}T00:00:00`);
  const invalid = !Number.isFinite(parsed.getTime()) || (withTime
    ? parsed.getTime() <= Date.now()
    : value < localDateMinimum());
  return invalid ? (withTime ? 'Please select a future date and time.' : 'Please select today or a future date.') : '';
};
