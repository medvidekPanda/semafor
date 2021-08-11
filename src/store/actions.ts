import { ActionContext } from "vuex";
import firebase from "firebase/app";
import "firebase/firestore";

import ResultPost from "../types/results-post.model";

export const actions = {
  async saveSemaforResults(
    { commit }: ActionContext<ResultPost, ResultPost>,
    payload: Partial<ResultPost>
  ): Promise<void> {
    commit("saveSemaforResults", payload);
  },
  async postResults({ state }: ActionContext<ResultPost, ResultPost>): Promise<string | void> {
    const db = firebase
      .firestore()
      .collection("perception-test-tl")
      .doc(state.id);

    return await db
      .get()
      .then((result: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Promise<string | void> => {
        return new Promise((resolve, reject) => {
          const data = result.data();

          if (!result.exists) {
            resolve(db.set(state.results || {}));
          } else if (
            result.exists && state.isMobile && !data?.mobile ||
            result.exists && !state.isMobile && !data?.desktop
            ) {
            resolve(db.update(state.results || {}));
          } else {
            reject(`Záznam s hashem ${result.id} již existuje!`);
          }
        })
      });

  },
  clearStore({ commit }: ActionContext<ResultPost, ResultPost>): void {
    commit("clearStore");
  }
};
