import { useEffect, useState } from 'react';
import { User } from '../backend/database';
import api from './api';
import { accessTokenHandler } from './local-storage';

// should be context
const useMe = () => {
  const [meContext, setMeContext] = useState<{ isInitialized: boolean; me: User | null }>({ isInitialized: false, me: null });
  return {
    meContext,
    setMeContext,
  };
};

export const withPageAuth = (Page: React.FC<any>, options?: { isNotRequiredAuth?: boolean, allowedRoles?: string[] }) => {
  const PageWithPage = (props: any) => {
    // TODO: handle authentication and authorization
    const { meContext, setMeContext } = useMe();
    useEffect(() => {
      const token = accessTokenHandler.get();
      if (!token) {
        setMeContext({ isInitialized: true, me: null });
        return () => {};
      };
      api.get<{ user: User }>('/me')
        .then(res => {
          if (!res.success) {
            setMeContext({ isInitialized: true, me: null });
            return;
          }
          console.log(options, res.user);
          if (options?.allowedRoles && !options.allowedRoles.includes(res.user.role)) {
            setMeContext({ isInitialized: true, me: null });
            return;
          }
          setMeContext({ isInitialized: true, me: res.user });
        });
      return () => {};
    }, []);
    if (options?.isNotRequiredAuth) return <Page {...props} />;
    if (!meContext.isInitialized) return <div>Loading...</div>; // TODO: loading page component
    if (!meContext.me) return <div>UnAuthenticated</div>; // TODO: error page component or redirect to login page
    return <Page {...props} />
  };
  return PageWithPage;
};
