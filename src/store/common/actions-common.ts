import { StateModel } from "@/types/state-model";
import { ActionContext } from "vuex";

export const actionsCommon = {
  getWindowWidth(
    { commit }: ActionContext<any, StateModel>,
    payload: number
  ): void {
    commit("getWindowWidth", payload);
  },
}