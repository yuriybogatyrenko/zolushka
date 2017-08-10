import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class UsersService {

    constructor(private _http: Http) {
    }

    getNewUsers(count: number) {
        return this._http.get(`api.zolushka.ru/users/new/${count}`).map((response: Response) => response.json());
    }

    getTopUsers(count: number) {
        return this._http.get(`api.zolushka.ru/users/top/${count}`).map((response: Response) => response.json());
    }

    getPopularUsers() {
        return this._http.get('api.zolushka.ru/users/popular').map((response: Response) => response.json());
    }

    searchUsers(searchArray: Array<any> = null) {
        let url = '/api/api/client/search';
        if (!!searchArray) {
            url += '?' + JSON.stringify(searchArray);
        }
        return this._http.get(url).map((response: Response) => response.json());
    }

}
