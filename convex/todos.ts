import { mutation, query } from "./_generated/server";
import { createTodoSchema } from "./../src/lib/zod";
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
  args: createTodoSchema.shape,
  handler: async (ctx, args) => {
    return ctx.db.insert("todos", {
      title: args.title,
      completed: args.completed,
    });
  },
});

export const deleteTodos = zMutation({
  args: createTodoSchema.shape,
  handler: async (ctx, args) => {
    return ctx.db.insert("todos", {
      title: args.title,
      completed: args.completed,
    });
  },
});
