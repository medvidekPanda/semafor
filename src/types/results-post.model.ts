import { QuerySnapshot, DocumentData } from "@firebase/firestore-types";

import PostForm from "./post-form";
import SemaforResult from "./results-semafor";

export default interface ResultPost {
  id?: string;
  isFinished: boolean;
  isMobile?: boolean;
  results?: SemaforResult & PostForm & { inputDevice?: string };
  windowWidth: number;
  allDocsResponse?: QuerySnapshot<DocumentData>;
  docsIdsToLoad: string[];
  dbDocPaginated: DocumentData;
  lastId: number;
  isLogged: boolean;
  resultsAllRounded: { value: number; totalCount: number };
  resultsAllRoundedDesktop: { value: number; totalCount: number };
  resultsAllRoundedMobile: { value: number; totalCount: number };
  resultsAllMediansRounded: { value: number; totalCount: number };
  resultsAllMediansRoundedDesktop: { value: number; totalCount: number };
  resultsAllMediansRoundedMobile: { value: number; totalCount: number };
  docArray: DocumentData[],
  roundedValuesCorrDesktop: number[],
  roundedValuesCorrMobile: number[],
  compareMesssage?: string,
}
