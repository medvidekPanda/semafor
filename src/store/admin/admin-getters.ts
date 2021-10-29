import { AdminModel } from "@/types/admin-model";
import { DocumentData } from "@firebase/firestore-types";

export const adminGetters = {
  dbDocPaginated: (state: Partial<AdminModel>): DocumentData | undefined => {
    return state.dbDocPaginated;
  },
  docsIdsToLoad: (state: Partial<AdminModel>): string[] | undefined => {
    return state.docsIdsToLoad;
  },
  getAllDocsId(state: Partial<AdminModel>): any {
    return state.allDocsResponse?.docs;
  },
  getAllUncorrected(state: Partial<AdminModel>): {
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
  getAllDesktop(state: Partial<AdminModel>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllRoundedDesktop || { value: 0, totalCount: 0 };
  },
  getAllMobile(state: Partial<AdminModel>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllRoundedMobile || { value: 0, totalCount: 0 };
  },
  getAllMediansDesktop(state: Partial<AdminModel>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllMediansRoundedDesktop || { value: 0, totalCount: 0 };
  },
  getAllMediansMobile(state: Partial<AdminModel>): {
    value: number;
    totalCount: number;
  } {
    return state.resultsAllMediansRoundedMobile || { value: 0, totalCount: 0 };
  },
  getAllMedians(state: Partial<AdminModel>): {
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
  lastDbIndex: (state: Partial<AdminModel>): number => {
    return state.lastId || 0;
  },
  numberOfDocs: (state: Partial<AdminModel>): number => {
    return state.allDocsResponse?.docs.length || 0;
  },
};
