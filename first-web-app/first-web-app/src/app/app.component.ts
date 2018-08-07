import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  public listObject:any;

  public constructor() {
   this.listObject =  [
      {"element": "Srinivasa"},
      {"element": "Kavya"},
      {"element": "Santosh"}
     ];
  }
}
