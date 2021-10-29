import { StateModel } from "@/types/state/state-model";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import { adminActions } from "./admin/admin-actions";
import { adminGetters } from "./admin/admin-getters";
import { adminMutations } from './admin/admin-mutations';
import { adminState } from './admin/admin-state';
import { actionsCommon } from "./common/common-actions";
import { gettersCommon } from "./common/common-getters";
import { mutationsCommon } from "./common/common-mutations";
import { stateCommon } from "./common/common-state";
import { resultsActions } from "./results/results-actions";
import { resultsGetters } from "./results/results-getters";
import { resultsMutations } from "./results/results-mutations";
import { resultsState } from "./results/results-state";


export const key: InjectionKey<Store<StateModel>> = Symbol();

const adminModule = {
  actions: adminActions,
  getters: adminGetters,
  mutations: adminMutations,
  state: adminState,
};

const commonModule = {
  actions: actionsCommon,
  getters: gettersCommon,
  mutations: mutationsCommon,
  state: stateCommon,
};

const resultModule = {
  actions: resultsActions,
  getters: resultsGetters,
  mutations: resultsMutations,
  state: resultsState,
};

export const store = createStore<StateModel>({
  modules: {
    adminModule,
    commonModule,
    resultModule,
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useStore() {
  return baseUseStore(key);
}
