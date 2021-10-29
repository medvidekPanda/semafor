import { DocumentData } from "@firebase/firestore-types";
import PostForm from "../results/post-form";
import SemaforResult from "../results/results-semafor";

export interface ResultsTestBase extends SemaforResult, PostForm {
  inputDevice?: string;
}
export interface ResultsTest extends SemaforResult, PostForm {
  results?: ResultsTestBase;
}
export interface ResultPost extends ResultsTest {
  id?: string;
  isFinished: boolean;
  isMobile?: boolean;
  docArray: DocumentData[];
  compareMesssage?: string;
}
