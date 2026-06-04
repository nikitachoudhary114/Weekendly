export interface IActivity {
  id: string;
  name: string;
  category:
    | "indoor"
    | "outdoor"
    | "food"
    | "social"
    | "relaxation"
    | "fitness"
    | "culture";
  duration: number; // in hours
  mood: "energetic" | "relaxing" | "social" | "creative" | "adventurous";
  icon: string;
  description: string;
}

export interface ScheduleItem {
  id: string;
  activity: IActivity;
  startTime: string;
  day: "saturday" | "sunday";
  /** Hours blocked on the schedule (editable; may differ from library default). */
  duration: number;
}

export function getScheduleDuration(item: ScheduleItem): number {
  return item.duration ?? item.activity.duration;
}

export interface WeekendPlan {
  id: string;
  name: string;
  saturday: ScheduleItem[];
  sunday: ScheduleItem[];
  createdAt: Date;
}

