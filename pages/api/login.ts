// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Database, User } from '../../backend/database'
import { encryptPassword, generateToken } from '../../backend/utils';

type Data = {
  success: boolean;
  user?: User;
  token?: string;
  error_code?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const encryptedPassword = encryptPassword(password);

    const user = Database.getUser({ email, password: encryptedPassword });

    if (!user) return res.status(404).json({ success: false, error_code: 'USER_NOT_FOUND' });

    const generatedToken = generateToken(user);

    res.status(200).json({ success: true, user, token: generatedToken });
  }
  res.status(404).json({ success:false, error_code: 'API_NOT_FOUND' });
}
