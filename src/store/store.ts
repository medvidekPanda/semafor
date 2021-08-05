import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

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
