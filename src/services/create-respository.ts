export type Repository<T> = {
  add: (t: T) => Promise<void>;
  get: (id: string) => Promise<T | undefined>;
  delete: (id: string) => Promise<void>;
  getAll: () => Promise<T[]>;
};

export const createRepository = <T extends { id: string }>(
  items: T[]
): Repository<T> => {
  const map = new Map<T["id"], T>(items.map((item) => [item.id, item]));

  return {
    get: async (id) => {
      return map.get(id);
    },
    add: async (t) => {
      map.set(t.id, t);
    },
    delete: async (id) => {
      map.delete(id);
    },
    getAll: async () => {
      return Array.from(map.values());
    },
  };
};
