"use client";
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
      <div className="group relative flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
        <div className="flex items-center">
          <Checkbox 
            onCheckedChange={handleToggle} 
            checked={isChecked}
            className="h-5 w-5 rounded border-gray-300 transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
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
                      <Input 
                        {...field} 
                        type="text" 
                        autoFocus
                        className="h-9 rounded-md border-gray-200 bg-gray-50 px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </form>
                  </FormControl>
                </FormItem>
              )}
            />
          ) : (
            <span
              onClick={() => {
                if (!isEditing && !isChecked) setIsEditing(true);
              }}
              className={`cursor-pointer text-sm transition-all ${
                isChecked 
                  ? 'text-gray-400 line-through' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {form.getValues("title")}
            </span>
          )}
          
          {form.formState.errors.title && (
            <span className="mt-1 text-xs text-red-500">
              {form.formState.errors.title.message}
            </span>
          )}
        </div>

        <Button 
          variant="ghost" 
          onClick={handleDelete}
          className="h-8 w-8 rounded-full p-0 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
    </Form>
  );
};

export default TodoItem;