import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userInitials: ['', Validators.required],
      userAddress: ['', Validators.required]
    });
  }

  addUser() {
    if (this.userForm.valid) {
      this.api.postUser(this.userForm.value)
        .subscribe({
          next: (res) => {
            alert('Пользователь успешно добавлен!');
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert('Что-то пошло не так!');
          }
        });
    }
  }
}
