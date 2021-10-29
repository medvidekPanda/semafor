import { FirebaseDocs } from "@/config/firebase";
import GetDocsByIdRequest from "@/types/docs-by-id.request";
import SemaforRound from "@/types/results-round";
import { StateModel } from "@/types/state-model";
import {
  DocumentData,
  DocumentSnapshot,
  WhereFilterOp
} from "@firebase/firestore-types";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ActionContext } from "vuex";
import ResultPost from "../types/results-post.model";

function compareNumbers(a: string, b: string) {
  return Number(a) - Number(b);
}

export const actions = {
  async addMedian({
    state,
  }: ActionContext<ResultPost, StateModel>): Promise<void> {
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
  clearStore({ commit }: ActionContext<any, StateModel>): void {
    commit("clearStore");
  },
  async getAllDocs({ commit }: ActionContext<any, StateModel>): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    await db.get().then((res) => {
      commit("getAllDocs", res);
    });
  },
  async getDocsById(
    { state, commit }: ActionContext<any, any>,
    { commitName, query, docId }: GetDocsByIdRequest
  ): Promise<void> {
    await firebase.auth().signInAnonymously();
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
  async addCorrectedRounded({
    state,
    commit,
  }: ActionContext<ResultPost, StateModel>): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    state.allDocsResponse?.docs.forEach((doc) => {
      db.doc(doc.id)
        .get()
        .then((res) => {
          const data = res.data();
          commit("createCorrectedRound", data);
          const payload = {
            roundedValuesCorrDesktop: state.roundedValuesCorrDesktop,
            roundedValuesCorrMobile: state.roundedValuesCorrMobile,
          };
          new Promise((resolve) => {
            resolve(db.doc("values-rounded-corrected").update(payload));
          });
        });
    });
  },
  async isMobile(
    { commit }: ActionContext<any, StateModel>,
    payload: Partial<ResultPost>
  ): Promise<void> {
    commit("isMobile", payload);
  },
  async saveSemaforResults(
    { commit }: ActionContext<any, StateModel>,
    payload: Partial<ResultPost>
  ): Promise<void> {
    commit("saveSemaforResults", payload);
  },
  async postResults({
    state,
  }: ActionContext<any, any>): Promise<string | void> {
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
};
