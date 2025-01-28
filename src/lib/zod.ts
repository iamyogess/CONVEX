import { z } from "zod";
import { zid } from "convex-helpers/server/zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Todo must contain at least 3 characters!" }),
  completed: z.boolean(),
});

export const updateTodoSchema = z.object({
  id: zid("todos"), //zid only checks if id is string or not
  title: z
    .string()
    .min(3, { message: "Todo must contain at least 3 characters!" }),
  completed: z.boolean(),
});

export const deleteTodoSchema = z.object({
  id: zid("todos"),
});
