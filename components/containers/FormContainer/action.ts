"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { z } from "zod";

type FieldErrors = {
  [key: string]: string[];
};

/* eslint-disable @typescript-eslint/no-explicit-any*/
export async function actionFormLink(
  prevStage: { message: string; errors: object },
  formData: FormData
): Promise<any> {
  // return;
  const formSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1),
    url: z.string().min(1),
  });

  const parse = formSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
  });

  if (!parse.success) {
    const fieldErrors: FieldErrors = parse.error.formErrors.fieldErrors || {};
    const errors = Object.keys(fieldErrors)?.reduce((acc, key) => {
      acc[key] = fieldErrors[key]?.[0] || "Unknown error";
      return acc;
    }, {} as Record<string, string>);
    return { errors };
  }

  try {
    const fetchOptions = {
      url: formData.get("id")
        ? `http://localhost:3000/api/links/${formData.get("id")}`
        : "http://localhost:3000/api/links",
      method: formData.get("id") ? "PATCH" : "POST",
    };
    const session = await getServerSession(authOptions);
    await fetch(fetchOptions.url, {
      method: fetchOptions.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parse.data, email: session?.user?.email }),
    }).then((res) => res.json());
    return { message: "Success" };
  } catch (error) {
    console.log(error);
    return { message: "Failed" };
  }
}
