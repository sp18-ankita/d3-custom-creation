import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-page__container">
        <div className="not-found-page__illustration">
          <div className="not-found-page__404">404</div>
          <div className="not-found-page__icon">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="9" r="9" fill="none" stroke="#64748b" strokeWidth="2" />
              <path
                d="m21 21-4.35-4.35"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="not-found-page__content">
          <h1 className="not-found-page__title">Page Not Found</h1>

          <p className="not-found-page__message">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or
            you entered the wrong URL.
          </p>

          <div className="not-found-page__suggestions">
            <h3>Here are some suggestions:</h3>
            <ul>
              <li>Check the URL for typos</li>
              <li>Go back to the previous page</li>
              <li>Visit our homepage</li>
              <li>Use the navigation menu</li>
            </ul>
          </div>

          <div className="not-found-page__actions">
            <Link to="/" className="not-found-page__button not-found-page__button--primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="9,22 9,12 15,12 15,22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Go Home
            </Link>

            <button
              className="not-found-page__button not-found-page__button--secondary"
              onClick={() => window.history.back()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m12 19-7-7 7-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 12H5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Go Back
            </button>

            <Link to="/about" className="not-found-page__button not-found-page__button--secondary">
              Learn More
            </Link>
          </div>

          <div className="not-found-page__nav-links">
            <h3>Quick Navigation</h3>
            <div className="not-found-page__nav-grid">
              <Link to="/" className="not-found-page__nav-link">
                <div className="not-found-page__nav-icon">🏠</div>
                <span>Home</span>
              </Link>
              <Link to="/about" className="not-found-page__nav-link">
                <div className="not-found-page__nav-icon">ℹ️</div>
                <span>About</span>
              </Link>
              <Link to="/contacts" className="not-found-page__nav-link">
                <div className="not-found-page__nav-icon">📱</div>
                <span>Contacts</span>
              </Link>
              <Link to="/contacts/new" className="not-found-page__nav-link">
                <div className="not-found-page__nav-icon">➕</div>
                <span>Add Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
