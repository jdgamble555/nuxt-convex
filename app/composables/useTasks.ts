import { api } from "~~/convex/_generated/api";
import type { Doc, Id } from "~~/convex/_generated/dataModel";

export type TaskItem = Doc<"tasks">;

const queryArgs = {};

export function useTasks() {
  const { data, isPending, error } = useConvexQuery(api.tasks.get);

  const tasks = computed<TaskItem[]>(() => data.value ?? []);

  const {
    mutate: createTask,
    isPending: isCreating,
    error: createError,
  } = useConvexMutation(api.tasks.create, {
    optimisticUpdate: (localStore, args) => {
      const currentTasks = localStore.getQuery(api.tasks.get, queryArgs);

      if (!currentTasks) return;

      const now = Date.now();
      const optimisticTask: Doc<"tasks"> = {
        _id: `pending-${crypto.randomUUID()}` as Id<"tasks">,
        _creationTime: now,
        userId:
          currentTasks[0]?.userId ??
          (`pending-${crypto.randomUUID()}` as Id<"users">),
        text: args.text,
        isCompleted: false,
      };

      localStore.setQuery(api.tasks.get, queryArgs, [
        optimisticTask,
        ...currentTasks,
      ]);
    },
  });

  const { mutate: updateTask } = useConvexMutation(
    api.tasks.toggleCompleted,
    {
      optimisticUpdate: (localStore, args) => {
        const currentTasks = localStore.getQuery(api.tasks.get, queryArgs);

        if (!currentTasks) return;

        localStore.setQuery(
          api.tasks.get,
          queryArgs,
          currentTasks.map((task) =>
            task._id === args.id
              ? { ...task, isCompleted: args.isCompleted }
              : task,
          ),
        );
      },
    },
  );

  const { mutate: deleteTask } = useConvexMutation(api.tasks.remove, {
    optimisticUpdate: (localStore, args) => {
      const currentTasks = localStore.getQuery(api.tasks.get, queryArgs);

      if (!currentTasks) return;

      localStore.setQuery(
        api.tasks.get,
        queryArgs,
        currentTasks.filter((task) => task._id !== args.id),
      );
    },
  });

  async function addTask(text: string) {
    return await createTask({ text });
  }

  function toggleTask(task: TaskItem) {
    if (task._id.startsWith("pending-")) return;

    return updateTask({
      id: task._id,
      isCompleted: !task.isCompleted,
    });
  }

  function removeTask(task: TaskItem) {
    if (task._id.startsWith("pending-")) return;

    return deleteTask({ id: task._id });
  }

  return {
    tasks,
    isPending,
    error,
    isCreating,
    createError,
    addTask,
    toggleTask,
    removeTask,
  };
}
