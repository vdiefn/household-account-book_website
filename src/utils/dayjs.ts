import dayjs from "dayjs";
import "dayjs/locale/zh-tw";

dayjs.locale("zh-cn");
dayjs().format();

export const formatDate = (date: string | Date) => {
  return dayjs(date).format("YYYY/MM/DD");
};

export const formatTime = (date: string | Date) => {
  return dayjs(date).format("YYYY/MM/DD HH:mm");
};

export const toUnix = (date: string | Date) => {
  return dayjs(date).unix();
};

export const getStartOfMonth = () => {
  return dayjs().startOf("month");
};

export const getEndOfMonth = () => {
  return dayjs().endOf("month");
};

export const getDaysInMonth = () => {
  return dayjs().daysInMonth();
};
