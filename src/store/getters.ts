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
    const value =
      ((state.resultsAllRoundedDesktop?.value || 0) +
        (state.resultsAllRoundedMobile?.value || 0)) /
      2;
    state.resultsAllRounded = {
      value: Number(value.toFixed(2)),
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
  getAllMediansDesktop(state: Partial<ResultPost>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllMediansRoundedDesktop || { value: 0, totalCount: 0 };
  },
  getAllMediansMobile(state: Partial<ResultPost>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllMediansRoundedMobile || { value: 0, totalCount: 0 };
  },
  getAllMedians(state: Partial<ResultPost>): {
    value: number;
    totalCount: number;
  } {
    const value =
      ((state.resultsAllMediansRoundedDesktop?.value || 0) +
        (state.resultsAllMediansRoundedMobile?.value || 0)) /
      2;
    state.resultsAllMediansRounded = {
      value: Number(value.toFixed(2)),
      totalCount:
        (state.resultsAllMediansRoundedDesktop?.totalCount || 0) +
        (state.resultsAllMediansRoundedMobile?.totalCount || 0),
    };
    return state.resultsAllMediansRounded || { value: 0, totalCount: 0 };
  },
  getAllDocsId(state: Partial<ResultPost>): any {
    return state.allDocsResponse?.docs;
  },
  getDocArray(state: Partial<ResultPost>): DocumentData[] | undefined {
    return state.docArray;
  },
};
