export const generateRandomUsername = (length = 8) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let username = '';
  for (let i = 0; i < length; i++) {
    username += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return username;
};

export const generateRandomEmail = (username) => {
  const domains = ['example.com', 'test.com', 'sample.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

export const generateRandomPassword = (length = 12) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return password;
};

export const generateRandomName = () => {
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie'];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

export const generateUserInfo = () => {
  const username = generateRandomUsername();
  const email = generateRandomEmail(username);
  const password = generateRandomPassword();
  const name = generateRandomName();

  return {
    username,
    email,
    password,
    name,
  };
};
