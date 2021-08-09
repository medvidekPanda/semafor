import { Store } from "vuex";
import { ResultPost } from "@/types/results-post.model";

declare module "@vue/runtime-core" {

  // define injection key
  export const key: InjectionKey<Store<ResultPost>> = Symbol()
  interface ComponentCustomProperties {
    $store: Store<ResultPost>;
  }
}
