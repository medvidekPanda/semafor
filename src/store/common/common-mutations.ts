import { CommonModuleModel } from "@/types/state/common-model";

export const mutationsCommon = {
  getWindowWidth(state: Partial<CommonModuleModel>, payload: number): void {
    state.windowWidth = payload | 0;
  },
  isLogged(state: Partial<CommonModuleModel>, payload: boolean): void {
    state.isLogged = payload;
  },
};
