import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { token, userId, userDataInfo } = body;
  const type = body.client_type || body.userType || body.type || "customer";

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2,
  });
  cookieStore.set({
    name: "userId",
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2,
  });
  cookieStore.set({
    name: "userDataInfo",
    value: JSON.stringify(userDataInfo),
    httpOnly: false, // Allow client-side JS to read user profile details (name, avatar)
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2,
  });
  cookieStore.set({
    name: "client_type",
    value: type,
    httpOnly: false, // Allow client-side layout and scripts to detect role dynamically
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 2,
  });

  return NextResponse.json({ message: "Token stored successfully" });
}
