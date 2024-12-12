export interface APIError {
  status: number;
  data?: { detail?: string };
}
