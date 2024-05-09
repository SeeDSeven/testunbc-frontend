import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/core/user/user.service';
import { User } from 'src/core/user/user.types';

const matchPasswordsValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  return password && repeatPassword && password.value !== repeatPassword.value ? { passwordsNotMatch: true } : null;
};

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit{

  usuario: User = {} as User;
  usuarioNuevo = false;
  formularioUsuario: FormGroup;

  constructor(
    private _userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ){

  }

  ngOnInit(): void {
    this.formularioUsuario = this.formBuilder.group({
      name: ['harold', Validators.required],
      email: ['harold@correo.com', [Validators.required, Validators.email]],
      password: ['password123'],
      repeatPassword: ['password123']
    }, { validator: matchPasswordsValidator });

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
        this.formularioUsuario.patchValue(user);
      },
      error: (error: any) => {
        console.log(error);
        this.router.navigate(['/users']);
      }
    });
  }

  crearUsuario(){
    if(this.formularioUsuario.invalid){
      return;
    }
    const newUser = this.formularioUsuario.getRawValue() as User;

    this._userService.createuser(newUser).subscribe({
      next: (user: User) => {
        this.router.navigate(['/users']);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  actualizarUsuario(){
    if(this.formularioUsuario.invalid){
      return;
    }
    const newUser = this.formularioUsuario.getRawValue() as User;

    this._userService.updateUser(this.usuario.id, newUser).subscribe({
      next: (user: User) => {
        this.router.navigate(['/users']);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  eliminarUsuario(){

    this._userService.deleteuser(this.usuario.id.toString()).subscribe({
      next: (response: any) => {
        this.router.navigate(['/users']);
      },
      error: (error: any) => {
        alert('no fue posible eliminar el usuario');
        console.log(error);
      }
    });
  }
}
