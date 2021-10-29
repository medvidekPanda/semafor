import { Store } from "vuex";

declare module "@vue/runtime-core" {

  // define injection key
  export const key: InjectionKey<Store<StateModel>> = Symbol()
  interface ComponentCustomProperties {
    $store: Store<StateModel>;
  }
}
