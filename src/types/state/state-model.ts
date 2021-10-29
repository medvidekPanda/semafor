import { AdminModel } from "./admin-model";
import { CommonModuleModel } from "./common-model";
import ResultPost from "./results-post.model";

export interface StateModel {
  adminModule: AdminModel;
  commonModule: CommonModuleModel;
  resultModule: ResultPost;
}
