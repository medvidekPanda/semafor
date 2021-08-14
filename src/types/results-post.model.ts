import PostForm from "./post-form";
import SemaforResult from "./results-semafor";

export default interface ResultPost {
  id?: string;
  isFinished: boolean;
  isMobile?: boolean;
  results?: SemaforResult & PostForm & { inputDevice?: string };
  windowWidth: number;
}
