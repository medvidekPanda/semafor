import { SemaforRound } from "./results-round";

export interface SemaforResultBase {
  roundedValue?: string;
  roundedValueCorrected?: string;
  median?: string;
  rounds?: SemaforRound[];
}
export default interface SemaforResult {
  mobile?: SemaforResultBase;
  desktop?: SemaforResultBase;
}
