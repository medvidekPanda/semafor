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
  }
};
