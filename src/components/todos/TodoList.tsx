"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import CreateTodo from "./CreateTodo";

const TodoList = () => {
  const todos = useQuery(api.todos.getTodos);

  if (todos === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div>No tasks yet</div>
        <p>Add some tasks to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center items-center">
      <CreateTodo />
      <div className="flex flex-col gap-y-4 justify-center items-center">
        {todos.map((todo) => (
          <p key={todo._id}>{todo.title}</p>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
