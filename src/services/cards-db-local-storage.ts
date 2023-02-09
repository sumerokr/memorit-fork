import type { Card } from "@/domain/card";
import { createRepository } from "./create-respository";

const localStorageKey = "memorit/cards";

const data = localStorage.getItem(localStorageKey);
const cards = JSON.parse(data ?? "[]") as Card[];

export const cardsRepository = createRepository<Card>(cards);
