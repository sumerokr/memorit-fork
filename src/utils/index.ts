export const delay = (ms: number = Math.max(Math.random() * 600, 100)) =>
  new Promise((resolve) => setTimeout(resolve, ms));
