<script setup lang="ts">
defineProps<{
  error: string | null;
}>();

defineEmits<{
  signIn: [];
}>();
</script>

<template>
  <section class="rounded-lg border border-white/70 bg-white/85 p-8 text-center shadow-xl shadow-slate-200/70 ring-1 ring-slate-900/5 backdrop-blur sm:p-10">
    <h2 class="text-2xl font-bold text-slate-950">Sign in to see your tasks</h2>
    <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Use GitHub to open your private task list.</p>
    <button
      class="mx-auto mt-6 flex min-h-12 items-center justify-center gap-3 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200"
      type="button"
      @click="$emit('signIn')"
    >
      <svg
        class="size-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.29 9.29 0 0 1 12 6.97c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.14 10.14 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
      </svg>
      Login with GitHub
    </button>
    <p v-if="error" class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
      {{ error }}
    </p>
  </section>
</template>