import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['userInitials', 'userAddress', 'action'];
  dataSource!: TableVirtualScrollDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      panelClass: ['dialog-responsive']
    }).afterClosed().subscribe(value => {
      if (value === 'save') {
        this.getAllUsers();
      }
    });
  }

  getAllUsers() {
    this.api.getUser()
      .subscribe({
        next: (res) => {
          this.dataSource = new TableVirtualScrollDataSource(res);
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert('Что-то пошло не так!');
        }
      });
  }

  editUser(row: any) {
    this.dialog.open(DialogComponent, {
      panelClass: ['dialog-responsive'],
      data: row
    }).afterClosed().subscribe(value => {
      if (value === 'update') {
        this.getAllUsers();
      }
    });
  }

  deleteUser(id: number) {
    this.api.deleteUser(id)
      .subscribe({
        next: (res) => {
          alert('Пользователь успешно удалён!');
          this.getAllUsers();
        },
        error: () => {
          alert('Что-то пошло не так!');
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
