export const delay = (ms: number = Math.max(Math.random() * 400, 100)) =>
  new Promise((resolve) => setTimeout(resolve, ms));
