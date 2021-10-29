import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import { actions } from "./actions";
import { actionsCommon } from "./common/actions-common";
import { gettersCommon } from "./common/getters-common";
import { mutationsCommon } from "./common/mutations-common";
import { stateCommon } from "./common/state-common";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { state } from "./state";

export const key: InjectionKey<Store<any>> = Symbol();

const resultModule = {
  actions: actions,
  getters: getters,
  mutations: mutations,
  state: state,
};

const commonModule = {
  actions: actionsCommon,
  getters: gettersCommon,
  mutations: mutationsCommon,
  state: stateCommon,
};

export const store = createStore({
  modules: {
    resultModule,
    commonModule,
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useStore() {
  return baseUseStore(key);
}
