export const getFullNameValidationError = (value: string): string | null => {
  const fullName = value.trim();

  if (!fullName) {
    return 'Please enter your full name';
  }

  if (!/\p{L}/u.test(fullName) || /\d/.test(fullName)) {
    return 'Full name must contain letters only and cannot include numbers';
  }

  return null;
};
export const getEmailValidationError = (value: string): string | null => {
  const email = value.trim();
  const emailPattern = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;

  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address';
  }

  const [localPart] = email.split('@');
  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return 'Please enter a valid email address';
  }

  return null;
};
export const getMobileNumberValidationError = (value: string): string | null => {
  const mobileNumber = value.replace(/[\s()-]/g, '');

  if (!/^(?:(?:\+?91)|0)?[6-9]\d{9}$/.test(mobileNumber)) {
    return 'Please enter a valid 10-digit mobile number';
  }

  return null;
};