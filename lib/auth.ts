import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
    newUser: "/onboarding",
    error: "/auth",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const client = await clientPromise;
        const db = client.db();

        await db.collection("user").updateOne(
          { email: user.email },
          {
            $set: {
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: account?.providerAccountId,
              updatedAt: new Date(),
            },
            $setOnInsert: {
              role: null,
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );

        return true;
      } catch (err) {
        console.error("Sign-in database sync error:", err);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user && user.email) {
        try {
          const client = await clientPromise;
          const db = client.db();
          const dbUser = await db.collection("user").findOne({ email: user.email });

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role || null;
            token.picture = dbUser.image || user.image;
          }
        } catch (err) {
          console.error("JWT sync error:", err);
        }
      }

      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role || null;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
};
