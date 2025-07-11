import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conatctList.css'; // Make sure to import the styles
import { deleteContact, getContacts, type Contact } from '../services/contactServices';

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const navigate = useNavigate();

  const loadContacts = () => {
    const list = getContacts();
    setContacts(list);
  };

  const handleDelete = (id: string) => {
    deleteContact(id);
    loadContacts();
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <div className="contact-list-container">
      <h2 className="contact-list-heading">Saved Contacts</h2>

      {contacts.length === 0 ? (
        <p className="contact-list-empty">No contacts submitted yet.</p>
      ) : (
        <ul className="contact-list">
          {contacts.map(c => (
            <li key={c.id} className="contact-card">
              <div className="contact-name">{c.name}</div>
              <div>
                <strong>Email:</strong> {c.email}
              </div>
              <div>
                <strong>Phone:</strong> {c.phone || 'N/A'}
              </div>
              <div>
                <strong>Subject:</strong> {c.subject}
              </div>
              <div>
                <strong>Message:</strong> {c.message}
              </div>
              <div className="button-group">
                <button onClick={() => navigate(`/contact/${c.id}`)} className="btn edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(c.id)} className="btn delete-btn">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList;
