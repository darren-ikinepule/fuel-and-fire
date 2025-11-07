// SocialPage.jsx - Brand social media hub with accessibility and performance optimizations

import React from 'react';
import '../stylesheets/social-page.css';

/**
 * SocialPage - Centralized social media landing page component
 * Implements accessibility best practices, security measures, and performance optimizations
 * Serves as a brand hub directing users to external social platforms
 */
const SocialPage = () => {
  const socialLinks = [
    {
      href: "https://www.facebook.com/login",
      label: "Facebook",
      title: "Facebook Login",
      initials: "F",
    },
    {
      href: "https://www.instagram.com/accounts/login",
      label: "Instagram",
      title: "Instagram Login",
      initials: "IG",
    },
    {
      href: "https://twitter.com/i/flow/login",
      label: "Twitter",
      title: "Twitter Login",
      initials: "X",
    },
    {
      href: "https://accounts.google.com/signin",
      label: "YouTube",
      title: "YouTube Login",
      initials: "YT",
    },
  ];

  return (
    <div className="social-page-container">
      <div className="social-card">
        <img
          src="/images/fuel-fire-logo.jpeg"
          alt="Fuel & Fire Logo"
          // Lazy loading optimization: Defers image loading until needed, improving initial page performance
          loading="lazy"
          className="social-logo"
        />
        <p className="social-tagline">Fast Food Burner</p>
        <div className="social-icons">
          {socialLinks.map(({ href, label, title, initials }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Login to ${label}`}
              title={title}
            >
              <span className="social-icon-letter" aria-hidden="true">
                {initials}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPage;