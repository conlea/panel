import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { ContactListComponent } from "./contact/contact-list/contact-list.component";
import { SettingsComponent } from "./settings/settings/settings.component";
import { AuthGuardsService } from "./auth/auth-guards.service";
import { TrainingListComponent } from "./trainings/training-list/training-list.component";
import { TrainingDetailsComponent } from "./trainings/training-details/training-details.component";
import { PlacesListComponent } from "./places/places-list/places-list.component";
import { PlaceDetailsComponent } from "./places/place-details/place-details.component";
import { GroupListComponent } from "./groups/group-list/group-list.component";
import { TrainingDatesListComponent } from "./trainingDates/training-dates-list/training-dates-list.component";
import { TrainingDatesDetailsComponent } from "./trainingDates/training-dates-details/training-dates-details.component";
import { MethodsListComponent } from "./methods/methods-list/methods-list.component";
import { MethodsDetailsComponent } from "./methods/methods-details/methods-details.component";
import { OrderListComponent } from "./orders/order-list/order-list.component";
import { OrderDetailsComponent } from "./orders/order-details/order-details.component";
import { DiscountCodeListComponent } from "./promoCode/discount-code-list/discount-code-list.component";
import { TrainingDatesEditComponent } from "./trainingDates/training-dates-edit/training-dates-edit.component";
import { OrderAddComponent } from "./orders/order-add/order-add.component";
import { CompanySettingsComponent } from "./settings/company-settings/company-settings.component";
import { TrainersListComponent } from "./trainers/trainers-list/trainers-list.component";
import { TrainerDetailsComponent } from "./trainers/trainer-details/trainer-details.component";
import { TrainerEditComponent } from "./trainers/trainer-edit/trainer-edit.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "contacts",
    component: ContactListComponent,
    canActivate: [AuthGuardsService],
  },
  {
    path: "trainings",
    // component: TrainingListComponent,
    // canActivate: [AuthGuardsService]
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: TrainingListComponent,
      },
      {
        path: "details",
        component: TrainingDetailsComponent,
      },
      {
        path: ":id/details",
        component: TrainingDetailsComponent,
      },
    ],
  },
  {
    path: "training-dates",
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: TrainingDatesListComponent,
      },
      {
        path: "edit",
        component: TrainingDatesEditComponent,
      },
      {
        path: ":id/details",
        component: TrainingDatesDetailsComponent,
      },
      {
        path: ":id/edit",
        component: TrainingDatesEditComponent,
      },
      {
        path: ":id/add",
        component: TrainingDatesEditComponent,
      },
    ],
  },
  {
    path: "orders",
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: OrderListComponent,
      },
      {
        path: ":id/details",
        component: OrderDetailsComponent,
      },
      {
        path: "details",
        component: OrderAddComponent,
      },
    ],
  },
  {
    path: "trainers",
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: TrainersListComponent,
      },
      {
        path: "create",
        component: TrainerEditComponent,
      },
      {
        path: ":id/edit",
        component: TrainerEditComponent,
      },
      {
        path: ":id/details",
        component: TrainerDetailsComponent,
      },
    ],
  },
  {
    path: "discount-code",
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: DiscountCodeListComponent,
      },
    ],
  },
  {
    path: "methods",
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: MethodsListComponent,
      },
      {
        path: "details",
        component: MethodsDetailsComponent,
      },
      {
        path: ":id/details",
        component: MethodsDetailsComponent,
      },
    ],
  },
  {
    path: "places",
    // component: PlacesListComponent,
    // canActivate: [AuthGuardsService],
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: PlacesListComponent,
      },
      {
        path: "details",
        component: PlaceDetailsComponent,
      },
      {
        path: ":id/details",
        component: PlaceDetailsComponent,
      },
    ],
  },
  {
    path: "groups",
    component: GroupListComponent,
    canActivate: [AuthGuardsService],
  },
  {
    path: "settings",
    // component: SettingsComponent,
    canActivate: [AuthGuardsService],
    canActivateChild: [AuthGuardsService],
    children: [
      {
        path: "",
        component: SettingsComponent,
      },
      {
        path: "company-details",
        component: CompanySettingsComponent,
      },
      {
        path: ":id/company-details",
        component: CompanySettingsComponent,
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/login",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
