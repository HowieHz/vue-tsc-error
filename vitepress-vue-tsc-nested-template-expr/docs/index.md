<script setup lang="ts">
const zodiac = "Dragon";
const zodiacEmoji = "🐲";
const label = `Zodiac ${zodiac}${zodiacEmoji ? ` ${zodiacEmoji}` : ""}`;
</script>

<div>
  <p>{{ label }}</p>
</div>
