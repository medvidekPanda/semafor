import { DocumentData, QuerySnapshot } from "@firebase/firestore-types";

export interface AdminModel {
  allDocsResponse?: QuerySnapshot<DocumentData>;
  dbDocPaginated: DocumentData;
  docArray: DocumentData[],
  docsIdsToLoad: string[];
  lastId: number;
  resultsAllRounded: { value: number; totalCount: number };
  resultsAllRoundedDesktop: { value: number; totalCount: number };
  resultsAllRoundedMobile: { value: number; totalCount: number };
  resultsAllMediansRounded: { value: number; totalCount: number };
  resultsAllMediansRoundedDesktop: { value: number; totalCount: number };
  resultsAllMediansRoundedMobile: { value: number; totalCount: number };
  roundedValuesCorrDesktop: number[],
  roundedValuesCorrMobile: number[],
}