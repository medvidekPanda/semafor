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
};
