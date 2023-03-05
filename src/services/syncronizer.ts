import { getDBInstance } from "./idb-storage";

const sync = async () => {
  const db = await getDBInstance();
  const transaction = db.transaction(["cards"], "readonly");

  const actions = await transaction.objectStore("cards").getAll(null, 50);
  console.log("have", actions.length, "actions");

  try {
    await fetch("some-url");
  } catch (error) {
    console.warn("can't sync :(");
  }
};

// interval
