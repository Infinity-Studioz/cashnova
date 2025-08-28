import { signIn, SignInOptions } from 'next-auth/react';

interface ExtendedSignInOptions extends Omit<SignInOptions, 'redirect'> {
  rememberMe?: boolean;
  redirect?: boolean;
}

export async function enhancedSignIn(
  provider: string,
  options: ExtendedSignInOptions = {}
) {
  const { rememberMe, ...signInOptions } = options;
  
  // Add rememberMe to the authorization params for Google OAuth
  if (provider === 'google' && rememberMe) {
    return signIn(provider, {
      ...signInOptions,
      redirect: false,
      // Google OAuth will use default session duration
      // To handle remember me through session callbacks later...
    });
  }
  
  // For credentials provider, to handle remember me in the authorize callback later
  if (provider === 'credentials') {
    return signIn(provider, {
      ...signInOptions,
      redirect: false,
    });
  }
  
  return signIn(provider, signInOptions);
}

// Utility to check session expiry and show warnings
export function getSessionExpiryInfo(session: any) {
  if (!session?.expires) return null;
  
  const expiryDate = new Date(session.expires);
  const now = new Date();
  const timeUntilExpiry = expiryDate.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(timeUntilExpiry / (1000 * 60 * 60 * 24));
  
  return {
    expiryDate,
    timeUntilExpiry,
    daysUntilExpiry,
    isExpiringSoon: daysUntilExpiry <= 7, // Show warning if expiring in 7 days
    isRemembered: session.rememberMe || false,
  };
}