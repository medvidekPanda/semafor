import { SemaforRound } from "@/types/results/results-round";
import { DocumentData } from "@firebase/firestore-types";
import "firebase/auth";
import "firebase/firestore";
import { compareNumbers } from "./compare-numbers";

export function mapSortValues(data: DocumentData, key: string): string[] {
  return data[key]?.rounds
    ?.map((item: SemaforRound) => String(item.value))
    .sort(compareNumbers);
}

export function summarizeValues(array: string[], factor = 3): number {
  let number = 0;
  array?.forEach((value) => {
    number = number + Number(value);
  });
  return number / factor;
}

export function removeFirstLastValue(array: string[]): string[] {
  array?.shift();
  array?.pop();
  return array;
}
