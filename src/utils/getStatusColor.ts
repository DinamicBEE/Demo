import { STATUS } from "@models/const/status.const";

export const getStatusColor = (status: STATUS) => {
  switch (status) {
    case STATUS.Close:
      return "meraInfo";
    case STATUS.CLOSED_STARBUCKS:
      return "meraInfo";
    case STATUS.RECLOSED:
      return "meraInfo";
    case STATUS.REOPENED:
      return "meraWarning";
    case STATUS.WITH_DIFFERENCE:
      return "meraError";
    case STATUS.WITH_DIFFERENCE_:
      return "meraError";
    case STATUS.Open:
      return "meraSecondary";
    case STATUS.ACTIVE:
      return "meraSecondary";
    case STATUS.INACTIVE:
      return "meraInfo";
    default:
      return "meraSecondary";
  }
};
