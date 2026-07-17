/**
 * Generates a unique employee ID string
 * @returns {string} ID in format 'EMP-1719876543210'
 */
export const generateEmployeeId = () => {
  return `EMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Formats a currency number into a standard locale string
 * @param {number} value
 * @returns {string} Formatted currency e.g. "$120,000"
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formats an ISO date string (YYYY-MM-DD) into a reader-friendly format
 * @param {string} dateStr
 * @returns {string} e.g. "Jan 15, 2024"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr + 'T00:00:00'); // avoid timezone shift
  if (isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Capitalizes the first letter of a string
 * @param {string} string 
 * @returns {string}
 */
export const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Returns the avatar image URL for an employee.
 * Always uses the user's own profile photo.
 * @param {string} name - Employee name (unused, kept for API compatibility)
 * @param {string} [avatar] - Custom avatar URL (ignored in favour of the local photo)
 * @returns {string}
 */
export const getAvatarUrl = (name, avatar) => {
  return '/user-img.webp';
};
