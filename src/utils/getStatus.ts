import { STATUS } from "@models/const/status.const";

export const getStatus = (status: string) => {
  switch (status) {
    case "Close":
      return STATUS.Close;
    case "Reabierto":
      return STATUS.REOPENED;
    case "con diferencia":
      return STATUS.WITH_DIFFERENCE;
    case "Open":
      return STATUS.Open;
    case "Re-cerrado":
      return STATUS.RECLOSED;
    case "Cerrado Starbucks":
      return STATUS.CLOSED_STARBUCKS
    default:
      return STATUS.Open;
  }
};
