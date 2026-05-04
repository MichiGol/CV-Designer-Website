import {
  Briefcase,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

export const DEFAULT_DISPLAY_FONT = "'Cormorant Garamond', Georgia, serif";
export const DEFAULT_BODY_FONT = "'DM Sans', system-ui, sans-serif";

export const FALLBACK_ACCENT = "#2563eb";
export const FALLBACK_NAME = "Vorname Nachname";
export const FALLBACK_INITIALS = "CV";
export const EYEBROW_LABEL = "Modern Flow CV";

export const CONTACT_FIELDS = [
  { id: "email", icon: Mail, key: "email" },
  { id: "phone", icon: Phone, key: "phone" },
  { id: "location", icon: MapPin, key: "location" },
  { id: "website", icon: Globe, key: "website" },
];

export const SECTION_LABELS = {
  education: "Ausbildung",
  experience: "Berufserfahrung",
  hobbies: "Interessen",
  languages: "Sprachen",
  profile: "Profil",
  skills: "Skills",
};

export const SECTION_ICONS = {
  education: GraduationCap,
  experience: Briefcase,
  hobbies: Heart,
  languages: Languages,
  profile: User,
  skills: Sparkles,
};

export const RADAR_CONFIG = {
  center: 80,
  labelOffset: 16,
  maxItems: 6,
  radius: 60,
  ringSteps: [25, 50, 75, 100],
};
