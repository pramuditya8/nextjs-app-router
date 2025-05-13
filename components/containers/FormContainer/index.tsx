import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionFormLink } from "./action";
import { useFormStatus } from "react-dom";

const initialState = {
  message: "",
  errors: {
    title: "",
    url: "",
  },
};

const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  url: z.string().min(1),
});

export default function FormContainer({
  id,
  values,
  onFinished,
}: {
  id?: number;
  values?: z.infer<typeof formSchema>;
  onFinished?: () => void;
}) {
  const [state, formAction] = useActionState(actionFormLink, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.message === "Success") {
      onFinished?.();
    }
  }, [state, onFinished]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id ? id : undefined,
      title: values?.title ? values?.title : "",
      url: values?.url ? values?.url : "",
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem style={{ display: "none" }}>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Input title" {...field} />
              </FormControl>

              <FormMessage>{state?.errors?.title}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="Input url" {...field} />
                </FormControl>

                <FormMessage>{state?.errors?.url}</FormMessage>
              </FormItem>
            );
          }}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
