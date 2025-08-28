import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";

export const authOptions: AuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    
    // Email/Password Credentials
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Rate limiting for login attempts (using email as identifier)
          const { rateLimiter, rateLimitConfigs } = await import("@/lib/rateLimiter");
          
          const rateLimitResult = await rateLimiter.checkRateLimit(
            credentials.email.toLowerCase(), // Use email for user-specific limiting
            'login',
            rateLimitConfigs.login
          );

          if (!rateLimitResult.success) {
            if (rateLimitResult.blocked) {
              throw new Error("Too many failed login attempts. Account temporarily locked.");
            }
            throw new Error("Too many login attempts. Please try again later.");
          }

          const client = await dbConnect;
          const db = client.db();
          const users = db.collection('users');
          
          // Find user by email
          const user = await users.findOne({ 
            email: credentials.email.toLowerCase(),
            $or: [
              { provider: 'credentials' },
              { provider: 'dual' } // Allow dual provider accounts
            ]
          });

          if (!user) {
            throw new Error("No account found with this email");
          }

          // Check if account is active
          if (!user.isActive) {
            throw new Error("Account is deactivated");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Reset rate limit on successful login
          rateLimiter.resetRateLimit(credentials.email.toLowerCase(), 'login');

          // Return user object (without password)
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
            provider: user.provider,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],

  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Default: 7 days
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Default: 7 days
  },

  debug: true,

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const client = await dbConnect;
      const db = client.db();
      const users = db.collection("users");

      if (account?.provider === "google") {
        // Handle Google OAuth
        const existingUser = await users.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user for Google OAuth
          await users.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google',
            emailVerified: new Date(),
            preferences: {
              currency: 'NGN',
              theme: 'system',
              notifications: {
                email: true,
                push: true
              }
            },
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          // Handle account linking for existing users
          if (existingUser.provider === 'credentials') {
            // Link Google to existing credentials account
            await users.updateOne(
              { email: user.email },
              {
                $set: {
                  provider: 'dual',
                  image: user.image,
                  emailVerified: new Date(),
                  updatedAt: new Date()
                }
              }
            );
          } else if (existingUser.provider === 'google' || existingUser.provider === 'dual') {
            // Update existing Google account info
            await users.updateOne(
              { email: user.email },
              {
                $set: {
                  image: user.image,
                  emailVerified: new Date(),
                  updatedAt: new Date()
                }
              }
            );
          }
        }
      }

      // For credentials provider, user is already validated in authorize()
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.provider = account?.provider || 'credentials';
        
        // Check if this is a "remember me" session
        // We'll pass this through the authorize callback
        if (user.rememberMe) {
          token.rememberMe = true;
          // Extend token expiry for "remember me" sessions
          token.exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.provider = token.provider as string;
        session.rememberMe = token.rememberMe as boolean;
        
        // Add session expiry info
        session.expires = new Date(token.exp! * 1000).toISOString();
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful authentication
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};