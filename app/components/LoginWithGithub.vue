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
      <GithubIcon />
      Login with GitHub
    </button>
    <p v-if="error" class="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
      {{ error }}
    </p>
  </section>
</template>
