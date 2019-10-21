/*eslint no-restricted-globals: ["warn", "status"]*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withFormik, Form, useField } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components/macro';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

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

const CardInfoList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 1rem;
  margin-top: 2rem;
`;

const CardField = styled.div`
  display: flex;
  flex-direction: ${props => (props.checkbox ? 'row-reverse' : 'column')};
  align-items: ${props => (props.checkbox ? 'center' : 'normal')};
  justify-content: ${props => (props.checkbox ? 'flex-end' : 'normal')};
  margin-bottom: 1rem;
  padding: ${props => (props.select ? '1rem' : '0')};
  background: ${props => (props.select ? '#eee' : 'none')};

  label {
    margin-left: ${props => (props.checkbox ? '1rem' : '0')};
    margin-right: ${props => (props.checkbox ? '1rem' : '0')};
  }

  select {
    background: none;
    width: 100%;
    margin: 1rem 0;
    border: none;
    transition: border-bottom-color 0.25s ease-in;

    &:focus {
      outline: 0;
    }
  }
`;

const CardInput = styled.input`
  padding: 7px 0;
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
  const isSelect = props.type === 'select';
  const isCountry = field.name === 'country';
  const isState = field.name === 'state';
  const isRole = field.name === 'role';
  return (
    <CardField checkbox={isCheckbox} select={isSelect}>
      <label>{label}</label>
      {isRole ? (
        <select {...field} {...props}>
          <option value='' label='Select your role' />
          <option value='Project Manager' label='Project Manager' />
          <option value='UX Designer' label='UX Designer' />
          <option value='Frontend Developer' label='Frontend Developer' />
          <option value='Backend Developer' label='Backend Developer' />
          <option value='Fullstack Developer' label='Fullstack Developer' />
        </select>
      ) : null}
      {!isRole && !isState && !isCountry && <CardInput {...field} {...props} />}
      {isCountry ? <CountryDropdown {...field} {...props} /> : null}
      {isState ? <RegionDropdown {...field} {...props} /> : null}
      {meta.touched && meta.error ? <CardError>{meta.error}</CardError> : null}
    </CardField>
  );
};

const UserForm = ({ values, status, handleChange }) => {
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
            name='role'
            type='select'
            label='Role:'
            value={values.role}
          />
          <CustomField
            name='country'
            type='select'
            label='Country:'
            value={values.country}
            onChange={(_, e) => handleChange(e)}
          />
          <CustomField
            name='state'
            type='select'
            label='State:'
            country={values.country}
            value={values.state}
            onChange={(_, e) => handleChange(e)}
          />
          <CustomField
            name='acceptTerms'
            type='checkbox'
            label='Accept Terms of Service'
            checked={values.acceptTerms}
          />
          <CardButton type='submit'>Submit</CardButton>
        </Form>
      </CardWrapper>
      <CardInfoList>
        {users.map(user => (
          <CardWrapper key={user.id}>
            <figure>
              <p>
                Name: <span>{user.name}</span>
              </p>
              <p>
                Email: <span>{user.email}</span>
              </p>
              <p>
                Country: <span>{user.country}</span>
              </p>
              <p>
                State/Region: <span>{user.state}</span>
              </p>
              <p>
                Has accepted terms: <span>{String(user.acceptTerms)}</span>
              </p>
            </figure>
          </CardWrapper>
        ))}
      </CardInfoList>
    </>
  );
};

export default withFormik({
  mapPropsToValues({
    name,
    email,
    password,
    confirmPassword,
    role,
    country,
    state,
    acceptTerms,
  }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      confirmPassword: confirmPassword || '',
      role: role || '',
      country: country || 'United States',
      state: state || '',
      acceptTerms: acceptTerms || false,
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
    country: Yup.string().required(),
    state: Yup.string().required(),
    acceptTerms: Yup.boolean().oneOf(
      [true],
      'Must Accept Terms and Conditions',
    ),
  }),
  async handleSubmit(values, { setStatus, resetForm }) {
    try {
      const response = await axios.post('https://reqres.in/api/users/', values);
      console.log(response.data);
      setStatus(response.data);
      resetForm();
    } catch (err) {
      console.log(err.response);
    }
  },
})(UserForm);
