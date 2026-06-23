import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "text" },
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, phone, otp } = credentials;

        // Accepting '123456' or any 6-digit OTP for testing convenience
        if (otp !== "123456" && otp !== "000000" && otp.length !== 6) {
          throw new Error("Invalid OTP. Use '123456' for testing.");
        }

        try {
          let user = null;
          if (email) {
            user = await prisma.user.upsert({
              where: { email },
              update: {},
              create: {
                email,
                name: email.split("@")[0],
                role: "CUSTOMER",
              },
            });
          } else if (phone) {
            user = await prisma.user.findFirst({
              where: { phone },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  phone,
                  name: `User ${phone.slice(-4)}`,
                  role: "CUSTOMER",
                },
              });
            }
          }

          if (!user) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (e) {
          console.warn("DB Auth query failed, falling back to mock user:", e);
          return {
            id: "mock-user-id",
            name: email ? email.split("@")[0] : `User ${phone?.slice(-4)}`,
            email: email || `${phone}@novamart.in`,
            role: "CUSTOMER",
          };
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "novamart-secret-key-123456",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
