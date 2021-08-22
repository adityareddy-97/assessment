import {  Component, OnInit,ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit } from '@/_models';
import { User } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';

import {MatTableDataSource,MatSort, MatPaginator} from '@angular/material';

@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit
{
    currentUser: User;
    audits = [];

    displayedColumns = [ 'ip', 'loginTime', 'logoutTime','user'];
    dataSource: MatTableDataSource<any>;

    formattedDate;
    today;

    @ViewChild(MatSort,{ static: false }) sort: MatSort;
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;

    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService
    )
    {
        this.currentUser = this.authenticationService.currentUserValue;
        this.today = new Date();
    }

    ngOnInit()
    {
        console.log('ng oninit');
        this.loadAllAudits();
    }

    

    private loadAllAudits()
    {
        this.auditService.getAll()
            .pipe(first())
            .subscribe(audits => {
                this.audits = audits;
                this.dataSource = new MatTableDataSource(audits);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
      }

      onFormatChange($event){
          console.log('select',$event.value);
          let format = $event.value;
          
          let date = this.today.toISOString().split('T')[0].split('-').reverse().join('/');
          let time = this.today.toTimeString().split(' ')[0];
          let localeTime = this.today.getHours() >12 ? 'pm' : 'am';

          switch (format) {
              case 12:
                  let hours = (this.today.getHours() % 12) || 12;
                  let minutes = this.today.getMinutes();
                  let seconds = this.today.getSeconds();
                  time = `${hours}:${minutes}:${seconds}`;
                  this.formattedDate = `${date} ${time} ${localeTime}`;
                  break;
        
              case 24:
                  this.formattedDate = `${date} ${time} ${localeTime}`;
                  break;      
                  
              default:
                  break;
          }
        
      }

      

}