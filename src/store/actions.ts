import { ActionContext } from "vuex";
import firebase from "firebase/app";
import {
  DocumentData,
  DocumentSnapshot,
  WhereFilterOp,
} from "@firebase/firestore-types";
import "firebase/firestore";
import "firebase/auth";

import ResultPost from "../types/results-post.model";
import { FirebaseDocs } from "@/config/firebase";
import SemaforRound from "@/types/results-round";
import GetDocsByIdRequest from "@/types/docs-by-id.request";

function compareNumbers(a: string, b: string) {
  return Number(a) - Number(b);
}

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
    { commitName, query, docId }: GetDocsByIdRequest
  ): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    const defaultQuerry = {
      whatFind: firebase.firestore.FieldPath.documentId(),
      filterOp: "in",
      value: docId || state.docsIdsToLoad,
    };
    db.where(
      query?.whatFind || defaultQuerry.whatFind,
      (query?.filterOp as WhereFilterOp) ||
        (defaultQuerry.filterOp as WhereFilterOp),
      query?.value || defaultQuerry.value
    )
      .get()
      .then((res) => {
        commit(commitName, res);
      });
  },
  async addMedian({
    state,
  }: ActionContext<ResultPost, ResultPost>): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    state.allDocsResponse?.docs.forEach((doc) => {
      db.doc(doc.id)
        .get()
        .then((res) => {
          const data = res.data();

          if (data) {
            let payload = {};
            const desktopMedian: string = data.desktop?.rounds
              .map((item: SemaforRound) => String(item.value))
              .sort(compareNumbers)[2];

            const mobileMedian: string = data.mobile?.rounds
              .map((item: SemaforRound) => String(item.value))
              .sort(compareNumbers)[2];

            if (desktopMedian && !mobileMedian) {
              payload = { desktop: { median: desktopMedian, ...data.desktop } };
            } else if (!desktopMedian && mobileMedian) {
              payload = { mobile: { median: mobileMedian, ...data.mobile } };
            } else if (desktopMedian && mobileMedian) {
              payload = {
                desktop: { median: desktopMedian, ...data.desktop },
                mobile: { median: mobileMedian, ...data.mobile },
              };
            }

            new Promise((resolve) => {
              resolve(db.doc(doc.id).update(payload));
            });
          }
        });
    });
  },
};
