import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest | any): string {
  // Handle NextAuth request object (different structure)
  if (request && typeof request.headers?.get !== 'function') {
    // NextAuth request format
    const headers = request.headers || {};
    
    // Check various headers that might contain the real IP
    const forwarded = headers['x-forwarded-for'];
    const realIP = headers['x-real-ip'];
    const cfConnectingIP = headers['cf-connecting-ip']; // Cloudflare
    
    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return Array.isArray(realIP) ? realIP[0] : realIP;
    }
    
    if (cfConnectingIP) {
      return Array.isArray(cfConnectingIP) ? cfConnectingIP[0] : cfConnectingIP;
    }
    
    // Fallback
    return headers['x-real-ip'] || headers['remote-addr'] || 'unknown';
  }
  
  // Standard NextRequest format
  if (request?.headers?.get) {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
    
    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (cfConnectingIP) {
      return cfConnectingIP;
    }
    
    // Fallback to request IP (might be proxy IP in production)
    return request.ip || 'unknown';
  }
  
  // Final fallback
  return 'unknown';
}