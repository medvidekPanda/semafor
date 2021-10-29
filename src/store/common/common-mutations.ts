import { CommonModuleModel } from "@/types/common-model";

export const mutationsCommon = {
  getWindowWidth(state: Partial<CommonModuleModel>, payload: number): void {
    state.windowWidth = payload | 0;
  },
  isLogged(state: Partial<CommonModuleModel>, payload: boolean): void {
    state.isLogged = payload;
  },
};
