<script setup lang="ts">
const { error: authError, isAuthenticated, isLoading, signIn, signOut } = useConvexAuth();
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,#d8f3dc,transparent_32rem),linear-gradient(135deg,#fffaf0_0%,#f8fafc_48%,#e0f2fe_100%)] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
    <main class="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Convex tasks</p>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="font-serif text-5xl font-bold tracking-normal text-slate-950 sm:text-6xl">Tasks</h1>
            <p class="mt-2 max-w-xl text-base leading-7 text-slate-600">Add what needs doing, then check it off when it is done.</p>
          </div>
          <button
            v-if="isAuthenticated"
            class="flex min-h-11 min-w-24 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:translate-y-0 disabled:cursor-not-allowed disabled:text-slate-400"
            type="button"
            :disabled="isLoading"
            :aria-label="isLoading ? 'Signing out' : undefined"
            @click="signOut()"
          >
            <LoadingSpinner v-if="isLoading" class="size-5" />
            <span v-else>Sign out</span>
          </button>
        </div>
      </header>

      <section
        v-if="isLoading && !isAuthenticated"
        class="flex min-h-40 items-center justify-center rounded-lg border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-200/70 ring-1 ring-slate-900/5 backdrop-blur sm:p-10"
        role="status"
        aria-label="Loading your tasks"
      >
        <LoadingSpinner class="size-8" />
      </section>

      <LoginWithGithub
        v-else-if="!isAuthenticated"
        :error="authError"
        @sign-in="signIn('github')"
      />

      <template v-else>
        <div class="rounded-lg border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 ring-1 ring-slate-900/5 backdrop-blur sm:p-6">
          <AddTask />
        </div>

        <TaskList />
      </template>
    </main>
  </div>
</template>
