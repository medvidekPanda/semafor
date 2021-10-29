import { FirebaseDocs } from "@/config/firebase";
import { compareNumbers } from "@/helpers/compare-numbers";
import { mapSortValues, removeFirstLastValue, summarizeValues } from "@/helpers/map-sort-values";
import { SemaforRound } from "@/types/results/results-round";
import { AdminModel } from "@/types/state/admin-model";
import { StateModel } from "@/types/state/state-model";
import { DocumentData, QuerySnapshot } from "@firebase/firestore-types";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ActionContext } from "vuex";

export const adminMutations = {
  async addMedian({
    state,
  }: ActionContext<AdminModel, StateModel>): Promise<void> {
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
  createCorrectedRound(state: Partial<AdminModel>, data: DocumentData): void {
    const desktopArray = removeFirstLastValue(mapSortValues(data, "desktop"));
    const mobileArray =   removeFirstLastValue(mapSortValues(data, "mobile"));
    const desktopValue = summarizeValues(desktopArray);
    const mobileValue = summarizeValues(mobileArray);

    if (desktopValue && !mobileValue) {
      state.roundedValuesCorrDesktop?.push(desktopValue);
    } else if (!desktopValue && mobileValue) {
      state.roundedValuesCorrMobile?.push(mobileValue);
    } else if (desktopValue && mobileValue) {
      state.roundedValuesCorrDesktop?.push(desktopValue);
      state.roundedValuesCorrMobile?.push(mobileValue);
    }
  },
  generateExport(
    state: Partial<AdminModel>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let data = payload.docs[0].data();

    const desktopArray: Array<number> = data.desktop?.rounds
      ?.map((item: SemaforRound) => String(item.value))
      .sort(compareNumbers);

    const mobileArray: Array<number> = data.mobile?.rounds
      ?.map((item: SemaforRound) => String(item.value))
      .sort(compareNumbers);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const firstDesktop = desktopArray?.shift();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const lastDesktop = desktopArray?.pop();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const firstMobile = mobileArray?.shift();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const lastMobile = mobileArray?.pop();

    let desktopValue = 0;
    desktopArray?.forEach((value) => {
      desktopValue = desktopValue + Number(value);
    });

    let mobileValue = 0;
    mobileArray?.forEach((value) => {
      mobileValue = mobileValue + Number(value);
    });

    if (desktopValue && !mobileValue) {
      data = {
        ...data,
        desktop: {
          ...data.desktop,
          roundedValueCorrected: String((desktopValue / 3).toFixed(2)),
        },
      };
    } else if (!desktopValue && mobileValue) {
      data = {
        ...data,
        mobile: {
          ...data.mobile,
          roundedValueCorrected: String((mobileValue / 3).toFixed(2)),
        },
      };
    } else if (desktopValue && mobileValue) {
      data = {
        ...data,
        desktop: {
          ...data.desktop,
          roundedValueCorrected: String((desktopValue / 3).toFixed(2)),
        },
        mobile: {
          ...data.mobile,
          roundedValueCorrected: String((mobileValue / 3).toFixed(2)),
        },
      };
    }
    data.sex[0] === "male" ? (data.sex = 0) : (data.sex = 1);
    state.docArray?.push({ data });
  },
  getAllDocs(
    state: Partial<AdminModel>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    state.allDocsResponse = payload;
    state.lastId = state.allDocsResponse.docs.length - 1 || 0;
  },
  getAllDesktop(
    state: Partial<AdminModel>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let reults = 0;
    payload.docs.forEach((element) => {
      reults = reults + Number(element.data().desktop.roundedValue);
    });
    state.resultsAllRoundedDesktop = {
      value: Number((reults / payload.docs.length).toFixed(2)),
      totalCount: payload.docs.length,
    };
  },
  getAllMediansDesktop(
    state: Partial<AdminModel>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let reults = 0;
    payload.docs.forEach((element) => {
      reults = reults + Number(element.data().desktop.median);
    });
    state.resultsAllMediansRoundedDesktop = {
      value: Number((reults / payload.docs.length).toFixed(2)),
      totalCount: payload.docs.length,
    };
  },
  getAllMediansMobile(
    state: Partial<AdminModel>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let reults = 0;
    payload.docs.forEach((element) => {
      reults = reults + Number(element.data().mobile.median);
    });
    state.resultsAllMediansRoundedMobile = {
      value: Number((reults / payload.docs.length).toFixed(2)),
      totalCount: payload.docs.length,
    };
  },
  getAllMobile(
    state: Partial<AdminModel>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let reults = 0;
    payload.docs.forEach((element) => {
      reults = reults + Number(element.data().mobile.roundedValue);
    });
    state.resultsAllRoundedMobile = {
      value: Number((reults / payload.docs.length).toFixed(2)),
      totalCount: payload.docs.length,
    };
  },
  getDocsByIdPaginated(
    state: Partial<AdminModel>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    const docsIds: DocumentData = [];
    payload.docs.forEach((doc) => {
      docsIds.push(doc.data());
    });
    state.dbDocPaginated = docsIds;
  },
  setDocsPagination(
    state: Partial<AdminModel>,
    payload: { firstIndex: number; limit: number }
  ): void {
    state.docsIdsToLoad = [];
    const lastId = state.lastId || 0;
    const nextLastIndex = payload.limit + payload.firstIndex;
    const limit = lastId < nextLastIndex ? lastId + 1 : nextLastIndex;

    for (let i = payload.firstIndex; i < limit; i++) {
      state.docsIdsToLoad.push(state.allDocsResponse?.docs[i]?.id || "");
    }
  },
};
