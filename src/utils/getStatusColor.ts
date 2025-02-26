import { STATUS } from "@models/status.model";

export const getStatusColor = (status: STATUS) => {
  switch (status) {
    case STATUS.CLOSED:
      return "meraInfo";
    case STATUS.REOPENED:
      return "meraWarning";
    case STATUS.WITH_DIFFERENCE:
      return "meraError";
    case STATUS.OPEN:
      return "meraSecondary";
    default:
      return "meraSecondary";
  }
};
