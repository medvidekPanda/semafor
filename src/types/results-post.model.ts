import PostForm from "./post-form";
import SemaforResult from "./results-semafor";

export default interface ResultPost {
  id?: string;
  results?: SemaforResult & PostForm & { isMobile?: boolean } & { inputDevice?: string };
}
