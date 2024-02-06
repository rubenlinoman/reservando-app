export interface TableHeader {
  columnDef: string;
  header: string;
  iconoTh?: boolean;
  iconoTd?: boolean;
  hidden?: boolean;
  color?: (element: any) => string;
  cell: (element: any) => string;
}
