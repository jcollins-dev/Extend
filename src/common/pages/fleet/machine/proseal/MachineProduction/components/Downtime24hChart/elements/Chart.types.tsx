export interface DowntimeData {
  data: Data[];
}

export interface Data {
  status: string;
  total_time_seconds: number;
  count: number;
  production_percentage: number;
  category: string;
  color: string;
}

export interface BarBlockProps {
  category: string;
  count?: number;
  duration: string;
  status: string;
}

export interface CategoryLineProps {
  category: string;
}
