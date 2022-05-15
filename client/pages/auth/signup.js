import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/useRequest';

const Signup = () => {
  const Router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => {
      Router.push('/');
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await doRequest();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="container" onSubmit={onSubmit}>
      <h1>Signup</h1>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          name="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {/* alerting password input errors */}
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default Signup;
