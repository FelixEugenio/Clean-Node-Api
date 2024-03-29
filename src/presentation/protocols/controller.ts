import { HttRequest, HttpResponse } from "./http";

export interface Controller {
    handle(httpRequest:HttRequest):Promise<HttpResponse>
}