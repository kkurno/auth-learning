// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Database, User } from '../../backend/database'
import { encryptPassword, generateToken, readToken, validateToken } from '../../backend/utils';

type Data = {
  success: boolean;
  user?: User;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '';
    const isTokenValid = validateToken(token);
    if (!isTokenValid) return res.status(404).json({ success: false });
    const email = readToken(token);
    const user = Database.getUserByEmail({ email });
    if (!user) return res.status(404).json({ success: false, });
    return res.status(200).json({ success: true, user });
  }
  res.status(200).json({ success: true });
}
