<script setup lang="ts">
import { nextTick, ref } from "vue";

const p = ref(2);
const e = ref(false);
const r = ref<HTMLInputElement | null>(null);

function step(delta: number) {
  p.value = Math.max(1, p.value + delta);
}

async function edit() {
  e.value = true;
  await nextTick();
  r.value?.focus();
}
</script>

<div>
  <button :disabled="p <= 1" @click="step(-1)">Previous</button>
  <button @click="edit()">Edit</button>
  <input v-if="e" ref="r" />
</div>
