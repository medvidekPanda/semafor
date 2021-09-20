import SemaforRound from "@/types/results-round";
import { QuerySnapshot, DocumentData } from "@firebase/firestore-types";

import ResultPost from "../types/results-post.model";

export const mutations = {
  saveSemaforResults(state: ResultPost, payload: Partial<ResultPost>): void {
    const results = { ...state.results, ...payload.results };
    state.id = payload.id;
    state.results = results;
    state.isFinished = payload.isFinished || state.isFinished;
    state.isMobile = payload.isMobile || state.isMobile;
  },
  clearStore(state: ResultPost): void {
    state.id = undefined;
    state.results = undefined;
    state.isFinished = false;
    state.compareMesssage = undefined;
  },
  getWindowWidth(state: Partial<ResultPost>, payload: number): void {
    state.windowWidth = payload | 0;
  },
  getAllDocs(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    state.allDocsResponse = payload;
    state.lastId = state.allDocsResponse.docs.length - 1 || 0;
  },
  getDocsByIdPaginated(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    const docsIds: DocumentData = [];
    payload.docs.forEach((doc) => {
      docsIds.push(doc.data());
    });
    state.dbDocPaginated = docsIds;
  },
  setDocsPagination(state: Partial<ResultPost>, payload: any): void {
    state.docsIdsToLoad = [];
    const lastId = state.lastId || 0;
    const nextLastIndex = payload.limit + payload.firstIndex;
    const limit = lastId < nextLastIndex ? lastId + 1 : nextLastIndex;

    for (let i = payload.firstIndex; i < limit; i++) {
      state.docsIdsToLoad.push(state.allDocsResponse?.docs[i]?.id || "");
    }
  },
  isLogged(state: Partial<ResultPost>, payload: boolean): void {
    state.isLogged = payload;
  },
  getAllDesktop(
    state: Partial<ResultPost>,
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
  getAllMobile(
    state: Partial<ResultPost>,
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
  getAllMediansDesktop(
    state: Partial<ResultPost>,
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
    state: Partial<ResultPost>,
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
  generateExport(
    state: Partial<ResultPost>,
    payload: QuerySnapshot<DocumentData>
  ): void {
    let data = payload.docs[0].data();

    function compareNumbers(a: string, b: string) {
      return Number(a) - Number(b);
    }
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
  clearDocArray(state: Partial<ResultPost>): void {
    state.docArray = [];
  },
  createCorrectedRound(state: Partial<ResultPost>, data: DocumentData): void {
    function compareNumbers(a: string, b: string) {
      return Number(a) - Number(b);
    }

    const desktopArray = data.desktop?.rounds
      ?.map((item: SemaforRound) => String(item.value))
      .sort(compareNumbers);

    const mobileArray = data.mobile?.rounds
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
    desktopArray?.forEach((value: any) => {
      desktopValue = (desktopValue + Number(value)) / 3;
    });

    let mobileValue = 0;
    mobileArray?.forEach((value: any) => {
      mobileValue = (mobileValue + Number(value)) / 3;
    });

    if (desktopValue && !mobileValue) {
      state.roundedValuesCorrDesktop?.push(desktopValue);
    } else if (!desktopValue && mobileValue) {
      state.roundedValuesCorrMobile?.push(mobileValue);
    } else if (desktopValue && mobileValue) {
      state.roundedValuesCorrDesktop?.push(desktopValue);
      state.roundedValuesCorrMobile?.push(mobileValue);
    }
  },
  findClosest(state: Partial<ResultPost>, data: DocumentData): void {
    function compareNumbers(a: number, b: number) {
      return Number(a) - Number(b);
    }
    const sorted = data.docs[0]
      .data()
      .roundedValuesCorrDesktop.sort(compareNumbers);
    const resultToCompare = Number(
      state.results?.desktop?.roundedValueCorrected
    );
    const closestIndex = (num: number, arr: number[]) => {
      let curr = arr[0],
        diff = Math.abs(num - curr);
      let index = 0;
      for (let val = 0; val < arr.length; val++) {
        const newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
          diff = newdiff;
          curr = arr[val];
          index = val;
        }
      }
      return index;
    };
    const sortedIndex = closestIndex(resultToCompare, sorted);
    let compareMessage = undefined;
    if (sorted[sortedIndex] < resultToCompare) {
      compareMessage = `Počet lidí, kteří byli lepší než ty: ${
        sortedIndex + 1
      } z celkových ${sorted.length}`;
    } else {
      compareMessage = `Počet lidí, kteří byli lepší než ty: ${sortedIndex} z celkových ${sorted.length}`;
    }
    state.compareMesssage = compareMessage;
  },
};
