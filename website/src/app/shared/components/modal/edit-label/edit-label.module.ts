import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// BOOTSTRAP
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { EditLabelComponent } from './edit-label.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,
        AlertModule.forRoot()
    ],
    exports: [EditLabelComponent],
    declarations: [EditLabelComponent],
    providers: [],
})
export class EditLabelModule { }
