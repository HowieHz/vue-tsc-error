# Repro

<script setup lang="ts">
import { Lunar, Solar, type SolarInstance } from "lunar-javascript";

const solar: SolarInstance = Solar.fromYmd(2026, 4, 28);
const lunar = Lunar.fromYmd(2026, 4, 1);
</script>

<template>
  <p>{{ solar.toYmd() }}</p>
  <p>{{ lunar.toString() }}</p>
</template>

This page intentionally imports a JavaScript-only package from a VitePress Markdown file.
