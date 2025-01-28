"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodIssue } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { createTodoSchema } from "@/lib/zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ConvexError } from "convex/values";

// const formSchema = z.object({
//   title: z.string().min(3, { message: "At least 3 characters are required!" }),
//   completed: z.boolean(),
// });

const CreateTodo = () => {
  const createTodo = useMutation(api.todos.createTodos);

  const form = useForm<z.infer<typeof createTodoSchema>>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      completed: false,
    },
  });

  useEffect(() => {
    const shouldFocusInput = !form.formState.isSubmitting;
    if (shouldFocusInput) {
      form.setFocus("title");
    }
  }, [form.formState.isSubmitting, form]);

  const handleTodoCreation = async (data: z.infer<typeof createTodoSchema>) => {
    try {
      await createTodo({ title: data.title, completed: false });
      form.reset();
    } catch (error) {
      handleTodoCreationError(error);
    }
  };

  const handleTodoCreationError = (error: unknown) => {
    if (error instanceof ConvexError && error.data.ZodError) {
      const zodError = error.data.ZodError as ZodIssue[];
      const titleError = zodError.find((err) => err.path.includes("title"));
      if (titleError) {
        form.setError("title", { message: titleError.message });
      }
    } else {
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto my-20 flex justify-center items-center">
      <Form {...form}>
        <form
          className="flex gap-x-4 justify-center items-center"
          onSubmit={form.handleSubmit(handleTodoCreation)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormDescription>
                  Please enter the title of your todo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Add</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTodo;
