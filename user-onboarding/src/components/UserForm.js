/*eslint no-restricted-globals: ["warn", "status"]*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withFormik, Form, useField } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components/macro';

const StyledForm = styled.form`
  align-self: center;
  width: 100%;
`;

const StyledEntry = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const StyledButton = styled.button`
  display: flex;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  overflow: hidden;

  > * {
    width: 100%;
  }
`;

const CardField = styled.div`
  display: flex;
  flex-direction: ${props => (props.checkbox ? 'row' : 'column')};
  align-items: ${props => (props.checkbox ? 'center' : 'normal')};
  margin-bottom: 1rem;
  label {
    margin-left: ${props => (props.checkbox ? '1rem' : 'none')};
  }
`;

const CardInput = styled.input`
  padding: 7px 0;
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid #ddd;
  border-left: 0;
  transition: border-bottom-color 0.25s ease-in;

  &:focus {
    border-bottom-color: #e5195f;
    outline: 0;
  }
`;

const CardCheckbox = styled.input.attrs({ type: 'checkbox' })``;

const CardError = styled.div`
  font-family: inherit;
  color: #e5195f;
  font-size: 12px;
`;

const CardButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.875rem 0;
  margin: 1rem 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: #e5195f;
  border: 0;
  border-radius: 35px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);

  &:hover {
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.16);
    transform: translate(0, -5px);
  }
`;

const CustomField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const isCheckbox = props.type === 'checkbox';
  return isCheckbox ? (
    <CardField checkbox>
      <CardCheckbox {...field} {...props} />
      <label>
        <span>{label}</span>
      </label>
      {meta.touched && meta.error ? <CardError>{meta.error}</CardError> : null}
    </CardField>
  ) : (
    <CardField>
      <label>
        {label}
        <CardInput {...field} {...props} />
      </label>
      {meta.touched && meta.error ? <CardError>{meta.error}</CardError> : null}
    </CardField>
  );
};

const UserForm = ({ values, status }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    status && setUsers(users => [...users, status]);
  }, [status]);
  return (
    <>
      <CardWrapper>
        <Form>
          <CustomField name='name' type='text' label='Name' />
          <CustomField name='email' type='email' label='Email' />
          <CustomField name='password' type='password' label='Password' />
          <CustomField
            name='confirmPassword'
            type='password'
            label='Confirm Password'
          />
          <CustomField
            name='terms'
            type='checkbox'
            label='Terms of Service'
            checked={values.terms}
          />
          <CardButton type='submit'>Submit</CardButton>
        </Form>
      </CardWrapper>
      {users.map(user => (
        <CardWrapper key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </CardWrapper>
      ))}
    </>
  );
};

export default withFormik({
  mapPropsToValues({ name, email, password, confirmPassword, terms }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      confirmPassword: confirmPassword || '',
      terms: terms || false,
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required(),
  }),
  async handleSubmit(values, { setStatus, resetForm }) {
    try {
      const response = await axios.post('https://reqres.in/api/users/', values);
      setStatus(response.data);
      resetForm();
    } catch (err) {
      console.log(err.response);
    }
  },
})(UserForm);
