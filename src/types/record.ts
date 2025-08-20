export interface Record {
  amount: number;
  createdAt: string;
  note: string;
  title: string;
  type: "expense" | "income";
  updatedAt: string;
}

export interface RecordQuery {
  selectType?: string[];
  startDate?: string;
  endDate?: string;
  selectItems?: string[];
}
