// src/components/ContactForm.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/styles/contactForm.css';
import { logPageView, logUserAction } from '../monitoring';
import {
  useAddContact,
  useGetContactById,
  useUpdateContact,
  type Contact,
} from '../services/contactServices';
import ErrorBoundary from './ErrorBoundary';

const initialState: Omit<Contact, 'id'> = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
};

const ContactForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const isEdit = !!id;

  const getContact = useGetContactById();
  const addContactMutation = useAddContact();
  const updateContactMutation = useUpdateContact();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const existing = await getContact.execute(id!);
        if (existing) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: contactId, ...rest } = existing;
          setFormData(rest);
        } else {
          alert('Contact not found!');
          navigate('/contacts/new');
        }
      })();
    }
  }, [id, isEdit, navigate, getContact]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name) errs.name = 'Full name is required';
    if (!formData.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email format';
    }
    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
      errs.phone = 'Invalid phone number';
    }
    if (!formData.subject) errs.subject = 'Subject is required';
    if (!formData.message) {
      errs.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errs.message = 'Message should be at least 10 characters';
    }
    if (!formData.consent) errs.consent = 'Consent is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let result: Contact | null = null;
    if (isEdit) {
      result = await updateContactMutation.execute(id!, formData);
    } else {
      result = await addContactMutation.execute(formData);
    }

    if (!result) {
      setErrors({ email: 'Email must be unique' });
      return;
    }

    logUserAction('Form Submission Attempted', {
      mode: isEdit ? 'edit' : 'create',
      contactId: id,
    });

    let result: Contact | null = null;
    try {
      if (isEdit) {
        result = await updateContact(id!, formData);
      } else {
        result = await addContact(formData);
      }

      if (!result) {
        setErrors({ email: 'Email must be unique' });
        logUserAction('Form Submission Failed', {
          mode: isEdit ? 'edit' : 'create',
          reason: 'duplicate email',
        });
        return;
      }

      logUserAction('Form Submission Successful', {
        mode: isEdit ? 'edit' : 'create',
        contactId: result.id,
      });

      setSubmitted(true);
      setTimeout(() => navigate('/contacts'), 1200);
    } catch (error) {
      logUserAction('Form Submission Failed', {
        mode: isEdit ? 'edit' : 'create',
        error: String(error),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (submitted) {
    return (
      <ErrorBoundary pageName="Contact Success">
        <div className="contact-success">
          {isEdit ? 'Contact updated!' : 'Thank you for contacting us!'}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary pageName={isEdit ? 'Contact Edit' : 'Contact Form'}>
      <form onSubmit={handleSubmit} className="contact-form">
        <h2>{isEdit ? 'Edit Contact' : 'Contact Us'}</h2>

        {[
          { label: 'Full Name', name: 'name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone (optional)', name: 'phone', type: 'text' },
          { label: 'Subject', name: 'subject', type: 'text' },
        ].map(({ label, name, type }) => (
          <div className="form-group" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type={type}
              id={name}
              name={name}
              data-testid={name}
              value={
                typeof formData[name as keyof typeof formData] === 'boolean'
                  ? ''
                  : String(formData[name as keyof typeof formData] ?? '')
              }
              onChange={handleChange}
            />
            {errors[name] && <p className="error-text">{errors[name]}</p>}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            data-testid="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
          />
          {errors.message && <p className="error-text">{errors.message}</p>}
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="consent"
              data-testid="consent"
              checked={formData.consent}
              onChange={handleChange}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            />
            <span>I agree to be contacted</span>
          </label>
          {errors.consent && <p className="error-text">{errors.consent}</p>}
        </div>

        <button type="submit" className="submit-button">
          {isEdit ? 'Update Contact' : 'Submit Message'}
        </button>
      </form>
    </ErrorBoundary>
  );
};

export default ContactForm;
