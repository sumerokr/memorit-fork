import type { Card } from "./card";

export type Stat = {
  id: string;
  cardId: Card["id"];
  userId: string;
  createdAt: string;
  updatedAt: string;
  attemptCount: number;
  successCount: number;
  progress: number;
};

export const createStat = (
  data: Pick<Stat, "id" | "cardId" | "userId" | "createdAt"> & {
    status: "success" | "failure" | "skip";
  }
): Stat => {
  const { id, cardId, userId, createdAt, status } = data;
  return {
    id,
    cardId,
    userId,
    createdAt,
    updatedAt: createdAt,
    attemptCount: (() => {
      switch (status) {
        case "success":
        case "failure":
          return 1;
        default:
          return 0;
      }
    })(),
    successCount: (() => {
      switch (status) {
        case "success":
          return 1;
        default:
          return 0;
      }
    })(),
    progress: (() => {
      switch (status) {
        case "success":
          return 1;
        case "skip":
          return -1;
        default:
          return 0;
      }
    })(),
  };
};

export const updateStat = ({
  stat,
  data,
}: {
  stat: Stat;
  data: Pick<Stat, "updatedAt"> & { status: "success" | "failure" | "skip" };
}): Stat => {
  const { updatedAt, status } = data;

  const newStat = structuredClone(stat);

  newStat.progress = (() => {
    switch (status) {
      case "success":
        return Math.min(newStat.progress + 1, 10);
      case "failure":
        return Math.max(Math.floor(Math.sqrt(newStat.progress)), 0);
      case "skip":
        return -1;
      default:
        return newStat.progress;
    }
  })();

  newStat.attemptCount = (() => {
    switch (status) {
      case "success":
      case "failure":
        return newStat.attemptCount + 1;
      default:
        return newStat.attemptCount;
    }
  })();
  newStat.successCount = (() => {
    switch (status) {
      case "success":
        return newStat.successCount + 1;
      default:
        return newStat.successCount;
    }
  })();
  newStat.updatedAt = updatedAt;

  return newStat;
};
