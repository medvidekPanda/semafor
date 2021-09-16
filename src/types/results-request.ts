export default interface ResultsRequest {
  age: string;
  email: string;
  inputDevice?: string;
  isMobile?: boolean;
  sex: string | number;
  resultHash: string;
  results?: [];
}
