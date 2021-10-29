import PostForm from "../results/post-form";
import SemaforResult from "../results/results-semafor";

export interface TableRowBase extends PostForm, SemaforResult {
  uid: string;
}

export interface TableRow {
  row: TableRowBase;
}
