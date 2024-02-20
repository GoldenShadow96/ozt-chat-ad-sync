const activeDirectory = require('activedirectory2');

// TypeScript interface for user data
interface User {
    id: string;
    name: string;
    // Add other relevant user properties
  }
const ad = new activeDirectory({
    url: 'ldap://<computername>.ozt.chat', // Replace with your actual AD server URL
    baseDN: 'ozt.chat', // Replace with your base DN
});
  // TypeScript function for Active Directory authentication
  async function authenticateWithAD(username: string, password: string): Promise<User | null> {
    const activeDirectory = require('activedirectory2');
  
    try {
      // Configure Active Directory connection

      // Authenticate user
      const user = await ad.authenticate(username, password);
      if (user) {
        // Map user data from AD to your User interface
        return {
          id: user.sAMAccountName,
          name: user.displayName,
          // Add other relevant user properties
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('AD authentication error:', error);
      return null;
    } finally {
      // Close connection to AD
      ad.close();
    }
  }
  
  // Example usage (replace with your authentication logic)
  async function handleRequest(req: any, res: any) {
    const credentials = req.headers.authorization?.split(' ')[1]; // Assuming Basic auth
  
    if (!credentials) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const [username, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':');
  
    const authenticatedUser = await authenticateWithAD(username, password);
  
    if (authenticatedUser) {
      console.log('Authenticated user:', authenticatedUser);
      // Handle successful authentication (e.g., send data, redirect)
    } else {
      console.log('Invalid credentials');
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
  
  // Next.js API route for authentication
  export default async function handler(req: any, res: any) {
    await handleRequest(req, res);
  }