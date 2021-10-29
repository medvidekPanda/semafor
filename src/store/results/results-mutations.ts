import { DocumentData } from "@firebase/firestore-types";
import ResultPost from "../../types/results-post.model";

export const resultsMutations = {
  clearDocArray(state: Partial<ResultPost>): void {
    state.docArray = [];
  },
  clearStore(state: ResultPost): void {
    state.id = undefined;
    state.results = undefined;
    state.isFinished = false;
    state.compareMesssage = undefined;
  },
  findClosest(state: any, data: DocumentData): void {
    console.log("state", state);
    function compareNumbers(a: number, b: number) {
      return Number(a) - Number(b);
    }
    const key = state.isMobile
      ? "roundedValuesCorrMobile"
      : "roundedValuesCorrDesktop";
    const key2 = state.isMobile ? "mobile" : "desktop";

    const sorted = data.docs[0].data()[key].sort(compareNumbers);
    const resultToCompare = Number(
      state.results && state.results[key2]?.roundedValueCorrected
    );
    const closestIndex = (num: number, arr: number[]) => {
      let curr = arr[0],
        diff = Math.abs(num - curr);
      let index = 0;
      for (let val = 0; val < arr.length; val++) {
        const newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
          diff = newdiff;
          curr = arr[val];
          index = val;
        }
      }
      return index;
    };
    const sortedIndex = closestIndex(resultToCompare, sorted);
    let compareMessage = undefined;
    if (sorted[sortedIndex] < resultToCompare) {
      compareMessage = `Počet lidí, kteří byli lepší než ty: ${
        sortedIndex + 1
      } z celkových ${sorted.length}`;
    } else {
      compareMessage = `Počet lidí, kteří byli lepší než ty: ${sortedIndex} z celkových ${sorted.length}`;
    }
    state.compareMesssage = compareMessage;
  },
  isMobile(state: Partial<any>, payload: boolean): void {
    state.isMobile = payload;
  },
  saveSemaforResults(state: any, payload: any): void {
    const results = { ...state.results, ...payload.results };
    state.id = payload.id;
    state.results = results;
    state.isFinished = payload.isFinished || state.isFinished;
    state.isMobile = payload.isMobile || state.isMobile;
  },
};
