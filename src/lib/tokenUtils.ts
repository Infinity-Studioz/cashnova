import crypto from 'crypto';

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function generatePasswordResetToken(): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} {
  // Generate random token
  const token = generateSecureToken(32);
  
  // Hash the token for database storage (security best practice)
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // Set expiration to 1 hour from now
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  return {
    token, // Send this to user via email
    hashedToken, // Store this in database
    expiresAt
  };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}