import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../src/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user?.email) {
    return null;
  }
  
  return session.user;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }
  
  return session;
}

// Add this to next.d.ts or types/next-auth.d.ts
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     }
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//   }
// } 