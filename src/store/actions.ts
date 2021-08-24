/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionContext } from "vuex";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import ResultPost from "../types/results-post.model";
import { FirebaseDocs } from "@/config/firebase";
// import { QueryDocumentSnapshot, DocumentData } from "@firebase/firestore-types";

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
  async getAllDb({
    state,
  }: ActionContext<ResultPost, ResultPost>): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    await db.get().then((res) => (state.dbResponse = res));
  },
  async getDbPagination(
    { state }: ActionContext<ResultPost, ResultPost>,
    { orderBy, limit }: any
  ): Promise<any> {
    // let lastDoc: QueryDocumentSnapshot<DocumentData> | string = "";

    const db = firebase
      .firestore()
      .collection(FirebaseDocs.firebaseDocName)
      .orderBy(orderBy)
      .startAfter(state.lastDoc)
      .limit(limit);

    return await db.get().then((res) => {
      state.lastDoc = res.docs[res.docs.length - 1];
      state.dbPagination = res.docs;
    });
  },
  async getDocDb({ state }: any): Promise<void> {
    state.dbDoc = [];
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    await state.dbPagination?.forEach((element: any) => {
      db.doc(element.id)
        .get()
        .then((res) => state.dbDoc?.push(res.data()));
    });
  },
};
