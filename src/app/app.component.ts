import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { timer } from 'rxjs';
import { filter, map, pairwise, throttleTime } from 'rxjs/operators';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['userInitials', 'userAddress', 'action'];
  dataSource!: MatTableDataSource<any>;
  loading = false;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(CdkVirtualScrollViewport) scroller!: CdkVirtualScrollViewport;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit(): void {
    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1) && (y2 < 96)),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.getAllUsers();
      });
    });
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
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
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
        },
        error: () => {
          alert('Что-то пошло не так!');
        }
      });

    this.loading = true;
    timer(5000).subscribe(() => {
      this.loading = false;
    });
  }

  editUser(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
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
