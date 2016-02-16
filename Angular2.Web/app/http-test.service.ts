import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

//to use map method on observable
import 'rxjs/add/operator/map'; 

@Injectable()
export class HttpTestService {
    constructor(private http: Http) { }

    getCurrentTime() {
        return this.http.get('http://localhost:3000/app/data/sampleData.json')
            .map(response => response.json());
    }
}