import { Component, OnInit } from '@angular/core';
import { UserInfoModel } from '../models';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {

  user: UserInfoModel = new UserInfoModel({
    guid: "D21ds12x",
    customerUid: "cust2dsa12dsa",
    first_name: "John",
    last_name: "Doe",
    email: "email@email.com",
    zipcode: 10283,
    password: "Idasn2x2#"
  });

  constructor() { }

  ngOnInit() {

  }

}
