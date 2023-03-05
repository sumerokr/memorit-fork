import { getDBInstance } from "./idb-storage";

const sync = async () => {
  const db = await getDBInstance();
  const transaction = db.transaction(["cards"], "readonly");

  const actions = await transaction.objectStore("cards").getAll(null, 50);

  try {
    const response = fetch('')
  }
}

// interval
