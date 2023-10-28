export const delay = (ms: number = Math.max(Math.random() * 400, 100)) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateID = () =>
  crypto.randomUUID() || `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
