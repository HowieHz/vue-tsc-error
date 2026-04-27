<script setup lang="ts">
const count = 3;
</script>

<div>
  <button :title="`Page ${count}`" type="button">
    Visible page count: {{ count }}
  </button>
</div>
