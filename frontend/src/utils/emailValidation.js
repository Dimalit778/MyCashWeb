export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address",
  },
  validate: {
    notAdmin: (value) => {
      return !value.toLowerCase().includes("admin") || 'Email cannot contain word "admin"';
    },
    notTest: (value) => {
      return !value.toLowerCase().includes("test") || 'Email cannot contain word "test"';
    },
    validDomain: (value) => {
      const domain = value.split("@")[1];
      const validDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
      return validDomains.includes(domain) || "Please use a valid email ";
    },
  },
};
