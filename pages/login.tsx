import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import api from '../features/api';
import { accessTokenHandler } from '../features/local-storage';

const Login: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: '', password: '' });
  const [hasError, setHasError] = useState(false);
  const onSubmit = async () => {
    setHasError(false);
    const res = await api.post<{ token: string }>('/login', {
      body: { email: data.email, password: data.password },
    });
    if (!res.success) {
      setHasError(true);
      return;
    }
    accessTokenHandler.set(res.token);
    router.push('/dashboard');
  };
  return (
    <form>
      <p>Email: </p>
      {<input value={data.email} onChange={e => setData((prev) => ({ ...prev, email: e.target.value }))} />}
      <p>Password: </p>
      {<input value={data.password} onChange={e => setData((prev) => ({ ...prev, password: e.target.value }))} />}
      {hasError && (
        <p>Something went wrong</p>
      )}
      <button type="button" onClick={onSubmit}>Submit</button>
    </form>
  )
}

export default Login
