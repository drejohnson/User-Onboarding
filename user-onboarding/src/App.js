import React from 'react';
import styled from 'styled-components/macro';

import GlobalStyles from './style/Global';
import UserForm from './components/UserForm';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <Wrapper>
        <h1>User Onboarding Form</h1>
        <UserForm />
      </Wrapper>
    </>
  );
}

export default App;
