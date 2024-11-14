export const isValidEmail = (email) => {
  const re = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
  return re.test(email);
};

export const isStrongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const getPasswordStrength = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = 0;
  if (hasUpperCase) {
    strength += 1;
  }
  if (hasLowerCase) {
    strength += 1;
  }
  if (hasNumbers) {
    strength += 1;
  }
  if (hasSpecialChar) {
    strength += 1;
  }

  return strength;
};

export const isValidName = (name) => {
  const re = /^[a-zA-Z\s]*$/;
  return re.test(name);
};

export const isValidUsername = (username) => {
  const re = /^[a-zA-Z0-9]*$/;
  return re.test(username);
};

export const isValidUrl = (url) => {
  const re = /^(http|https):\/\/[^ "]+$/;
  return re.test(url);
};

export const isValidStreetAddress = (address) => {
  const re = /^[a-zA-Z0-9\s,.'-]*$/;
  return re.test(address);
};

export const isValidCity = (city) => {
  const re = /^[a-zA-Z\s]*$/;
  return re.test(city);
};

export const isValidZipCode = (zipCode) => {
  const re = /^\d{5}(-\d{4})?$/;
  return re.test(zipCode);
};

export const isValidPhoneNumber = (phoneNumber) => {
  const re = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
  return re.test(phoneNumber);
};
