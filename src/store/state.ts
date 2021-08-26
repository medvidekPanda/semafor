import ResultPost from "@/types/results-post.model";

export const state: ResultPost = {
  id: undefined,
  isFinished: false,
  isMobile: undefined,
  results: undefined,
  windowWidth: 0,
  allDocsResponse: undefined,
  docsIdsToLoad: [],
  dbDocPaginated: [],
  lastId: 0,
  isLogged: false,
};
