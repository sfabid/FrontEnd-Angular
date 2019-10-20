import { Component, OnInit, ViewChild } from '@angular/core';
import { Global } from 'src/app/shared/Global';
import { DBOperation } from 'src/app/shared/Enums';
import { Patient } from 'src/app/models/Patient';
import { PatientFormComponent  } from "../patient-form/patient-form.component";
import { MatTableDataSource, MatSnackBar, MatDialog, MatSort } from '@angular/material';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit  {
  patients: Patient[];
  patient: Patient;
  loadingState: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;

  // set columns that will need to show in listing table  
  displayedColumns = ['id','title', 'firstName', 'middleName', 'lastName', 'suffix', 'action'];
  // setting up datasource for material table
  dataSource = new MatTableDataSource<Patient>();

  constructor(public snackBar: MatSnackBar, private patientService: PatientService, private dialog: MatDialog) { }
  @ViewChild(MatSort, {static:true}) sort: MatSort;
  ngOnInit() {    
    this.loadingState = true;
    this.loadPatients();
    this.dataSource.sort = this.sort;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      width: '700px',
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, patient: this.patient }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'success') {
        this.loadingState = true;
        this.loadPatients();
        switch (this.dbops) {
          case DBOperation.create:
            this.showMessage('Patient successfully added.');
            break;
          case DBOperation.update:
            this.showMessage('Patient successfully updated.');
            break;
          case DBOperation.delete:
            this.showMessage('Patient successfully deleted.');
            break;
        }
      } else if (result === 'error') {
        this.showMessage('There is some issue in saving records, please contact to system administrator!');
      } else {
       // this.showMessage('Please try again, something went wrong');
      }
    });
  }

  loadPatients(): void {
    this.patientService.get(Global.BASE_PATIENT_ENDPOINT)
      .subscribe(patients=> {
        this.loadingState = false;
        this.dataSource.data = patients;
      });
  }
 
  addPatient() {
    this.dbops = DBOperation.create;
    this.modalTitle = 'Add New Patient';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  editPatient(id: number) {
    this.dbops = DBOperation.update;
    this.modalTitle = 'Edit Patient';
    this.modalBtnTitle = 'Update';
    this.patient = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  deletePatient(id: number) {
    this.dbops = DBOperation.delete;
    this.modalTitle = 'Confirm to Delete ?';
    this.modalBtnTitle = 'Delete';
    this.patient = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  showMessage(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000
    });
  }
}
