"use client";
// import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { updateTodoSchema } from "@/lib/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Input } from "../ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

type TodoFormData = z.infer<typeof updateTodoSchema>;

const TodoItem = ({ todo }: { todo: Doc<"todos"> }) => {
  const [isChecked, setIsChecked] = useState<boolean>(todo.completed);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const updateTodo = useMutation(api.todos.updateTodos);
  const deleteTodo = useMutation(api.todos.deleteTodos);

  const handleUpdate = async (data: TodoFormData) => {
    try {
      await updateTodo(data);
      form.clearErrors();
      setIsEditing(false);
    } catch (error) {
      console.log("Update error!", error);
    }
  };

  const handleToggle = async (checked: boolean) => {
    setIsChecked(checked);
    await handleUpdate({
      id: todo._id,
      title: form.getValues("title"),
      completed: checked,
    });
  };

  // delete todo

  const handleDelete = async () => {
    await deleteTodo({ id: todo._id });
  };

  const form = useForm<TodoFormData>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      id: todo._id,
      title: todo.title,
      completed: todo.completed,
    },
  });

  return (
    <Form {...form}>
      <div>
        <Checkbox onCheckedChange={handleToggle} checked={isChecked} />
      </div>

      <div className="flex-1">
        {isEditing ? (
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <form action="" onSubmit={form.handleSubmit(handleUpdate)}>
                    <Input {...field} type="text" autoFocus />
                  </form>
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        ) : (
          <span
            onClick={() => {
              if (!isEditing) setIsEditing(true);
            }}
          >
            {form.getValues("title")}
          </span>
        )}
      </div>

      {form.formState.errors.title && (
        <span>{form.formState.errors.title.message}</span>
      )}
      <Button variant="destructive" onClick={handleDelete}>
        <Trash2Icon />
      </Button>
    </Form>
  );
};

export default TodoItem;
