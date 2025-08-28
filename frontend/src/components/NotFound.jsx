// NotFound.jsx - 404 error boundary component for unmatched routes

import React from 'react';

/**
 * NotFound - Catch-all route component for handling invalid URLs
 * Provides user-friendly feedback when users navigate to non-existent routes
 * Uses inline styles for minimal styling without additional CSS dependencies
 * Typically used as the fallback route in React Router configuration
 */
const NotFound = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>404 - Page Not Found</h1>
    <p>Oops! This route doesn't exist.</p>
  </div>
);

export default NotFound;