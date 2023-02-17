import { createCardSet } from "@/domain/card-set";
import {
  cardSetAPI,
  cardSetStorage,
  notificationService,
} from "@/services/index";
import type { CreateCardSetUC } from "./ports";
import { nanoid } from "nanoid";

export const createCardSetUC: CreateCardSetUC = async (title) => {
  try {
    const cardSet = createCardSet({
      id: nanoid(),
      title,
      createdAt: new Date().toISOString(),
    });
    await cardSetAPI.save(cardSet);
    cardSetStorage.save(cardSet);
    notificationService.notify("saved");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
