import { computed } from "vue";
import { api } from "~~/convex/_generated/api";
import type { Doc } from "~~/convex/_generated/dataModel";

type OptimisticTask = {
  _id: string;
  text: string;
  isCompleted: false;
};

export type TaskItem = Doc<"tasks"> | OptimisticTask;

const queryArgs = {};

function isOptimisticTask(task: TaskItem): task is OptimisticTask {
  return task._id.startsWith("optimistic-");
}

export function useTasks() {
  const optimisticTasks = useState<OptimisticTask[]>(
    "optimistic-tasks",
    () => [],
  );

  const { data, isPending, error } = useConvexQuery(api.tasks.get);

  const tasks = computed<TaskItem[]>(() => [
    ...optimisticTasks.value,
    ...(data.value ?? []),
  ]);

  const {
    mutate: createTask,
    isPending: isCreating,
    error: createError,
  } = useConvexMutation(api.tasks.create);

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
    const optimisticTask: OptimisticTask = {
      _id: `optimistic-${crypto.randomUUID()}`,
      text,
      isCompleted: false,
    };

    optimisticTasks.value.unshift(optimisticTask);

    try {
      return await createTask({ text });
    } finally {
      optimisticTasks.value = optimisticTasks.value.filter(
        (task) => task._id !== optimisticTask._id,
      );
    }
  }

  function toggleTask(task: TaskItem) {
    if (isOptimisticTask(task)) return;

    return updateTask({
      id: task._id,
      isCompleted: !task.isCompleted,
    });
  }

  function removeTask(task: TaskItem) {
    if (isOptimisticTask(task)) return;

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
