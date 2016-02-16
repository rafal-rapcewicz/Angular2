import {Component} from 'angular2/core';
import {HttpTestService} from './http-test.service'

@Component({
    selector: 'http-test',
    template: `
    <button (click)="onTestGet()">Test GET Request</button><br>
    <p>Output: {{getData}}</p>
    <button>Test POST Request</button><br>
    <p>Output: {{postData}}</p>
`,
    providers: [HttpTestService]
})
export class HTTPTestComponent {
    getData: string;
    postData: string;

    constructor(private httpService: HttpTestService) { }

    onTestGet() {
        this.httpService.getCurrentTime()
            .subscribe(
            data => this.getData = JSON.stringify(data),
            error => console.log(error),
            () => console.log('Finished')
            );
    }
}