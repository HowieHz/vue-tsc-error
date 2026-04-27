<script setup lang="ts">
const count = 3;
</script>

<div>
  <button :title="`Page ${count}`" type="button">
    Visible page count: {{ count }}
  </button>

  <input :aria-label="`Item ${count}`">
</div>
