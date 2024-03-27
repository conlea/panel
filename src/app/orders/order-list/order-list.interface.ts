export interface OrderListInterface {
  company: string;
  created_at: string;
  eventType: string;
  firstName: string;
  id: number;
  invoiceAlertIsPay: boolean;
  invoiceAlertNoPay: boolean;
  lang: string;
  lastName: string;
  orderId: string;
  orderPayUStatus: string;
  status_color: {
    a: number;
    b: number;
    g: number;
    hex: string;
    r: number;
    rgba: string;
    roundA: number;
  };
  status_order: string;
  training: string;
  trainingDateEnd: string;
  trainingDateId: string;
  trainingDateStart: string;
  wherePay: number;
}

export interface OrderDetailsInterface {
  active: number;
  activeRegister: number;
  company_id: number;
  created_at: string;
  createdby: number;
  currency: string;
  dateend: string;
  datestart: string;
  editedby: string;
  eventOwner_id: string;
  eventType: {
    active: number;
    created_at: string;
    createdby: number;
    editedby: number;
    id: number;
    name_en: string;
    name_pl: string;
    updated_at: string;
  };
  event_type: number;
  id: number;
  idTermTraining: string;
  lang: string;
  maxperson: number;
  metoda_id: number;
  personContact_confirmed: number;
  personContact_id: number;
  personlist: [];
  place: {
    id: number;
    name_pl: string;
    remote: number;
  };
  place_id: number;
  product_id: number;
  regulation_id: number;
  salesOwner_id: number;
  short_register: number;
}
