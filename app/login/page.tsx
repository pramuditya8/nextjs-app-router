"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getToken } from "next-auth/jwt";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function Login() {
  const [showPage, setShowPage] = useState(false);

  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    } else if (session?.status === "unauthenticated") {
      setShowPage(true);
    }
  }, [session]);

  return (
    <>
      {showPage && (
        <div className="container mx-auto ">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login First</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button onClick={() => signIn("google")}>Sign In Google</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
