import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { environment } from "../../../environments/environment";

@Service()
export class BaseHttpService {

  http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  authUrl = environment.authUrl;

}
