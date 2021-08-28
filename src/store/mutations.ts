import { QuerySnapshot, DocumentData } from "@firebase/firestore-types";

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
    state.lastId = state.allDocsResponse.docs.length - 1 || 0;
  },
  getDocsByIdPaginated(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    const docsIds: DocumentData = [];
    payload.docs.forEach((doc) => {
      docsIds.push(doc.data());
    });
    state.dbDocPaginated = docsIds;
  },
  setDocsPagination(state: Partial<ResultPost>, payload: any): void {
    state.docsIdsToLoad = [];
    const lastId = state.lastId || 0;
    const nextLastIndex = payload.limit + payload.firstIndex;
    const limit = lastId < nextLastIndex ? lastId + 1 : nextLastIndex;

    for (let i = payload.firstIndex; i < limit; i++) {
      state.docsIdsToLoad.push(state.allDocsResponse?.docs[i]?.id || "");
    }
  },
  isLogged(state: Partial<ResultPost>, payload: boolean): void {
    state.isLogged = payload;
  },
  getAllDesktop(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let reults = 0;
    payload.docs.forEach((element) => {
      reults = reults + Number(element.data().desktop.roundedValue);
    });
    state.resultsAllRoundedDesktop = {
      value: Number((reults / payload.docs.length).toFixed(2)),
      totalCount: payload.docs.length,
    };
  },
  getAllMobile(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let reults = 0;
    payload.docs.forEach((element) => {
      reults = reults + Number(element.data().mobile.roundedValue);
    });
    state.resultsAllRoundedMobile = {
      value: Number((reults / payload.docs.length).toFixed(2)),
      totalCount: payload.docs.length,
    };
  },
};
