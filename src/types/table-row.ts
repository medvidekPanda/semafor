import PostForm from "./post-form";
import SemaforResult from "./results-semafor";

interface TableRowBase extends PostForm, SemaforResult {
  uid: string;
}

export interface TableRow {
  row: TableRowBase;
}
