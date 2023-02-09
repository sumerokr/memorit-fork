import type { CardSet } from "@/domain/card-set";
import { createRepository } from "./create-respository";

const localStorageKey = "memorit/card-sets";

const data = localStorage.getItem(localStorageKey);
const cardSets = JSON.parse(data ?? "[]") as CardSet[];

export const cardSetsRepository = createRepository<CardSet>(cardSets);
