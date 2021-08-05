import ResultPost from "../types/results-post.model";

export const mutations = {
  saveSemaforResults(state: ResultPost, payload: Partial<ResultPost>): void {
    const results = { ...state.results, ...payload.results };
    state.id = payload.id;
    state.results = results;
  },
};
