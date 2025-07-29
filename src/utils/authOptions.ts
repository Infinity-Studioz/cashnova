import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/mongodb";

export const authOptions: AuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const client = await dbConnect;
      const db = client.db(); // optional: pass DB name if needed
      const users = db.collection("users");

      const existingUser = await users.findOne({ email: user.email });

      if (!existingUser) {
        await users.insertOne({
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: new Date(),
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
