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
  resultsAllRounded: { value: 0, totalCount: 0 },
  resultsAllRoundedDesktop: { value: 0, totalCount: 0 },
  resultsAllRoundedMobile: { value: 0, totalCount: 0 },
  resultsAllMediansRounded: { value: 0, totalCount: 0 },
  resultsAllMediansRoundedDesktop: { value: 0, totalCount: 0 },
  resultsAllMediansRoundedMobile: { value: 0, totalCount: 0 },
};
