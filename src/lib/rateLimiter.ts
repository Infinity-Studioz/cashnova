interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime && (!entry.blockedUntil || now > entry.blockedUntil)) {
        this.store.delete(key);
      }
    }
  }

  private getKey(identifier: string, action: string): string {
    return `${action}:${identifier}`;
  }

  async checkRateLimit(
    identifier: string, // IP address or email
    action: 'login' | 'register' | 'password-reset',
    options: {
      maxAttempts: number;
      windowMs: number;
      blockDurationMs?: number;
    }
  ): Promise<{
    success: boolean;
    remaining: number;
    resetTime: number;
    blocked?: boolean;
    blockUntil?: number;
  }> {
    const key = this.getKey(identifier, action);
    const now = Date.now();
    const entry = this.store.get(key);

    // If no exi sting entry, create one
    if (!entry) {
      this.store.set(key, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      return {
        success: true,
        remaining: options.maxAttempts - 1,
        resetTime: now + options.windowMs,
      };
    }

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
        blocked: true,
        blockUntil: entry.blockedUntil,
      };
    }

    // Reset if window has expired
    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + options.windowMs;
      delete entry.blockedUntil;
      return {
        success: true,
        remaining: options.maxAttempts - 1,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > options.maxAttempts) {
      // Block for specified duration if provided
      if (options.blockDurationMs) {
        entry.blockedUntil = now + options.blockDurationMs;
      }
      
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
        blocked: !!options.blockDurationMs,
        blockUntil: entry.blockedUntil,
      };
    }

    return {
      success: true,
      remaining: options.maxAttempts - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Reset rate limit for a specific identifier and action
  resetRateLimit(identifier: string, action: 'login' | 'register' | 'password-reset') {
    const key = this.getKey(identifier, action);
    this.store.delete(key);
  }

  // Get current status without incrementing
  getRateLimitStatus(identifier: string, action: 'login' | 'register' | 'password-reset') {
    const key = this.getKey(identifier, action);
    const entry = this.store.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      return { count: 0, resetTime: 0 };
    }

    return { 
      count: entry.count, 
      resetTime: entry.resetTime,
      blocked: entry.blockedUntil ? now < entry.blockedUntil : false,
      blockUntil: entry.blockedUntil 
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Rate limiting configurations
export const rateLimitConfigs = {
  login: {
    maxAttempts: 5, // 5 failed attempts
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes after exceeding limit
  },
  register: {
    maxAttempts: 3, // 3 registration attempts
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 2 * 60 * 60 * 1000, // Block for 2 hours
  },
  passwordReset: {
    maxAttempts: 3, // 3 password reset attempts
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // Block for 1 hour
  },
};