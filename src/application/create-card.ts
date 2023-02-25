import { createCard } from "@/domain/card";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";
import type { CreateCardUC } from "./ports";
import { nanoid } from "nanoid";

export const createCardUC: CreateCardUC = async ({
  front,
  back,
  cardSetId,
}) => {
  try {
    const card = createCard({
      id: nanoid(),
      front,
      back,
      cardSetId,
      createdAt: new Date().toISOString(),
    });
    console.time("cardsAPI.save");
    await cardsAPI.save(card);
    console.timeEnd("cardsAPI.save");
    cardsStorage.save(card);
    notificationService.notify("card saved");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
