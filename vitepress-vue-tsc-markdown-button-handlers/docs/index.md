<script setup lang="ts">
import { nextTick } from "vue";

async function info() {
  window.alert('alert')
  await nextTick();
}
</script>

<button @click="info()">b</button>
