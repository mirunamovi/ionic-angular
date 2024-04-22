import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.css'],
})
export class HomePage {
  userName: any;

  constructor(private http: HttpClient) { }
  ngOnInit() {
    // Make HTTP request to fetch user information
    this.userName = this.http.get<any>('http://192.168.0.104:4000/user').pipe(
      map((response: any) => response.name.value)
    );
  }
}
