import { FirebaseDocs } from "@/config/firebase";
import GetDocsByIdRequest from "@/types/docs-by-id.request";
import { AdminModel } from "@/types/state/admin-model";
import { StateModel } from "@/types/state/state-model";
import { WhereFilterOp } from "@firebase/firestore-types";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ActionContext } from "vuex";

export const adminActions = {
  async addCorrectedRounded({
    state,
    commit,
  }: ActionContext<AdminModel, StateModel>): Promise<void> {
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
  async getAllDocs({ commit }: ActionContext<AdminModel, StateModel>): Promise<void> {
    const db = firebase.firestore().collection(FirebaseDocs.firebaseDocName);
    await db.get().then((res) => {
      commit("getAllDocs", res);
    });
  },
  async getDocsById(
    { state, commit }: ActionContext<AdminModel, StateModel>,
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
};
