import React from 'react';

import { Link } from 'react-router-dom';

const Index = (): JSX.Element => (
  <div>
    <Link to="/login" className="border">
      로그인
    </Link>
    <Link to="/signup" className="border">
      회원가입
    </Link>
    <Link to="/home" className="border">
      메인
    </Link>
  </div>
);

export default Index;
