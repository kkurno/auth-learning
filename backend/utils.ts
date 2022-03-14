export const encryptPassword = (rawPassword: string) => {
  return `hashed_password_${rawPassword}`;
};

export const generateToken = (user: { email: string }) => {
  return `token_${user.email}`;
};

export const validateToken = (token: string) => {
  return token.startsWith('token_');
};

export const readToken = (token: string) => {
  return token.replace('token_', '');
};

// export const fetchLogin = (param: { email: string; password: string; }) => {
//   const user = database.users.find(u => u.email === param.email && u.password === decryptPassword(param.password));
//   if (user) {
//     const generatedToken = generateToken(user);
//     return {
//       success: true,
//       user,
//       token: generatedToken,
//     };
//   }
// };

// export const fetchGetDashbaordData = () => {
//   const tokenFromLocalStorage = localStorage.getItem('projectId_accessToken');
// }
