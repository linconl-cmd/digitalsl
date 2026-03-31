import {
  User, UserCheck, Building, Building2, FileText, FileCheck,
  Shield, ShieldCheck, Key, Lock, Fingerprint, Award,
  type LucideIcon
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  user: User,
  "user-check": UserCheck,
  building: Building,
  "building-2": Building2,
  "file-text": FileText,
  "file-check": FileCheck,
  shield: Shield,
  "shield-check": ShieldCheck,
  key: Key,
  lock: Lock,
  fingerprint: Fingerprint,
  award: Award,
};

export const iconOptions = Object.keys(iconMap);
