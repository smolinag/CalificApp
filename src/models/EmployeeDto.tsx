export interface EmployeeDto {
  id: string;
  rangeId: string;
  employeeName: string;
  photoUrl: string;
  createdAt: string;
  fileContent?: string; // Base64 encoded image content
  contentType?: string; 
  version?: number;
  createdFromDeviceId?: string;
  updatedFromDeviceId?: string;
};