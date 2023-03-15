import type { GetCardSetsUC } from "@/application/ports";
import { cardSetAPI, notificationService } from "@/services/index";

export const getCardSetsUC: GetCardSetsUC = async (deps, args) => {
  console.log("getCardSetsUC call");

  try {
    console.time("cardSetAPI.getAll");
    const cardSets = await cardSetAPI.getAll(args);
    console.timeEnd("cardSetAPI.getAll");
    deps.save(cardSets);
    notificationService.notify("received");
  } catch (error) {
    notificationService.error(error);
  }
};
