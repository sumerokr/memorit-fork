// TODO: ensure that put only updates
import { getDBInstance } from "@/services/idb-storage";
import { createStat, updateStat } from "@/domain/stat";
import type { UpdateStatApi } from "@/application/update-card-progress";
import { generateID } from "@/utils";

// TODO: handle JSON errors
export const updateStatApi: UpdateStatApi = async ({ cardId, status }) => {
  console.time("api/stats/updateStatApi");

  const db = await getDBInstance();
  const tx = db.transaction("stats", "readwrite");

  const existingStat = await tx.store.index("cardId").get(cardId);

  if (!existingStat) {
    const createdStat = createStat({
      id: generateID(),
      cardId,
      userId: "local-user",
      status,
      createdAt: new Date().toISOString(),
    });

    await tx.store.add(createdStat);
    await tx.done;

    console.timeEnd("api/stats/updateStatApi");

    return createdStat;
  } else {
    const updatedStat = updateStat({
      stat: existingStat,
      data: {
        status,
        updatedAt: new Date().toISOString(),
      },
    });

    await tx.store.put(updatedStat);
    await tx.done;

    console.timeEnd("api/stats/updateStatApi");

    return updatedStat;
  }
};
