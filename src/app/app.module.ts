import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material";
import { LoginComponent } from "./auth/login/login.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { AuthService } from "./auth/auth.service";
import { AuthGuardsService } from "./auth/auth-guards.service";
import { AuthInterceptor } from "./auth/auth-interceptor.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ContactListComponent } from "./contact/contact-list/contact-list.component";
import { ContactService } from "./contact/contact.service";
import { SettingsComponent } from "./settings/settings/settings.component";
import { SettingsService } from "./settings/settings.service";
import { AdminEditComponent } from "./settings/modal/admin-edit/admin-edit.component";
import { TrainingListComponent } from "./trainings/training-list/training-list.component";
import { TrainingDetailsComponent } from "./trainings/training-details/training-details.component";
import { PlacesListComponent } from "./places/places-list/places-list.component";
import { PlaceDetailsComponent } from "./places/place-details/place-details.component";
import { GroupListComponent } from "./groups/group-list/group-list.component";
import { EditGroupComponent } from "./groups/modal/edit-group/edit-group.component";
import { TrainingDatesListComponent } from "./trainingDates/training-dates-list/training-dates-list.component";
import { TrainingDatesDetailsComponent } from "./trainingDates/training-dates-details/training-dates-details.component";
import { registerLocaleData, DatePipe } from "@angular/common";
import localePl from "@angular/common/locales/pl";
import localePlExtra from "@angular/common/locales/extra/pl";
import { MethodsListComponent } from "./methods/methods-list/methods-list.component";
import { MethodsDetailsComponent } from "./methods/methods-details/methods-details.component";
import { OrderListComponent } from "./orders/order-list/order-list.component";
import { OrderDetailsComponent } from "./orders/order-details/order-details.component";
import { StatusComponent } from "./settings/modal/status/status.component";
import { LangComponent } from "./settings/modal/lang/lang.component";
import { CurrencyComponent } from "./settings/modal/currency/currency.component";
import { EditCostsComponent } from "./orders/modal/edit-costs/edit-costs.component";
import { RemoveOrderComponent } from "./orders/modal/remove-order/remove-order.component";
import { ChangeDataDVComponent } from "./orders/modal/change-data-dv/change-data-dv.component";
import { PayLinkGenerateComponent } from "./orders/modal/pay-link-generate/pay-link-generate.component";
import { AddPersonToTrainingComponent } from "./trainingDates/modal/add-person-to-training/add-person-to-training.component";
import { ChangeTrainingDateComponent } from "./trainingDates/modal/change-training-date/change-training-date.component";
import { AddTrainingTicketComponent } from "./trainingDates/modal/add-training-ticket/add-training-ticket.component";
import { TicketAttrComponent } from "./settings/modal/ticket-attr/ticket-attr.component";
import { NoNameTicketAddPersonComponent } from "./orders/modal/no-name-ticket-add-person/no-name-ticket-add-person.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DiscountCodeListComponent } from "./promoCode/discount-code-list/discount-code-list.component";
import { EditDiscountCodeComponent } from "./promoCode/modal/edit-discount-code/edit-discount-code.component";
import { RemoveGroupComponent } from "./groups/modal/remove-group/remove-group.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { EventTypeComponent } from "./settings/modal/event-type/event-type.component";
import {
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from "@angular-material-components/color-picker";
import { RuleUserComponent } from "./settings/modal/rule-user/rule-user.component";
import { ChangeRoleComponent } from "./trainingDates/modal/change-role/change-role.component";
import { OrderStatusComponent } from "./settings/modal/order-status/order-status.component";
import { RegulationComponent } from "./settings/modal/regulation/regulation.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { SetColumnsComponent } from "./trainingDates/modal/set-columns/set-columns.component";
import { SetColumnsOrdersComponent } from "./orders/modal/set-columns-orders/set-columns-orders.component";
import { AddInvoiceComponent } from "./orders/modal/add-invoice/add-invoice.component";
import { RemoveInvoiceComponent } from "./orders/modal/remove-invoice/remove-invoice.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { SetDateInvoiceComponent } from "./orders/modal/set-date-invoice/set-date-invoice.component";
import { MatCardModule } from "@angular/material/card";
import { TrainingDatesEditComponent } from "./trainingDates/training-dates-edit/training-dates-edit.component";
import { DiscountCodeComponent } from "./trainingDates/modal/discount-code/discount-code.component";
import { AddCommentComponent } from "./trainingDates/modal/add-comment/add-comment.component";
import { ViewEmailMsgComponent } from "./orders/modal/view-email-msg/view-email-msg.component";
import { OrderAddComponent } from "./orders/order-add/order-add.component";
import { VindicationEmailComponent } from "./orders/modal/vindication-email/vindication-email.component";
import { InvoicePositionComponent } from "./orders/modal/invoice-position/invoice-position.component";
import { AddCostInvoiceByIdComponent } from "./trainingDates/modal/add-cost-invoice-by-id/add-cost-invoice-by-id.component";
import { AddCostManualComponent } from "./trainingDates/modal/add-cost-manual/add-cost-manual.component";
import { AddNewContactComponent } from "./contact/modal/add-new-contact/add-new-contact.component";
import { CompanySettingsComponent } from "./settings/company-settings/company-settings.component";
import { ChangeEventComponent } from "./orders/modal/change-event/change-event.component";
import { BottomSheetComponent } from "./trainingDates/modal/bottom-sheet/bottom-sheet.component";
import { HistoryListComponent } from "./globalComponents/history-list/history-list.component";
import { AddEditOrderPersonComponent } from "./orders/modal/add-edit-order-person/add-edit-order-person.component";
import { AddEditDefaultTicketsComponent } from "./trainings/modal/add-edit-default-tickets/add-edit-default-tickets.component";
import { BlankModalComponent } from "./trainingDates/modal/blank-modal/blank-modal.component";
import { GetDefaultTicketsComponent } from "./trainingDates/modal/get-default-tickets/get-default-tickets.component";
import { DealPersonsComponent } from "./orders/modal/deal-persons/deal-persons.component";
import { TrainersListComponent } from "./trainers/trainers-list/trainers-list.component";
import { TrainerDetailsComponent } from "./trainers/trainer-details/trainer-details.component";
import { TrainerEditComponent } from './trainers/trainer-edit/trainer-edit.component';

registerLocaleData(localePl, localePlExtra);

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ContactListComponent,
        SettingsComponent,
        AdminEditComponent,
        TrainingListComponent,
        TrainingDetailsComponent,
        PlacesListComponent,
        PlaceDetailsComponent,
        GroupListComponent,
        EditGroupComponent,
        TrainingDatesListComponent,
        TrainingDatesDetailsComponent,
        MethodsListComponent,
        MethodsDetailsComponent,
        OrderListComponent,
        OrderDetailsComponent,
        StatusComponent,
        LangComponent,
        CurrencyComponent,
        EditCostsComponent,
        RemoveOrderComponent,
        ChangeDataDVComponent,
        PayLinkGenerateComponent,
        AddPersonToTrainingComponent,
        ChangeTrainingDateComponent,
        AddTrainingTicketComponent,
        TicketAttrComponent,
        NoNameTicketAddPersonComponent,
        DiscountCodeListComponent,
        EditDiscountCodeComponent,
        RemoveGroupComponent,
        EventTypeComponent,
        RuleUserComponent,
        ChangeRoleComponent,
        OrderStatusComponent,
        RegulationComponent,
        SetColumnsComponent,
        SetColumnsOrdersComponent,
        AddInvoiceComponent,
        RemoveInvoiceComponent,
        SetDateInvoiceComponent,
        TrainingDatesEditComponent,
        DiscountCodeComponent,
        AddCommentComponent,
        ViewEmailMsgComponent,
        OrderAddComponent,
        VindicationEmailComponent,
        InvoicePositionComponent,
        AddCostInvoiceByIdComponent,
        AddCostManualComponent,
        AddNewContactComponent,
        CompanySettingsComponent,
        ChangeEventComponent,
        BottomSheetComponent,
        HistoryListComponent,
        AddEditOrderPersonComponent,
        AddEditDefaultTicketsComponent,
        BlankModalComponent,
        GetDefaultTicketsComponent,
        DealPersonsComponent,
        TrainersListComponent,
        TrainerDetailsComponent,
        TrainerEditComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule,
        NgxMatColorPickerModule,
        NgxMaterialTimepickerModule,
        CKEditorModule,
        DragDropModule,
        MatCardModule,
        ToastrModule.forRoot({
            closeButton: true,
            positionClass: "toast-top-center",
            progressBar: true,
            progressAnimation: "decreasing",
        }),
        FontAwesomeModule,
    ],
    providers: [
        AuthService,
        AuthGuardsService,
        ContactService,
        SettingsService,
        DatePipe,
        {
            provide: MAT_COLOR_FORMATS,
            useValue: NGX_MAT_COLOR_FORMATS,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        { provide: LOCALE_ID, useValue: "pl-PL" },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
