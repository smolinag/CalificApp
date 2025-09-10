export interface CompanyDto {
  id: string;
  companyName?: string;
  createdAt?: string;
  logoUrl?: string;
  theme?: string;
  updatedAt?: string;
  updatedFromDeviceId?: string;
  fileContent?: string; // Base64 encoded image content
  contentType?: string; 
};