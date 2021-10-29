import { FirebaseDocs } from "@/config/firebase";
import { StateModel } from "@/types/state/state-model";
import { DocumentData, DocumentSnapshot } from "@firebase/firestore-types";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ActionContext } from "vuex";
import { ResultPost } from "../../types/state/results-post.model";

export const resultsActions = {
  clearStore({ commit }: ActionContext<ResultPost, StateModel>): void {
    commit("clearStore");
  },
  async isMobile(
    { commit }: ActionContext<ResultPost, StateModel>,
    payload: Partial<ResultPost>
  ): Promise<void> {
    commit("isMobile", payload);
  },
  async postResults({
    state,
  }: ActionContext<ResultPost, StateModel>): Promise<string | void> {
    const db = firebase
      .firestore()
      .collection(FirebaseDocs.firebaseDocName)
      .doc(state.id);
    let uid = "";
    await firebase
      .auth()
      .signInAnonymously()
      .then((result) => {
        uid = (result.user && result.user.uid) || "";
      });

    return await db
      .get()
      .then(
        (result: DocumentSnapshot<DocumentData>): Promise<string | void> => {
          return new Promise((resolve, reject) => {
            const data = result.data();

            if (!result.exists) {
              resolve(db.set({ uid, ...state.results } || {}));
            } else if (
              (result.exists && state.isMobile && !data?.mobile) ||
              (result.exists && !state.isMobile && !data?.desktop)
            ) {
              resolve(db.update({ uid, ...state.results } || {}));
            } else {
              reject(`Záznam s hashem ${result.id} již existuje!`);
            }
          });
        }
      );
  },
  async saveSemaforResults(
    { commit }: ActionContext<ResultPost, StateModel>,
    payload: Partial<ResultPost>
  ): Promise<void> {
    commit("saveSemaforResults", payload);
  },
};
