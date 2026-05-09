<script setup lang="ts">
import { nextTick, ref } from "vue";

const targetListPage = ref(2);
const targetListPageCount = ref(5);
const isEditingTargetListPage = ref(false);
const targetListPageText = ref("");
const targetListPageInputRef = ref<HTMLInputElement | null>(null);

function stepTargetListPage(delta: number) {
  const nextPage = targetListPage.value + delta;
  targetListPage.value = Math.min(Math.max(nextPage, 1), targetListPageCount.value);
}

async function startEditingTargetListPage() {
  isEditingTargetListPage.value = true;
  targetListPageText.value = String(targetListPage.value);
  await nextTick();
  targetListPageInputRef.value?.focus();
  targetListPageInputRef.value?.select();
}
</script>

<div>
  <button
    type="button"
    class="compat-test-tool__secondary-button"
    :disabled="targetListPage <= 1"
    aria-controls="compat-test-target-list"
    @click="stepTargetListPage(-1)"
  >
    Previous
  </button>

  <button
    type="button"
    class="compat-test-tool__secondary-button"
    @click="startEditingTargetListPage()"
  >
    Edit page
  </button>

  <span>Page {{ targetListPage }} / {{ targetListPageCount }}</span>

  <input
    v-if="isEditingTargetListPage"
    ref="targetListPageInputRef"
    v-model="targetListPageText"
    type="text"
  />
</div>
