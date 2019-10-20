import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DBOperation } from 'src/app/shared/Enums';
import { Global } from 'src/app/shared/Global';
import { PatientService } from 'src/app/services/patient.service';
import { PatientListComponent } from '../paitent-list/patient-list.component';
import { Patient } from 'src/app/models/Patient';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  msg: string;
  indLoading = false;
  patientFrm: FormGroup;  
  listFilter: string;
  selectedOption: string;  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private patientService: PatientService,
    public dialogRef: MatDialogRef<PatientListComponent>) { }

  ngOnInit() {  
      this.patientFrm = this.fb.group({
      id:[''] , 
      title: [''],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      suffix: [''],      
    });
 
    // subscribe on value changed event of form to show validation message
    this.patientFrm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === DBOperation.create) {
      this.patientFrm.reset();
    } else {
      this.patientFrm.setValue(this.data.patient);
    }
    this.SetControlsState(this.data.dbops === DBOperation.delete ? false : true);
  }
  // form value change event
  onValueChanged(data?: any) {
    if (!this.patientFrm) { return; }
    const form = this.patientFrm;
    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      // setup custom validation message to form
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  // form errors model

  formErrors = {
    'id': '',
    'title': '',
    'firstName': '',
    'middleName': '',
    'lastName': '',    
    'suffix': ''
  };
  // custom valdiation messages
  // tslint:disable-next-line:member-ordering
  validationMessages = {
    'id': {      
      'required': 'Id is required.'
    },
    'title': {
      'required': 'title is required.'
    },
    'firstName': {
      'maxlength': 'First Name cannot be more than 20 characters long.',
      'required': 'First Name is required.'
    },
    'middleName': {      
      'required': 'Middle Name is required.'
    },
    'lastName': {
      'required': 'Last Name is required.'
    },
    'suffix': {
      'required': 'Suffix is required.'
    }

  };
  onSubmit(formData: any) {    
    const patientData = this.mapDateData(formData.value);
    switch (this.data.dbops) {
      case DBOperation.create:
        this.patientService.post(Global.BASE_PATIENT_ENDPOINT, patientData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case DBOperation.update:
        this.patientService.put(Global.BASE_PATIENT_ENDPOINT, patientData.id, patientData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case DBOperation.delete:
        this.patientService.delete(Global.BASE_PATIENT_ENDPOINT, patientData.id).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
    }
  }
  SetControlsState(isEnable: boolean) {
    isEnable ? this.patientFrm.enable() : this.patientFrm.disable();
  }

  mapDateData(patient: Patient): Patient {        
    if(!patient.id)
      patient.id=0
    return patient;
  }
}
