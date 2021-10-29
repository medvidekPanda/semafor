import ResultPost from "@/types/results-post.model";
import SemaforResult from "@/types/results-semafor";
import { DocumentData } from "@firebase/firestore-types";

export const resultsGetters = {
  getCompareMessage(state: Partial<ResultPost>): string | undefined {
    return state.compareMesssage;
  },
  getDocArray(state: Partial<ResultPost>): DocumentData[] | undefined {
    return state.docArray;
  },
  getResults(state: Partial<ResultPost>): SemaforResult | undefined {
    return state.results;
  },
  isMobile: ({ isMobile }: Partial<ResultPost>): boolean | undefined => {
    return isMobile;
  },
};
