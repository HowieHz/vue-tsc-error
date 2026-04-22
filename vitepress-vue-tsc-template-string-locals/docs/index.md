<script setup lang="ts">
function formatHourLabel(hourValue: number) {
  const start = `${String(hourValue).padStart(2, "0")}:00`;
  const end = `${String(hourValue).padStart(2, "0")}:59`;
  return `${start}-${end}`;
}
</script>

<div>{{ formatHourLabel(1) }}</div>
