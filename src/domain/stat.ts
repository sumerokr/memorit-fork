import type { Card } from "./card";

const progressMap = [0, 1, 3, 5, 8, 13, 21, 34, 55, 89, 144];

export type Progress = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ProgressMap = Partial<{
  [key in Progress]: number;
}>;

export type Stat = {
  id: string;
  cardId: Card["id"];
  userId: string;
  createdAt: string;
  updatedAt: string;
  showAfter: string;
  attemptCount: number;
  successCount: number;
  progress: Progress;
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
      // TODO: handle all default cases!
      switch (status) {
        case "success":
        case "failure":
          return 1;
        case "skip":
          return 0;
      }
    })(),
    successCount: (() => {
      switch (status) {
        case "success":
          return 1;
        case "failure":
        case "skip":
          return 0;
      }
    })(),
    progress: (() => {
      switch (status) {
        case "success":
          return 1;
        case "failure":
          return 0;
        case "skip":
          return -1;
      }
    })(),
    showAfter: (() => {
      switch (status) {
        case "success": {
          const nowDate = new Date(createdAt).getDate();
          const newDate = new Date();
          newDate.setDate(nowDate + progressMap[1]);
          return newDate.toISOString();
        }
        case "failure":
        case "skip":
          return createdAt;
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

  newStat.updatedAt = updatedAt;

  newStat.progress = (() => {
    switch (status) {
      case "success":
        return Math.max(Math.min(newStat.progress + 1, 10), -1) as Progress;
      case "failure":
        return Math.min(Math.max(Math.floor(Math.sqrt(newStat.progress)), 0), 10) as Progress;
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

  newStat.showAfter = (() => {
    const nowDate = new Date().getDate();
    const newDate = new Date();
    newDate.setDate(nowDate + progressMap[newStat.progress]);
    return newDate.toISOString();
  })();

  return newStat;
};
