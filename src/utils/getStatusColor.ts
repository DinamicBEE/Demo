import { STATUS } from "@models/status.model";

export const getStatusColor = (status: STATUS) => {
  switch (status) {
    case STATUS.CLOSED:
      return "green";
    case STATUS.REOPENED:
      return "yellow";
    case STATUS.WITH_DIFFERENCE:
      return "red";
    case STATUS.OPEN:
      return "gray";
    default:
      return "gray";
  }
};
