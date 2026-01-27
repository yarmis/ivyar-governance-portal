import {
  Shield,
  AlertOctagon,
  TrendingUp,
  Ban,
  StopCircle,
  Eye,
  Lock,
  Target,
  GitBranch,
  FileCheck
} from 'lucide-react';

export const GOVERNANCE_CARDS = [
  {
    id: 'authority_scope',
    title: 'Authority Scope',
    description: 'Defines what power the system receives from the institution: what it can evaluate, propose, and what always remains with humans.',
    icon: Shield,
    modalContent: {
      fullDescription: 'Визначає, яку саме владу система отримує від інституції: що вона може лише оцінювати, що — пропонувати, а що завжди залишається за людиною. This ensures clear boundaries between AI evaluation and human decision-making authority.',
      example: 'System can rank reconstruction projects by criteria, but cannot approve funding unilaterally.',
      jsonSnippet: {
        "delegated_authority": [
          "evaluate",
          "flag", 
          "propose"
        ],
        "reserved_for_human": [
          "approve",
          "override",
          "change_rules"
        ]
      }
    }
  },
  {
    id: 'boundary_conditions',
    title: 'Boundary Conditions',
    description: 'Describes limits the system must never cross under any circumstances—even if technically optimal.',
    icon: AlertOctagon,
    modalContent: {
      fullDescription: 'Описує межі, які система не має права перетинати за жодних умов — навіть якщо це виглядає оптимально з технічної точки зору. These boundaries protect constitutional principles and human rights.',
      example: 'System cannot reroute humanitarian aid for political advantage, regardless of efficiency gains.',
      jsonSnippet: {
        "boundary_conditions": {
          "never_cross": [
            "override_humanitarian_principles",
            "suppress_aid_to_regions",
            "authorize_lethal_force"
          ]
        }
      }
    }
  },
  {
    id: 'escalation_triggers',
    title: 'Escalation Triggers',
    description: 'Defines situations when the system must stop and escalate to human or institutional oversight.',
    icon: TrendingUp,
    modalContent: {
      fullDescription: 'Визначає ситуації, коли система зобов\'язана зупинитися і передати рішення на вищий рівень — людині або інституційному органу. This ensures human oversight for high-risk decisions.',
      example: 'Proposed route through active combat zone triggers mandatory escalation to humanitarian coordinator.',
      jsonSnippet: {
        "escalation_triggers": [
          "crossing_active_frontline",
          "civilian_harm_risk",
          "sanctions_exposure",
          "constitutional_conflict"
        ]
      }
    }
  },
  {
    id: 'non_permitted_actions',
    title: 'Non-Permitted Actions',
    description: 'Lists actions the system can never perform: from rule changes to decisions beyond mandate or violating rights.',
    icon: Ban,
    modalContent: {
      fullDescription: 'Фіксує дії, які система ніколи не може виконувати: від зміни правил до рішень, що виходять за межі мандату або порушують права. These are constitutional red lines.',
      example: 'System cannot modify eligibility criteria for social support, even if suggested by data patterns.',
      jsonSnippet: {
        "non_permitted_actions": [
          "change_eligibility_criteria",
          "approve_funding_unilaterally",
          "override_anti_corruption_rules",
          "modify_legal_definitions"
        ]
      }
    }
  },
  {
    id: 'mandatory_refusals',
    title: 'Mandatory Refusals',
    description: 'Cases when the system must refuse—regardless of context, pressure, or user request.',
    icon: StopCircle,
    modalContent: {
      fullDescription: 'Описує випадки, коли система зобов\'язана відмовити — незалежно від контексту, тиску або запиту користувача. These refusals protect fundamental principles.',
      example: 'Any request to authorize lethal force receives automatic refusal, no exceptions.',
      jsonSnippet: {
        "mandatory_refusals": [
          {
            "id": "no_lethal_decisions",
            "description": "Refuse any lethal force authorization",
            "applies_to": ["*"]
          },
          {
            "id": "no_policy_changes",
            "description": "Refuse to change constitutional rules",
            "applies_to": ["*"]
          }
        ]
      }
    }
  },
  {
    id: 'oversight_points',
    title: 'Oversight Points',
    description: 'Points where human oversight is mandatory: decisions that cannot complete without responsible officer confirmation.',
    icon: Eye,
    modalContent: {
      fullDescription: 'Визначає точки, де людський нагляд є обов\'язковим: які рішення не можуть бути завершені без підтвердження відповідальної особи. This ensures accountability.',
      example: 'All high-value disbursements require human officer approval before execution.',
      jsonSnippet: {
        "oversight_points": [
          {
            "decision_type": "high_value_disbursement",
            "requires": "human_officer_approval",
            "cannot_proceed_without": true
          }
        ]
      }
    }
  },
  {
    id: 'runtime_constraints',
    title: 'Runtime Constraints',
    description: 'Limits applied during real-time operation—preventing the system from expanding behavior beyond delegated bounds.',
    icon: Lock,
    modalContent: {
      fullDescription: 'Описує обмеження, які застосовуються під час роботи системи в реальному часі — щоб вона не розширювала свою поведінку поза делеговані межі. These constraints operate continuously.',
      example: 'System cannot propose actions outside its delegated authority, even if data suggests efficiency.',
      jsonSnippet: {
        "runtime_constraints": {
          "max_authority_scope": "delegated_only",
          "self_expansion": false,
          "mandate_override": false
        }
      }
    }
  },
  {
    id: 'intent_preservation',
    title: 'Intent Preservation',
    description: 'Ensures the system preserves institutional intent even under uncertainty, noise, or incomplete data.',
    icon: Target,
    modalContent: {
      fullDescription: 'Гарантує, що система зберігає початковий інституційний намір, навіть коли працює в умовах невизначеності, шуму або неповних даних. This maintains mission alignment.',
      example: 'When data is ambiguous, system defaults to humanitarian principles rather than efficiency maximization.',
      jsonSnippet: {
        "intent_preservation": {
          "primary_principle": "humanitarian_principles",
          "uncertainty_default": "conservative_human_aligned",
          "never_optimize_against": "constitutional_values"
        }
      }
    }
  },
  {
    id: 'risk_to_authority',
    title: 'Risk-to-Authority Mapping',
    description: 'Maps risk types to authority levels: what system can decide alone vs. what requires escalation.',
    icon: GitBranch,
    modalContent: {
      fullDescription: 'Показує, як різні типи ризиків пов\'язані з рівнями влади: що система може вирішувати сама, а що завжди потребує ескалації. This creates clear decision pathways.',
      example: 'Low-risk logistics decisions: system autonomous. High-risk political exposure: requires institutional body.',
      jsonSnippet: {
        "risk_mapping": [
          {
            "risk_level": "low",
            "authority": "system",
            "example": "warehouse_optimization"
          },
          {
            "risk_level": "high",
            "authority": "institutional_body",
            "example": "politically_exposed_beneficiary"
          }
        ]
      }
    }
  },
  {
    id: 'constitutional_guarantees',
    title: 'Constitutional Guarantees',
    description: 'Immutable principles the system cannot violate—even if policies, governments, or technical parameters change.',
    icon: FileCheck,
    modalContent: {
      fullDescription: 'Фіксує незмінні принципи, які система не може порушити — навіть якщо змінюються політики, уряди або технічні параметри. These are the constitutional foundation.',
      example: 'Fundamental rights protection remains constant regardless of operational pressure or efficiency goals.',
      jsonSnippet: {
        "constitutional_guarantees": [
          "no_fundamental_rights_violation",
          "no_retroactive_legitimization",
          "preserve_human_dignity",
          "maintain_rule_of_law"
        ]
      }
    }
  }
];
