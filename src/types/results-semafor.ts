import SemaforRound from "./results-round";

export default interface SemaforResult {
  roundedValue?: number;
  rounds?: SemaforRound[];
}
