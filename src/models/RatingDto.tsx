export interface RatingDto {
  id: string;
  rating: number;
  comment: string;
  employeeName: string;
  deviceId: string;
  date: string;
  raterName: string;
  ratingTimeMs?: number;
};