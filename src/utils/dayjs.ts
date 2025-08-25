import dayjs from "dayjs";
import "dayjs/locale/zh-tw";

dayjs.locale("zh-cn");
dayjs().format();

export const formatDate = (date: string | Date) => {
  return dayjs(date).format("YYYY/MM/DD");
};

export const getStartOfMonth = () => {
  return dayjs().startOf("month").format("YYYY-MM-DD");
};

export const getEndOfMonth = () => {
  return dayjs().endOf("month").format("YYYY-MM-DD");
};
