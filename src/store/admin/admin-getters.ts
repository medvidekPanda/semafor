import { defaultResultValue } from "@/constants/default-result-value";
import { AdminModel } from "@/types/state/admin-model";
import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore-types";
import { ValueTotalCount } from "../results/value-totalCount";

export const adminGetters = {
  dbDocPaginated: (state: Partial<AdminModel>): DocumentData | undefined => {
    return state.dbDocPaginated;
  },
  docsIdsToLoad: (state: Partial<AdminModel>): string[] | undefined => {
    return state.docsIdsToLoad;
  },
  getAllDocsId(
    state: Partial<AdminModel>
  ): QueryDocumentSnapshot<DocumentData>[] | undefined {
    return state.allDocsResponse?.docs;
  },
  getAllUncorrected(state: Partial<AdminModel>): ValueTotalCount {
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
    return state.resultsAllRounded || defaultResultValue;
  },
  getAllDesktop(state: Partial<AdminModel>): ValueTotalCount {
    return state.resultsAllRoundedDesktop || defaultResultValue;
  },
  getAllMobile(state: Partial<AdminModel>): ValueTotalCount {
    return state.resultsAllRoundedMobile || defaultResultValue;
  },
  getAllMediansDesktop(state: Partial<AdminModel>): ValueTotalCount {
    return state.resultsAllMediansRoundedDesktop || defaultResultValue;
  },
  getAllMediansMobile(state: Partial<AdminModel>): ValueTotalCount {
    return state.resultsAllMediansRoundedMobile || defaultResultValue;
  },
  getAllMedians(state: Partial<AdminModel>): ValueTotalCount {
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
    return state.resultsAllMediansRounded || defaultResultValue;
  },
  lastDbIndex: (state: Partial<AdminModel>): number => {
    return state.lastId || 0;
  },
  numberOfDocs: (state: Partial<AdminModel>): number => {
    return state.allDocsResponse?.docs.length || 0;
  },
};
