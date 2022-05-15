import React, { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const Signout = () => {
  const Router = useRouter();
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing Out...</div>;
};

export default Signout;
