import SemaforRound from "./results-round";

export interface SemaforResultBase {
  roundedValue?: number;
  rounds?: SemaforRound[];
}
export default interface SemaforResult {
  mobile?: SemaforResultBase;
  desktop?: SemaforResultBase;
}
