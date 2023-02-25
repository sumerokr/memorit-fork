import type { GetCardByIdUC } from "@/application/ports";
import type { Card } from "@/domain/card";
import { cardsAPI, cardsStorage, notificationService } from "@/services/index";

export const getCardByIdUC: GetCardByIdUC = async (id: Card["id"]) => {
  try {
    console.time("cardsAPI.getById");
    const card = await cardsAPI.getById(id);
    console.timeEnd("cardsAPI.getById");
    cardsStorage.save(card);
    notificationService.notify("received");
  } catch (error) {
    const message = (() => {
      return error instanceof Error ? error.message : "unknown error";
    })();
    notificationService.notify(message);
  }
};
