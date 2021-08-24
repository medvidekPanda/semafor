import ResultPost from '@/types/results-post.model';

export const getters = {
  numberOfResults: (state: ResultPost): number => {
    return state.dbResponse?.docs.length;
  },
  dbPagination: (state: ResultPost): any => {
    return state.dbPagination;
  },
  dbDocument: (state: ResultPost): any => {
    return state.dbDoc;
  },
};
