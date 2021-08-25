import { HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getStatusText,
  InMemoryDbService,
  RequestInfo,
  ResponseOptions,
} from 'angular-in-memory-web-api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class InMemUserService implements InMemoryDbService {
  createDb() {
    const users: User[] = [];

    return { users };
  }

  post(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;

    if (collectionName === 'users') {
      const { body } = reqInfo.req as any;

      const options: ResponseOptions =
        body.firstName === body.lastName
          ? {
              status: HttpStatusCode.BadRequest,
              body: {
                firstName: { invalid: 'invalid value' },
                lastName: { invalid: 'invalid value' },
              },
            }
          : { status: HttpStatusCode.Ok };

      return reqInfo.utils.createResponse$(() =>
        this.finishOptions(options, reqInfo)
      );
    }

    return undefined;
  }

  private finishOptions(
    options: ResponseOptions,
    { headers, url }: RequestInfo
  ) {
    options.statusText = getStatusText(options.status!);
    options.headers = headers;
    options.url = url;

    return options;
  }
}
