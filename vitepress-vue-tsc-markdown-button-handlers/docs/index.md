<script setup lang="ts">
import { nextTick, ref } from "vue";

const targetListPage = ref(2);
const isEditingTargetListPage = ref(false);
const targetListPageInputRef = ref<HTMLInputElement | null>(null);

function stepTargetListPage(delta: number) {
  targetListPage.value = Math.max(1, targetListPage.value + delta);
}

async function startEditingTargetListPage() {
  isEditingTargetListPage.value = true;
  await nextTick();
  targetListPageInputRef.value?.focus();
}
</script>

<div>
  <button :disabled="targetListPage <= 1" @click="stepTargetListPage(-1)">Previous</button>
  <button @click="startEditingTargetListPage()">Edit page</button>
  <input v-if="isEditingTargetListPage" ref="targetListPageInputRef" />
</div>
