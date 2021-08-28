import { DocumentData } from "@firebase/firestore-types";

import ResultPost from "@/types/results-post.model";

export const getters = {
  numberOfDocs: (state: Partial<ResultPost>): number => {
    return state.allDocsResponse?.docs.length || 0;
  },
  docsIdsToLoad: (state: Partial<ResultPost>): string[] | undefined => {
    return state.docsIdsToLoad;
  },
  dbDocPaginated: (state: Partial<ResultPost>): DocumentData | undefined => {
    return state.dbDocPaginated;
  },
  lastDbIndex: (state: Partial<ResultPost>): number => {
    return state.lastId || 0;
  },
  isLogged: (state: Partial<ResultPost>): boolean | undefined => {
    return state.isLogged;
  },
  getAllUncorrected(state: Partial<ResultPost>): {
    value: number;
    totalCount: number;
  } {
    state.resultsAllRounded = {
      value:
        ((state.resultsAllRoundedDesktop?.value || 0) +
          (state.resultsAllRoundedMobile?.value || 0)) /
        2,
      totalCount:
        (state.resultsAllRoundedDesktop?.totalCount || 0) +
        (state.resultsAllRoundedMobile?.totalCount || 0),
    };
    return state.resultsAllRounded || { value: 0, totalCount: 0 };
  },
  getAllDesktop(state: Partial<ResultPost>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllRoundedDesktop || { value: 0, totalCount: 0 };
  },
  getAllMobile(state: Partial<ResultPost>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllRoundedMobile || { value: 0, totalCount: 0 };
  },
};
