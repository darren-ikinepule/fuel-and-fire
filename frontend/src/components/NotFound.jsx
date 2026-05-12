// NotFound.jsx - 404 error boundary component for unmatched routes

import React from 'react';

const NotFound = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>404 - Page Not Found</h1>
    <p>Oops! This route doesn't exist.</p>
  </div>
);

export default NotFound;