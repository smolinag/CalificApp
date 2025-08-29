import { Icon } from "react-native-paper";
import { Colors } from "../styles/Theme";
import { ReactElement } from "react";
import { height } from "../styles/GeneralStyle";

export const rgbToRgba = (color: string, alpha: number): string => {
  // Expand shorthand like #03F to full form #0033FF
  const fullHex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) return null;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getColorFromRating = (rating: number): string => {
  switch (rating) {
    case 1:
      return Colors.rating1;
    case 2:
      return Colors.rating2;
    case 3:
      return Colors.rating3;
    case 4:
      return Colors.rating4;
    case 5:
      return Colors.rating5;
    default:
      return Colors.background; // Default color if no rating matches
  }
};

export const getIconFromRating = (rating: number, sizePctg?: number): ReactElement => {
  switch (rating) {
    case 1:
      return <Icon source="emoticon-angry" size={height * (sizePctg ? sizePctg : 0.125)} color={Colors.rating1} />;
    case 2:
      return <Icon source="emoticon-sad" size={height * (sizePctg ? sizePctg : 0.125)} color={Colors.rating2} />;
    case 3:
      return <Icon source="emoticon-neutral" size={height * (sizePctg ? sizePctg : 0.125)} color={Colors.rating3} />;
    case 4:
      return <Icon source="emoticon-happy" size={height * (sizePctg ? sizePctg : 0.125)} color={Colors.rating4} />;
    case 5:
      return <Icon source="emoticon-excited" size={height * (sizePctg ? sizePctg : 0.125)} color={Colors.rating5} />;
  }
};

export const formatLocalDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  // Pad single digits with leading zero
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const MM = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
};

export const getMonthsForDropdown = (): { label: string; value: number }[] => {
  return [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
  ];
}

export const getYearsForDropdown = (): { label: string; value: number }[] => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2025; year <= currentYear; year++) {
    years.push({ label: year.toString(), value: year });
  }
  return years;
}
