import { ActionContext } from "vuex";
import firebase from "firebase/app";
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
      commit("getAllDocs", res)
    });
  },
  async getdocsIdsToLoad(
    { commit }: ActionContext<ResultPost, ResultPost>,
    { orderBy, startAfter, limit }: any
  ): Promise<void> {
    const db = firebase
      .firestore()
      .collection(FirebaseDocs.firebaseDocName)
      .orderBy(orderBy || "")
      .startAfter(startAfter)
      .limit(limit || 10);
    await db.get().then((res) => {
      commit("getdocsIdsToLoad", res);
    });
  },
  async getDocsById({
    state,
    commit,
  }: ActionContext<ResultPost, ResultPost>): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    db.where(firebase.firestore.FieldPath.documentId(), "in", state.docsIdsToLoad)
      .get()
      .then((res) => {
        commit("getDocsById", res);
      });
  },
};
