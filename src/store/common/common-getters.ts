import { CommonModuleModel } from "@/types/state/common-model";

export const gettersCommon = {
  isLogged: ({ isLogged }: Partial<CommonModuleModel>): boolean | undefined => {
    return isLogged;
  },
  windowWidth: ({
    windowWidth,
  }: Partial<CommonModuleModel>): number | undefined => {
    return windowWidth;
  },
};
