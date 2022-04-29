import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DadataConfig, DadataType } from '@kolkov/ngx-dadata';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  userForm!: FormGroup;
  actionButton: string = 'Сохранить';

  configAddress: DadataConfig = {
    apiKey: '2e51c5fbc1a60bd48face95951108560bf03f7d9',
    type: DadataType.address,
  };

  configFio: DadataConfig = {
    apiKey: '2e51c5fbc1a60bd48face95951108560bf03f7d9',
    type: DadataType.fio,
  };

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userInitials: ['', Validators.required],
      userAddress: ['', Validators.required]
    });

    if (this.editData) {
      this.actionButton = 'Обновить';
      this.userForm.controls['userInitials'].setValue(this.editData.userInitials);
      this.userForm.controls['userAddress'].setValue(this.editData.userAddress);
    }
  }

  addUser() {
    if (!this.editData) {
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
    } else {
      this.updateUser();
    }
  }

  updateUser() {
    this.api.putUser(this.userForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert('Данные пользователя успешно обновлены!');
          this.userForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert('Что-то пошло не так!');
        }
      });
  }
}
