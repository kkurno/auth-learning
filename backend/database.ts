export type User = { name: string; email: string; password: string; role: string; };

export class Database {
  private static _users: User[] = [
    { name: 'Pensiri', email: 'pensiri@orangecapinnovative.com', password: 'hashed_password_1234', role: 'normal user' }
  ];

  static getUser(param: { email: string, password: string }) {
    return Database._users.find(u => u.email === param.email && u.password === param.password);
  }

  static getUserByEmail(param: { email: string }) {
    return Database._users.find(u => u.email === param.email);
  }
}