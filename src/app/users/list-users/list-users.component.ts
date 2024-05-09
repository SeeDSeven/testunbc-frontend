import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/core/user/user.service';
import { User } from 'src/core/user/user.types';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit{
  users: User[];

  constructor(
    private _router: Router,
    private _userService: UserService,
  ) {
  }
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this._userService.getusers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

}
