import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

import ResultPost from "../types/results-post.model";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { state } from "./state";

export const key: InjectionKey<Store<ResultPost>> = Symbol();

export const store = createStore<ResultPost>({
  state: state,
  mutations: mutations,
  actions: actions,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useStore () {
  return baseUseStore(key)
}
