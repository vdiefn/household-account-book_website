export interface Record {
  _id?: string;
  amount: number;
  createdAt: string;
  note: string;
  name: string;
  type: "expense" | "income";
  category: string;
  updatedAt: string;
}

export interface RecordQuery {
  selectType?: string[];
  startDate?: string;
  endDate?: string;
  selectItems?: string[];
  selectCategories?: string[];
}
