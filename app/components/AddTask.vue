<script setup lang="ts">
import { computed, ref } from "vue";
import { api } from "~~/convex/_generated/api";

const text = ref("");
const trimmedText = computed(() => text.value.trim());
const { mutate, isPending, error } = useConvexMutation(api.tasks.create);

async function addTask() {
  if (!trimmedText.value || isPending.value) {
    return;
  }

  await mutate({ text: trimmedText.value });
  text.value = "";
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="addTask">
    <div class="flex flex-col gap-1">
      <label class="text-sm font-semibold text-slate-800" for="task-text">New task</label>
      <p class="text-sm text-slate-500">Capture it before it escapes the moment.</p>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row">
      <input
        id="task-text"
        v-model="text"
        class="min-h-12 flex-1 rounded-md border border-slate-200 bg-white px-4 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        type="text"
        placeholder="Add a task"
        :disabled="isPending"
      >
      <button
        class="min-h-12 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-36"
        type="submit"
        :disabled="!trimmedText || isPending"
      >
        {{ isPending ? "Adding..." : "Add task" }}
      </button>
    </div>

    <p v-if="error" class="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
      Unable to add task.
    </p>
  </form>
</template>