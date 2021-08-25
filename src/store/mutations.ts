import {
  QuerySnapshot,
  DocumentData,
} from "@firebase/firestore-types";

import ResultPost from "../types/results-post.model";

export const mutations = {
  saveSemaforResults(state: ResultPost, payload: Partial<ResultPost>): void {
    const results = { ...state.results, ...payload.results };
    state.id = payload.id;
    state.results = results;
    state.isFinished = payload.isFinished || state.isFinished;
    state.isMobile = payload.isMobile || state.isMobile;
  },
  clearStore(state: ResultPost): void {
    state.id = undefined;
    state.results = undefined;
    state.isFinished = false;
  },
  getWindowWidth(state: Partial<ResultPost>, payload: number): void {
    state.windowWidth = payload | 0;
  },
  getAllDocs(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    state.allDocsResponse = payload;
  },
  getdocsIdsToLoad(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    state.docsIdsToLoad = [];
    payload.docs.forEach(doc => {
      state.docsIdsToLoad?.push(doc.id);
    })
  },
  getDocsById(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    const docsIds: DocumentData = [];
    payload.docs.forEach((doc) => {
      docsIds.push(doc.data());
    });
    state.dbDocPaginated = docsIds;
  },
};
