import api from "@/lib/api";

export interface PostInquiryBody {
  name: string;
  phone: string;
  email?: string;
  propertyId?: string;
  message: string;
}

export function postInquiry(body: PostInquiryBody) {
  return api.post<{ success: boolean; message?: string }>("/inquiries", body);
}
