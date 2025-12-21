export interface SkillItem {
  name: string;
  icon?: string;
}

export interface SkillGroup {
  title: string;
  skills: SkillItem[];
}
