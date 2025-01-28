import { mutation, query } from "./_generated/server";
import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "./../src/lib/zod";
import { zCustomMutation } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";

const zMutation = zCustomMutation(mutation, NoOp);

export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    return todos.reverse();
  },
});

export const createTodos = zMutation({
  args: createTodoSchema.shape,
  handler: async (ctx, args) => {
    return ctx.db.insert("todos", {
      title: args.title,
      completed: args.completed,
    });
  },
});

export const updateTodos = zMutation({
  args: updateTodoSchema.shape,
  handler: async (ctx, args) => {
    return ctx.db.patch(args.id, {
      title: args.title,
      completed: args.completed,
    });
  },
});

export const deleteTodos = zMutation({
  args: deleteTodoSchema.shape,
  handler: async (ctx, args) => {
    return ctx.db.delete(args.id);
  },
});
