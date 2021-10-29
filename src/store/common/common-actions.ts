import { CommonModuleModel } from "@/types/state/common-model";
import { StateModel } from "@/types/state/state-model";
import { ActionContext } from "vuex";

export const actionsCommon = {
  getWindowWidth(
    { commit }: ActionContext<CommonModuleModel, StateModel>,
    payload: number
  ): void {
    commit("getWindowWidth", payload);
  },
}