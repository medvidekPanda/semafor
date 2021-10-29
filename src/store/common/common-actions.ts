import { CommonModuleModel } from "@/types/common-model";
import { StateModel } from "@/types/state-model";
import { ActionContext } from "vuex";

export const actionsCommon = {
  getWindowWidth(
    { commit }: ActionContext<CommonModuleModel, StateModel>,
    payload: number
  ): void {
    commit("getWindowWidth", payload);
  },
}