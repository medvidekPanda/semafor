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
}
