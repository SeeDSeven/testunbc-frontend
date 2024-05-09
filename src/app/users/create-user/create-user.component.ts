import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/core/user/user.service';
import { User } from 'src/core/user/user.types';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit{

  usuario: User = {} as User;
  usuarioNuevo = false;

  constructor(
    private _userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ){

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id === 'new'){
      this.usuarioNuevo = true;
    }else if (id !== null || id !== undefined){
      this.getUser(id);
    }else{
      this.router.navigate(['/users']);
    }
  }

  getUser(id: string){
    this._userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.usuario = user;
      },
      error: (error: any) => {
        console.log(error);
        this.router.navigate(['/users']);
      }
    });
  }
}
