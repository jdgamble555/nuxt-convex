<script setup lang="ts">
import { computed } from "vue";
import { api } from "~~/convex/_generated/api";
import type { Doc } from "~~/convex/_generated/dataModel";

const { data: tasks, isPending, error } = useConvexQuery(api.tasks.get);
const { mutate: toggleCompleted } = useConvexMutation(
    api.tasks.toggleCompleted,
    {
        optimisticUpdate: (localStore, args) => {
            const currentTasks = localStore.getQuery(api.tasks.get, {});

            if (!currentTasks) {
                return;
            }

            localStore.setQuery(
                api.tasks.get,
                {},
                currentTasks.map((task) =>
                    task._id === args.id
                        ? { ...task, isCompleted: args.isCompleted }
                        : task,
                ),
            );
    },
    },
);
const { mutate: removeTask } = useConvexMutation(
    api.tasks.remove,
    {
        optimisticUpdate: (localStore, args) => {
            const currentTasks = localStore.getQuery(api.tasks.get, {});

            if (!currentTasks) {
                return;
            }

            localStore.setQuery(
                api.tasks.get,
                {},
                currentTasks.filter((task) => task._id !== args.id),
            );
        },
    },
);

const visibleTasks = computed(() => tasks.value ?? []);

async function updateTaskCompleted(task: Doc<"tasks">) {
    await toggleCompleted({
        id: task._id,
        isCompleted: !task.isCompleted,
    });
}

async function deleteTask(task: Doc<"tasks">) {
    await removeTask({ id: task._id });
}
</script>

<template>
    <section class="overflow-hidden rounded-lg border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5 backdrop-blur">
        <div class="border-b border-slate-100 bg-slate-50/80 p-5 sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Today</p>
                    <h2 class="mt-1 text-2xl font-bold text-slate-950">Your list</h2>
                </div>
            </div>
        </div>

        <div class="p-5 sm:p-6">
            <p
                v-if="isPending"
                class="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500"
            >
                Loading tasks...
            </p>
            <p v-else-if="error" class="rounded-md bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                Unable to load tasks.
            </p>
            <ul v-else-if="visibleTasks.length" class="space-y-3">
                <li
                    v-for="task in visibleTasks"
                    :key="task._id"
                    class="group rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                >
                    <div class="flex items-center gap-3">
                    <label class="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                        <input
                            class="size-5 rounded border-slate-300 accent-teal-600 transition group-hover:scale-105"
                            type="checkbox"
                            :checked="task.isCompleted"
                            @change="updateTaskCompleted(task)"
                        >
                        <span
                            class="min-w-0 flex-1 wrap-break-word text-base font-medium text-slate-800 transition"
                            :class="task.isCompleted ? 'text-slate-400 line-through decoration-2' : ''"
                        >
                            {{ task.text }}
                        </span>
                    </label>
                    <button
                        class="flex size-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100"
                        type="button"
                        :aria-label="`Delete ${task.text}`"
                        title="Delete task"
                        @click="deleteTask(task)"
                    >
                        <span
                            class="size-4 bg-current"
                            aria-hidden="true"
                            style="mask: url('/delete.svg') center / contain no-repeat; -webkit-mask: url('/delete.svg') center / contain no-repeat;"
                        />
                    </button>
                    </div>
                </li>
            </ul>
            <div v-else class="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                <p class="text-sm font-semibold text-slate-700">No tasks yet</p>
                <p class="mt-1 text-sm text-slate-500">Add the first one above.</p>
            </div>
        </div>
    </section>
</template>
