import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import type { NextAuthOptions } from "next-auth";

export const getAuthSession = () => getServerSession(authOptions as NextAuthOptions);
