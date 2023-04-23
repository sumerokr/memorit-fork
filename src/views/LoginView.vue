<script setup lang="ts">
import { supabase } from "@/supabase/index";

const onLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });
};
</script>

<template>
  <div class="flex-grow flex flex-col p-4 bg-neutral-100">
    <h1 class="text-3xl mb-8 text-center">Login</h1>
    <button class="border rounded p-2 bg-white" @click="onLogin">
      Continue with Google
    </button>
  </div>
</template>
