import {
    LayoutTemplate,
    Sparkles,
    Building2,
    Crown,
    ScanLine,
    Palette,
    Briefcase,
    Cpu,
    Zap
} from "lucide-react";

// Import all templates
import { ClassicTemplate } from "./ClassicTemplate";
import { ClassicStatement } from "./ClassicStatement";
import { ClassicDisbursal } from "./ClassicDisbursal";

import { ModernTemplate } from "./ModernTemplate";
import { ModernStatement } from "./ModernStatement";
import { ModernDisbursal } from "./ModernDisbursal";

import { CorporateTemplate } from "./CorporateTemplate";
import { CorporateStatement } from "./CorporateStatement";
import { CorporateDisbursal } from "./CorporateDisbursal";

import { ElegantTemplate } from "./ElegantTemplate";
import { ElegantStatement } from "./ElegantStatement";
import { ElegantDisbursal } from "./ElegantDisbursal";

import { MinimalTemplate } from "./MinimalTemplate";
import { MinimalStatement } from "./MinimalStatement";
import { MinimalDisbursal } from "./MinimalDisbursal";

import { BoldTemplate } from "./BoldTemplate";
import { BoldStatement } from "./BoldStatement";
import { BoldDisbursal } from "./BoldDisbursal";

import { CreativeTemplate } from "./CreativeTemplate";
import { CreativeStatement } from "./CreativeStatement";
import { CreativeDisbursal } from "./CreativeDisbursal";

import { ProfessionalTemplate } from "./ProfessionalTemplate";
import { ProfessionalStatement } from "./ProfessionalStatement";
import { ProfessionalDisbursal } from "./ProfessionalDisbursal";

import { TechTemplate } from "./TechTemplate";
import { TechStatement } from "./TechStatement";
import { TechDisbursal } from "./TechDisbursal";

export type TemplateId =
    | "classic"
    | "modern"
    | "corporate"
    | "elegant"
    | "minimal"
    | "bold"
    | "creative"
    | "professional"
    | "tech";

export interface TemplateConfig {
    id: TemplateId;
    name: string;
    description: string;
    icon: any;
    receiptComponent: React.ComponentType<any>;
    statementComponent: React.ComponentType<any>;
    disbursalComponent: React.ComponentType<any>;
    isPro?: boolean;
}

export const TEMPLATE_REGISTRY: TemplateConfig[] = [
    {
        id: "classic",
        name: "Classic Bank",
        description: "Traditional grid layout. Best for official banking records.",
        icon: LayoutTemplate,
        receiptComponent: ClassicTemplate,
        statementComponent: ClassicStatement,
        disbursalComponent: ClassicDisbursal
    },
    {
        id: "modern",
        name: "Modern Clean",
        description: "Contemporary design with soft colors and clear typography.",
        icon: Sparkles,
        receiptComponent: ModernTemplate,
        statementComponent: ModernStatement,
        disbursalComponent: ModernDisbursal
    },
    {
        id: "corporate",
        name: "Corporate Pro",
        description: "Professional sidebar layout. Excellent for business branding.",
        icon: Building2,
        receiptComponent: CorporateTemplate,
        statementComponent: CorporateStatement,
        disbursalComponent: CorporateDisbursal
    },
    {
        id: "professional",
        name: "Blue Standard",
        description: "Safe, standard blue & grey corporate look.",
        icon: Briefcase,
        receiptComponent: ProfessionalTemplate,
        statementComponent: ProfessionalStatement,
        disbursalComponent: ProfessionalDisbursal
    },
    {
        id: "elegant",
        name: "Elegant Gold",
        description: "Luxury serif typography with gold accents.",
        icon: Crown,
        receiptComponent: ElegantTemplate,
        statementComponent: ElegantStatement,
        disbursalComponent: ElegantDisbursal,
        isPro: true
    },
    {
        id: "minimal",
        name: "Swiss Minimal",
        description: "High-end black & white typography. No clutter.",
        icon: ScanLine,
        receiptComponent: MinimalTemplate,
        statementComponent: MinimalStatement,
        disbursalComponent: MinimalDisbursal,
        isPro: true
    },
    {
        id: "bold",
        name: "High Contrast",
        description: "Bold headers and strong contrast for impact.",
        icon: Zap,
        receiptComponent: BoldTemplate,
        statementComponent: BoldStatement,
        disbursalComponent: BoldDisbursal
    },
    {
        id: "creative",
        name: "Creative Studio",
        description: "Vibrant gradients and geometric shapes.",
        icon: Palette,
        receiptComponent: CreativeTemplate,
        statementComponent: CreativeStatement,
        disbursalComponent: CreativeDisbursal,
        isPro: true
    },
    {
        id: "tech",
        name: "Cyber System",
        description: "Monospace digital aesthetic for tech-first firms.",
        icon: Cpu,
        receiptComponent: TechTemplate,
        statementComponent: TechStatement,
        disbursalComponent: TechDisbursal
    }
];

export const getTemplate = (id: string) => {
    return TEMPLATE_REGISTRY.find(t => t.id === id) || TEMPLATE_REGISTRY[0];
};
