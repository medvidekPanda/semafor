import { ActionContext } from "vuex";
import firebase from "firebase/app";
import { WhereFilterOp } from "@firebase/firestore-types";
import "firebase/firestore";
import "firebase/auth";

import ResultPost from "../types/results-post.model";
import { FirebaseDocs } from "@/config/firebase";

export const actions = {
  async saveSemaforResults(
    { commit }: ActionContext<ResultPost, ResultPost>,
    payload: Partial<ResultPost>
  ): Promise<void> {
    commit("saveSemaforResults", payload);
  },
  async postResults({
    state,
  }: ActionContext<ResultPost, ResultPost>): Promise<string | void> {
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
        (
          result: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
        ): Promise<string | void> => {
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
  clearStore({ commit }: ActionContext<ResultPost, ResultPost>): void {
    commit("clearStore");
  },
  getWindowWidth(
    { commit }: ActionContext<ResultPost, ResultPost>,
    payload: Partial<ResultPost>
  ): void {
    commit("getWindowWidth", payload);
  },
  async getAllDocs({
    commit,
  }: ActionContext<ResultPost, ResultPost>): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    await db.get().then((res) => {
      commit("getAllDocs", res);
    });
  },
  async getDocsById(
    { state, commit }: ActionContext<ResultPost, ResultPost>,
    { commitName, query }: any
  ): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    const defaultQuerry = {
      whatFind: firebase.firestore.FieldPath.documentId(),
      filterOp: "in",
      value: state.docsIdsToLoad,
    };
    const finalQuerry = query || defaultQuerry;

    db.where(
      finalQuerry.whatFind,
      finalQuerry.filterOp as WhereFilterOp,
      finalQuerry.value
    )
      .get()
      .then((res) => {
        commit(commitName, res);
      });
  },
};
