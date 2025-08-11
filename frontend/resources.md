## website to get calories
https://www.fatsecret.co.nz/calories-nutrition/search?q=large%20fries

https://excalidraw.com/#json=EW9luAZ7e9D4VEuyxjv52,_Dr_5PkVjuKfUJfWqpvxiw

https://fuel-and-fire.onrender.com //backend
https://fuel-and-fire-htsk.vercel.app //frontend
https://dashboard.uptimerobot.com/monitors //helps with faster loading by keeping it live every 5mins
const response = await fetch(`${import.meta.env.VITE_API_URL}/food-items`);
 
## Security Recommendations for the Fuel & Fire App
1. User Authentication and Account Security
Hashing Passwords/PINs with bcrypt: As you've already identified, this is crucial. bcrypt is specifically designed to be slow, which makes it extremely difficult for attackers to guess passwords through brute-force attacks, even if they steal your database. Never store user passwords or PINs in plain text.

Secure Session Management: After a user logs in, the server should create a secure session token (like a JWT or a randomly generated session ID). This token should be sent to the user's browser, stored securely (e.g., in an HttpOnly cookie), and used to authenticate subsequent requests. The token should have a short expiration time and be invalidated on logout.

Rate Limiting on Login Attempts: Implement a system that limits the number of login attempts from a single IP address or user account. This prevents automated scripts from trying thousands of passwords (brute-force attacks) in a short period.

Two-Factor Authentication (2FA): For enhanced security, consider offering users the option to enable 2FA. This requires a second form of verification (like a code from their phone) in addition to their password.

2. Data Security and Integrity
HTTPS (SSL/TLS): Ensure all communication between your user's browser and your server is encrypted using HTTPS. This prevents "man-in-the-middle" attacks where an attacker could intercept and read sensitive data like passwords, calorie counts, or exercise logs.

Input Validation (Front-end and Back-end): This is a two-pronged defense.

Front-end validation provides a good user experience by giving immediate feedback (e.g., "Please enter a valid calorie count").

Back-end validation is the true security gate. It must be implemented on the server-side to ensure all incoming data is clean and safe, regardless of what the front-end sends. This prevents malformed data from corrupting your database or causing application errors.

Sanitization and Escaping (Preventing XSS): If your app allows users to create content that is displayed to other users (e.g., a shared workout plan with a description), you must sanitize or escape that input. XSS attacks inject malicious code into your web pages. Using a library to sanitize user input before it's displayed will strip out any harmful scripts, protecting your users.

3. Server and API Security
API Security: If your front-end communicates with a back-end API, ensure that all API endpoints are properly secured. Use token-based authentication (like JWTs) to verify that every request comes from an authenticated and authorized user. The API should only return data that the specific user is permitted to see.

Secure Database Practices: Use parameterized queries or Object-Relational Mappers (ORMs) to interact with your database. This is the primary defense against SQL Injection attacks, which occur when an attacker inserts malicious SQL code into input fields to manipulate or steal data.

Regular Updates and Dependency Management: Keep all your software dependencies (libraries, frameworks, etc.) up to date. Security vulnerabilities are often discovered in older versions of software, and updating regularly is the best way to patch those weaknesses.

Environment Variables: Never hard-code sensitive information (like database passwords, API keys, or secret keys) directly into your code. Store them in environment variables and access them securely on your server.

4. General Best Practices
Principle of Least Privilege: Give your application and database users only the permissions they absolutely need to function. This minimizes the potential damage if an account is ever compromised.

Security Audits: As your project grows, consider running security audits or using automated tools to scan your code for potential vulnerabilities.