import type { User } from '@/store/userStore';

import React from 'react';


import { useUserStore } from '@/hooks/store/useUserStore';
const Main = (): JSX.Element => {
  const user = useUserStore((state) => state.user) as User;
  return <div>{JSON.stringify(user)}</div>;
};

export default Main;
