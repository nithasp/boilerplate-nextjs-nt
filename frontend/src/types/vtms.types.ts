export interface SailingLogData {
  id: number;
  createAt: string;
  status: string;
  statusDes: string;
  docNumber: string;
  vesselName: string;
  imoNumber: string;
  officialNumber: string;
  grt: number;
  eta: string;
  berthNames: string;
  vesselStatus: string;
  vesselStatusDes: string;
  vesselStatusDesEn: string;
  portAt: string;
  portDues: number;
  vesselFlagName: string;
  vesselTypeName: string;
  callSign: string;
  agencyName: string;
  isNewShip: boolean;
}

export interface DocumentListResponse {
  data: {
    data: SailingLogData[];
    totalItems: number;
    totalPages: number;
  };
}

export interface AnchorShipData {
  id: number;
  status: string;
  berth_id: number;
  berth_name: string;
  vessel_flag: string;
  vessel_id: number;
  vessel_name: string;
  vessel_imo_number: string;
  vessel_official_number: string;
  vessel_type_id: number;
  vessel_type_name: string;
  pilot_date: string;
  anchor_date: string;
  aweigh_date: string;
  latitude: string;
  longitude: string;
  remark: string;
  duration: string;
}

export interface AnchorListResponse {
  data: {
    data: AnchorShipData[];
    totalItems: number;
    totalPages: number;
  };
}

export interface LogBookData {
  id: number;
  status: string;
  create_date: string;
  updated_date: string;
  berth_id: number;
  berth_name: string;
  jetty_id: number;
  jetty_name: string;
  document_berth_id: number;
  document_number: string;
  vessel_flag: string;
  vessel_name: string;
  vessel_imo_number: string;
  vessel_official_number: string;
  vessel_type_id: number;
  vessel_type_name: string;
  voyage: string;
  gross_tonnage: number;
  depth: number;
  purpose_type_id: number;
  purpose_type_name: string;
  purpose_id: number;
  purpose_name: string;
  agency_name: string;
  mooring_date_vs: string;
  departure_date_vs: string;
  mooring_date: string;
  departure_date: string;
  document_id: number;
  product_name: string;
  next_port: string;
  last_port: string;
  remark: string;
}

export interface LogBookListResponse {
  data: {
    data: LogBookData[];
    totalItems: number;
    totalPages: number;
  };
}

export interface VesselDetail {
  vesselFlagId: number;
  vesselTypeId: number;
  id: number;
  documentVesselId: number;
  vesselId: number;
  vesselOwner: string;
  vesselOwnerId: number;
  vesselName: string;
  vesselImoNumber: string;
  vesselMMSiNumber: string;
  vesselDSVNumber: string;
  vesselOfficialNumber: string;
  vesselCallSign: string;
  vesselNationality: string;
  vesselCountry: string;
  vesselLoadWeight: number;
  vesselGrossTonnage: number;
  vesselNetTonnage: number;
  vesselLengthOverall: number;
  vesselBreadthExtreme: number;
  vesselDepth: number;
  vesselMainEngine: string;
  vesselBandAndModel: string;
  vesselLicenseExpiredDate: string | null;
  vesselFlagName: string;
  vesselFlag: string;
  vesselFlagPath: string;
  vesselTypeName: string;
  vesselUploadFiles: any[];
}

export interface ProductDetail {
  id: number;
  purposeId: number;
  purposeName: string;
  productTypeId: number;
  productTypeName: string;
  productGroupId: number;
  productGroupName: string;
  cargoWharfageId: number;
  cargoWharfageName: string;
  cargoTypeId: number | null;
  cargoTypeName: string;
  mTonQty: number;
  rTonQty: number;
  packageAmount: number;
  receiver: string;
  cargoOwnerId: number | null;
}

export interface FileDetail {
  id: number;
  filePath: string;
  fileName: string;
  extension: string;
  size: number;
  preview: string;
  document_file_type: string;
}

export interface BerthDetail {
  id: number;
  berthId: number;
  berthNameAlt: string;
  berthNameTh: string;
  berthNameEn: string;
  berthType: string;
  purposeTypeId: number;
  purposeTypeName: string;
  purposeId: number;
  purposeName: string;
  cargoTypeId: number;
  cargoTypeName: string;
  passengers: number;
  sequence: number;
  estimatedArrival: string;
  estimatedDeparture: string;
  note: string;
  products: ProductDetail[];
  files: FileDetail[];
  mTonQty: number;
  rTonQty: number;
  cargoWharfageId: number | null;
  selectedJettyId: number | null;
  selectedJettyName: string;
  adminSelectedJettyId: number | null;
  adminSelectedJettyName: string;
}

export interface InvoiceDetail {
  id: number;
  customerId: number;
  customerCode: string;
  customerReference: string;
  documentId: number;
  name: string;
  taxId: string;
  contactName: string;
  paymentMethodId: number;
  paymentMethodName: string;
  paymentTermId: number;
  paymentTermName: string;
  countryId: number;
  countryName: string;
  subDistrictId: number;
  subDistrictName: string;
  districtId: number;
  districtName: string;
  provinceId: number;
  provinceName: string;
  postCode: string;
  stageProvince: string;
  address: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  emailAddress: string;
  rate: number;
  fee: number;
  vat: number;
  vatTotal: number;
  total: number;
  paymentPeriod: number;
  dueDate: string | null;
  paidDate: string | null;
}

export interface AgencyDetail {
  name: string;
  company: string;
  phone: string;
  fax: string;
  email: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  postcode: string;
}

export interface DocumentDetail {
  id: number;
  requestDate: string;
  status: string;
  anchorStatus: string;
  statusDescription: string;
  rejectedNote: string | null;
  vessel: VesselDetail;
  berths: BerthDetail[];
  invoice: InvoiceDetail;
  estimatedArrival: string;
  estimatedDeparture: string;
  docNumber: string;
  agencyName: string;
  agency: AgencyDetail;
  vesselStatus: string;
  vesselStatusDes: string;
  berthAt: string | null;
  berthDues: number;
  canApprove: boolean;
  isDeparted: boolean;
  isNewShip: boolean;
}

export interface DocumentDetailResponse {
  data: DocumentDetail;
}

export interface VesselFlag {
  id: number;
  name: string;
  image_path: string;
}

export interface VesselInfo {
  id: number;
  owner: string;
  vessel_flag: VesselFlag;
  name: string;
  vessel_type: string;
  imo_number: string;
  mmsi_number: string;
  official_number: string;
  call_sign: string;
  license_expired_date: string | null;
  load_weight: number;
  gross_tonnage: number;
  net_tonnage: number;
  length_overall: number;
  breadth_extreme: number;
  depth: number;
  displacement: number;
  main_engine: string;
  band_and_model: string;
  authority_name: string;
}

export interface AnchorInfo {
  id: number;
  berth_id: number;
  berth_name: string;
  pilot_date: string;
  anchor_date: string;
  aweigh_date: string;
  latitude: string;
  longitude: string;
  remark: string;
}

export interface AnchorDetail {
  id: number;
  status: string;
  voyage: string;
  gross_tonnage: number;
  depth: number;
  pilot_date: string;
  anchor_date: string;
  aweigh_date: string;
  latitude: string;
  longitude: string;
  remark: string;
  vessel: VesselInfo;
  anchors: AnchorInfo;
  port_id_next: number;
  port_next_name: string;
  port_id_last: number;
  port_last_name: string;
}

export interface AnchorDetailResponse {
  data: AnchorDetail;
}

export interface LogBookDetailItem {
  berth_id: number;
  berth_name: string;
  purpose_id: number;
  purpose_name: string;
  cargo_type_id: number;
  cargo_type_name: string;
  cargo_wharfage_id: number;
  cargo_wharfage_name: string;
  jetty_id: number;
  jetty_name: string;
  mooring_date: string;
  departure_date: string;
  document_berth_id: number | null;
}

export interface LogBookProduct {
  id: number;
  purposeId: number;
  purposeName: string;
  productTypeId: number;
  productTypeName: string;
  productGroupId: number;
  productGroupName: string;
  cargoWharfageId: number;
  cargoWharfageName: string;
  cargoTypeId: number | null;
  cargoTypeName: string;
  mTonQty: number;
  rTonQty: number;
  packageAmount: number;
  receiver: string;
  cargoOwnerId: number | null;
}

export interface LogBookDetail {
  id: number;
  status: string;
  voyage: string;
  gross_tonnage: number;
  depth: number;
  port_id_next: number;
  port_name_next: string;
  port_id_last: number;
  port_name_last: string;
  document_berth_id: number;
  document_number: string;
  vessel: VesselInfo;
  details: LogBookDetailItem[];
  create_date: string;
  tugs: any[];
  pilots: any[];
  products: LogBookProduct[];
  agency_name: string;
  filePath: string;
  fileName: string;
  extension: string;
  size: number;
}

export interface LogBookDetailResponse {
  data: LogBookDetail;
}
