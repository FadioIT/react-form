/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Route, NavLink } from 'react-router-dom';
import ContactForm from './ContactForm';

const ContactList = ({ history }) => {
  const [contacts, setContacts] = useState({ ...DEFAULTS_CONTACTS });
  const addContact = contact => {
    const id =
      Object.keys(contacts).reduce((val, id) => Math.max(val, id), 0) + 1;

    setContacts({
      ...contacts,
      [id]: {
        id,
        ...contact,
      },
    });
    history.replace(`/advanced/${id}`);
  };

  const updateContact = contact => {
    setContacts(contacts => ({ ...contacts, [contact.id]: contact }));
  };

  return (
    <div
      style={{
        width: 650,
        height: 400,
        display: 'flex',
        border: '1px solid #ccc',
        borderRadius: 3,
        margin: 10,
      }}
    >
      <div
        style={{
          width: 300,
          flexShrink: 0,
          overflow: 'auto',
          borderRight: '1px solid #ccc',
        }}
      >
        <NavItem to="/advanced/new">New Contact</NavItem>
        {Object.values(contacts).map(({ firstName, lastName, id, job }) => (
          <NavItem to={`/advanced/${id}`} key={id}>
            <div style={{ fontSize: 18 }}>
              {firstName} <b>{lastName}</b>
            </div>
            <div style={{ fontSize: 12 }}>{job} </div>
          </NavItem>
        ))}
      </div>
      <Route path="/advanced/:id">
        {({ match }) => {
          if (!match) {
            return null;
          }

          const {
            params: { id },
          } = match;
          const isNew = id === 'new';
          const contact = contacts[id];

          return (
            <ContactForm
              key={id}
              value={contact}
              onSubmit={contact => {
                if (isNew) {
                  addContact(contact);
                } else {
                  updateContact(contact);
                }
              }}
            />
          );
        }}
      </Route>
    </div>
  );
};

export default ContactList;

const NavItem = ({ children, ...props }) => (
  <NavLink
    style={{
      textDecoration: 'none',
      color: '#333',
      padding: '10px 20px',
      borderBottom: '1px solid #ccc',
      display: 'block',
      position: 'relative',
    }}
    activeStyle={{ background: 'lightblue' }}
    {...props}
  >
    {children}
    <div
      style={{
        position: 'absolute',
        right: 10,
        top: '50%',
        borderRight: '2px solid black',
        borderBottom: '2px solid black',
        width: 10,
        height: 10,
        transform: 'rotate(-45deg) translateY(-50%)',
      }}
    />
  </NavLink>
);

const DEFAULTS_CONTACTS = {
  1: {
    id: 1,
    firstName: 'François',
    lastName: 'de Campredon',
    job: 'President',
  },
  2: {
    id: 2,
    firstName: 'Baptiste',
    lastName: 'Gaspari',
    job: 'Projects Director',
  },
  3: {
    id: 3,
    firstName: 'François',
    lastName: 'Germain',
    job: 'Software Architect',
  },
  4: {
    id: 4,
    firstName: 'Jeremy',
    lastName: 'De La Casa',
    job: 'Developper',
  },
  5: {
    id: 5,
    firstName: 'Alexandre',
    lastName: 'Arnoux',
    job: 'QA Manager',
  },
  6: {
    id: 6,
    firstName: 'Sylvie',
    lastName: 'Rua',
    job: "Director's assistant",
  },
};
