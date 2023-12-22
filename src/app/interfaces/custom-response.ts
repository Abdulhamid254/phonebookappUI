import { Contact } from "./contact";


export interface CustomResponse {
  timestamp: Date;
  statusCode: number;
  status: string;
  reason: string;
  message: string;
  developerMessage: string;
  // response we can get 1 contact or an array of contacts
  //optional bcoz we never gonna get them all at the same time
  data: { contacts?: Contact[], contact?: Contact}
}
