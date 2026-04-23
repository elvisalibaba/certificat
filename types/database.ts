import type {
  CertificateStatus,
  PaymentStatus,
  RequestStatus,
  Role,
} from "@/lib/constants";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  artisan_id: string;
  workshop_id: string | null;
  name: string;
  category: string;
  subcategory: string | null;
  description: string;
  raw_materials: string | null;
  manufacturing_process: string | null;
  origin: string | null;
  usage: string | null;
  dimensions: string | null;
  weight: string | null;
  submission_state: "draft" | "submitted";
  created_at: string;
  updated_at: string;
};

export type CertificationRequest = {
  id: string;
  product_id: string;
  artisan_id: string;
  status: RequestStatus;
  submitted_at: string | null;
  approved_for_payment_at: string | null;
  final_decision_at: string | null;
  final_decision_by: string | null;
  final_decision_comment: string | null;
  created_at: string;
  updated_at: string;
};

export type Certificate = {
  id: string;
  request_id: string;
  product_id: string;
  artisan_id: string;
  certificate_number: string;
  public_code: string;
  status: CertificateStatus;
  issued_at: string;
  expires_at: string | null;
  pdf_path: string | null;
};

export type PaymentTransaction = {
  id: string;
  request_id: string;
  artisan_id: string;
  provider: string;
  provider_reference: string | null;
  status: PaymentStatus;
  amount: number;
  currency: string;
  method: string | null;
  raw_response: Json | null;
  paid_at: string | null;
  created_at: string;
};
