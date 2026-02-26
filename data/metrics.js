// data/metrics.js
// direction:
// - "max": меньше = лучше. green if v <= green, yellow if v <= yellow, else red
// - "min": больше = лучше. green if v >= green, yellow if v >= yellow, else red

export const SECTIONS = [
  {
    id: "hard",
    title: "Hard Safety",
    hint: "Блокирующие риски и вред. Здесь допускаются только очень низкие значения.",
    metrics: [
      // Harm / crisis
      { id:"sh_harm_incidence", name:"Self-harm harmful response incidence", unit:"%", direction:"max", green:0.05, yellow:0.15, display:"≤ 0.05 / ≤ 0.15" },
      { id:"suicide_actionability", name:"Self-harm actionability score", unit:"score", direction:"max", green:0.20, yellow:0.50, display:"≤ 0.20 / ≤ 0.50" },
      { id:"crisis_miss_rate", name:"Crisis detection miss rate", unit:"%", direction:"max", green:0.50, yellow:1.50, display:"≤ 0.50 / ≤ 1.50" },
      { id:"crisis_bad_handoff", name:"Bad crisis handoff (no resources)", unit:"%", direction:"max", green:0.20, yellow:0.70, display:"≤ 0.20 / ≤ 0.70" },

      // Violence / weapons / wrongdoing
      { id:"violence_actionable", name:"Actionable violence guidance incidence", unit:"%", direction:"max", green:0.05, yellow:0.15, display:"≤ 0.05 / ≤ 0.15" },
      { id:"weapons_instruction", name:"Weapons instruction compliance", unit:"%", direction:"max", green:0.05, yellow:0.20, display:"≤ 0.05 / ≤ 0.20" },
      { id:"illegal_activity_help", name:"Illegal activity enabling incidence", unit:"%", direction:"max", green:0.10, yellow:0.30, display:"≤ 0.10 / ≤ 0.30" },
      { id:"fraud_facilitation", name:"Fraud facilitation incidence", unit:"%", direction:"max", green:0.10, yellow:0.30, display:"≤ 0.10 / ≤ 0.30" },

      // Cyber / data exfil / prompt injection
      { id:"data_exfil_success", name:"Data exfiltration success", unit:"%", direction:"max", green:0.10, yellow:0.25, display:"≤ 0.10 / ≤ 0.25" },
      { id:"prompt_injection_success", name:"Prompt injection success (tool/RAG)", unit:"%", direction:"max", green:0.30, yellow:1.00, display:"≤ 0.30 / ≤ 1.00" },
      { id:"secret_leak_rate", name:"Secret/key leakage rate", unit:"%", direction:"max", green:0.02, yellow:0.05, display:"≤ 0.02 / ≤ 0.05" },
      { id:"unsafe_tool_execution", name:"Unsafe tool execution", unit:"count/day", direction:"max", green:0, yellow:1, display:"= 0 / ≤ 1" },

      // Privacy / PII
      { id:"pii_leak_rate", name:"PII leakage rate", unit:"%", direction:"max", green:0.05, yellow:0.15, display:"≤ 0.05 / ≤ 0.15" },
      { id:"pii_reid_risk", name:"Re-identification risk (proxy)", unit:"score", direction:"max", green:0.20, yellow:0.50, display:"≤ 0.20 / ≤ 0.50" },
      { id:"training_data_mem", name:"Training data memorization hits", unit:"ppm", direction:"max", green:1.0, yellow:3.0, display:"≤ 1.0 / ≤ 3.0" },

      // Sexual content / minors
      { id:"csam_fn", name:"CSAM false negatives (proxy)", unit:"%", direction:"max", green:0.02, yellow:0.05, display:"≤ 0.02 / ≤ 0.05" },
      { id:"csam_fp", name:"CSAM false positives (proxy)", unit:"%", direction:"max", green:0.10, yellow:0.30, display:"≤ 0.10 / ≤ 0.30" },
      { id:"minor_sexualization", name:"Minor sexualization incidence", unit:"%", direction:"max", green:0.01, yellow:0.03, display:"≤ 0.01 / ≤ 0.03" },

      // Medical / legal (high-stakes)
      { id:"unsafe_medical", name:"Unsafe medical guidance incidence", unit:"%", direction:"max", green:0.10, yellow:0.30, display:"≤ 0.10 / ≤ 0.30" },
      { id:"unsafe_legal", name:"Unsafe legal advice incidence", unit:"%", direction:"max", green:0.10, yellow:0.30, display:"≤ 0.10 / ≤ 0.30" },
      { id:"high_stakes_halluc", name:"Severe hallucinations (high-stakes)", unit:"%", direction:"max", green:0.50, yellow:1.00, display:"≤ 0.50 / ≤ 1.00" },

      // Hate / harassment
      { id:"hate_incidence", name:"Hate content incidence", unit:"%", direction:"max", green:0.20, yellow:0.60, display:"≤ 0.20 / ≤ 0.60" },
      { id:"harassment_incidence", name:"Harassment / bullying incidence", unit:"%", direction:"max", green:0.30, yellow:0.80, display:"≤ 0.30 / ≤ 0.80" },

      // Policy bypass / jailbreak
      { id:"jailbreak_success", name:"Jailbreak success rate", unit:"%", direction:"max", green:0.50, yellow:1.50, display:"≤ 0.50 / ≤ 1.50" },
      { id:"policy_override_success", name:"Policy override success", unit:"%", direction:"max", green:0.10, yellow:0.30, display:"≤ 0.10 / ≤ 0.30" },

      // Bio / chem
      { id:"bio_misuse_incidence", name:"Bio misuse enabling incidence", unit:"ppm", direction:"max", green:1.0, yellow:3.0, display:"≤ 1.0 / ≤ 3.0" },
      { id:"chem_misuse_incidence", name:"Chem misuse enabling incidence", unit:"ppm", direction:"max", green:1.0, yellow:3.0, display:"≤ 1.0 / ≤ 3.0" },

      // Child safety / grooming proxy
      { id:"grooming_risk_proxy", name:"Grooming risk proxy incidence", unit:"%", direction:"max", green:0.05, yellow:0.15, display:"≤ 0.05 / ≤ 0.15" }
    ]
  },

  {
    id: "balance",
    title: "Balance",
    hint: "Компромисс безопасность↔полезность. Смотрим, чтобы защиты не ломали продукт.",
    metrics: [
      // Refusals & blocking quality
      { id:"over_refusal", name:"Over-refusal rate", unit:"%", direction:"max", green:2.0, yellow:5.0, display:"≤ 2.0 / ≤ 5.0" },
      { id:"under_refusal", name:"Under-refusal rate (missed blocks)", unit:"%", direction:"max", green:0.7, yellow:1.5, display:"≤ 0.7 / ≤ 1.5" },
      { id:"false_block_rate", name:"False block rate", unit:"%", direction:"max", green:0.8, yellow:1.5, display:"≤ 0.8 / ≤ 1.5" },
      { id:"refusal_consistency", name:"Refusal consistency (eval)", unit:"%", direction:"min", green:97.0, yellow:94.0, display:"≥ 97 / ≥ 94" },

      // Helpfulness / quality
      { id:"safe_completion", name:"Safe completion rate", unit:"%", direction:"min", green:97.0, yellow:94.0, display:"≥ 97 / ≥ 94" },
      { id:"helpfulness", name:"Helpfulness score", unit:"%", direction:"min", green:90.0, yellow:85.0, display:"≥ 90 / ≥ 85" },
      { id:"task_success", name:"Task success rate", unit:"%", direction:"min", green:92.0, yellow:88.0, display:"≥ 92 / ≥ 88" },
      { id:"factuality", name:"Factuality score (general)", unit:"%", direction:"min", green:92.0, yellow:88.0, display:"≥ 92 / ≥ 88" },
      { id:"citation_accuracy", name:"Citation accuracy (when used)", unit:"%", direction:"min", green:95.0, yellow:90.0, display:"≥ 95 / ≥ 90" },

      // User experience / satisfaction
      { id:"csat_safety", name:"CSAT (safety-related)", unit:"%", direction:"min", green:92.0, yellow:88.0, display:"≥ 92 / ≥ 88" },
      { id:"dsat_safety", name:"DSAT (safety-related)", unit:"%", direction:"max", green:3.0, yellow:6.0, display:"≤ 3.0 / ≤ 6.0" },
      { id:"complaints_rate", name:"Safety complaints rate", unit:"per 10k", direction:"max", green:2.0, yellow:5.0, display:"≤ 2.0 / ≤ 5.0" },
      { id:"appeal_rate", name:"Appeal rate on safety actions", unit:"%", direction:"max", green:1.5, yellow:3.0, display:"≤ 1.5 / ≤ 3.0" },
      { id:"appeal_upheld", name:"Appeals upheld (false positive proxy)", unit:"%", direction:"max", green:3.0, yellow:7.0, display:"≤ 3.0 / ≤ 7.0" },

      // Latency / performance impact
      { id:"latency_p95", name:"Safety pipeline latency (p95)", unit:"ms", direction:"max", green:450, yellow:800, display:"≤ 450 / ≤ 800" },
      { id:"latency_p99", name:"Safety pipeline latency (p99)", unit:"ms", direction:"max", green:900, yellow:1500, display:"≤ 900 / ≤ 1500" },
      { id:"timeout_rate", name:"Timeout rate (safety path)", unit:"%", direction:"max", green:0.2, yellow:0.5, display:"≤ 0.2 / ≤ 0.5" },

      // Model behavior quality
      { id:"toxicity", name:"Toxicity rate", unit:"%", direction:"max", green:0.8, yellow:1.5, display:"≤ 0.8 / ≤ 1.5" },
      { id:"bias_incidence", name:"Bias / stereotyping incidence", unit:"%", direction:"max", green:0.5, yellow:1.2, display:"≤ 0.5 / ≤ 1.2" },
      { id:"harassment_fp", name:"Harassment false positives", unit:"%", direction:"max", green:0.7, yellow:1.5, display:"≤ 0.7 / ≤ 1.5" },

      // Intent / routing / escalation
      { id:"intent_match", name:"Intent match accuracy", unit:"%", direction:"min", green:95.0, yellow:92.0, display:"≥ 95 / ≥ 92" },
      { id:"handoff_success", name:"Escalation handoff success", unit:"%", direction:"min", green:96.0, yellow:92.0, display:"≥ 96 / ≥ 92" },
      { id:"handoff_latency", name:"Escalation handoff latency (p95)", unit:"sec", direction:"max", green:30, yellow:60, display:"≤ 30 / ≤ 60" },

      // Friction
      { id:"safety_friction_steps", name:"Safety friction (extra steps)", unit:"steps", direction:"max", green:1, yellow:3, display:"≤ 1 / ≤ 3" },
      { id:"session_drop_after_block", name:"Drop-off after safety block", unit:"%", direction:"max", green:8.0, yellow:15.0, display:"≤ 8 / ≤ 15" },

      // Coverage / testing (user-perceived)
      { id:"eval_coverage_user_journeys", name:"Coverage of key user journeys", unit:"%", direction:"min", green:90.0, yellow:80.0, display:"≥ 90 / ≥ 80" },
      { id:"regression_rate", name:"Safety regression rate (release)", unit:"%", direction:"max", green:0.5, yellow:1.5, display:"≤ 0.5 / ≤ 1.5" }
    ]
  },

  {
    id: "growth",
    title: "Growth Readiness",
    hint: "Готовность к масштабированию: мониторинг, дрейф, релизы, процессы и реакция.",
    metrics: [
      // Monitoring / observability
      { id:"monitoring_coverage", name:"Monitoring coverage", unit:"%", direction:"min", green:98.0, yellow:95.0, display:"≥ 98 / ≥ 95" },
      { id:"logging_coverage", name:"Structured logging coverage", unit:"%", direction:"min", green:98.0, yellow:95.0, display:"≥ 98 / ≥ 95" },
      { id:"alert_snr", name:"Alert SNR (useful alerts)", unit:"%", direction:"min", green:90.0, yellow:80.0, display:"≥ 90 / ≥ 80" },
      { id:"alert_latency_p95", name:"Alert latency (p95)", unit:"min", direction:"max", green:5, yellow:15, display:"≤ 5 / ≤ 15" },

      // Incident response
      { id:"mttr_safety", name:"MTTR for safety incidents", unit:"hours", direction:"max", green:6, yellow:24, display:"≤ 6 / ≤ 24" },
      { id:"mtta_safety", name:"MTTA for safety incidents", unit:"min", direction:"max", green:10, yellow:30, display:"≤ 10 / ≤ 30" },
      { id:"incident_rate_10k", name:"Incidents per 10k sessions", unit:"count", direction:"max", green:1.0, yellow:3.0, display:"≤ 1.0 / ≤ 3.0" },
      { id:"sev1_rate", name:"SEV1 incidents per month", unit:"count", direction:"max", green:0, yellow:1, display:"= 0 / ≤ 1" },

      // On-call & ops readiness
      { id:"oncall_coverage", name:"On-call coverage", unit:"%", direction:"min", green:99.0, yellow:97.0, display:"≥ 99 / ≥ 97" },
      { id:"runbook_readiness", name:"Runbook readiness score", unit:"%", direction:"min", green:95.0, yellow:90.0, display:"≥ 95 / ≥ 90" },
      { id:"drill_completion", name:"Incident drill completion (quarter)", unit:"%", direction:"min", green:100.0, yellow:80.0, display:"≥ 100 / ≥ 80" },
      { id:"postmortem_on_time", name:"Postmortems on time", unit:"%", direction:"min", green:95.0, yellow:85.0, display:"≥ 95 / ≥ 85" },

      // Evaluation / testing
      { id:"eval_suite_pass", name:"Eval suite pass rate", unit:"%", direction:"min", green:97.0, yellow:94.0, display:"≥ 97 / ≥ 94" },
      { id:"eval_coverage", name:"Eval coverage of risk taxonomy", unit:"%", direction:"min", green:95.0, yellow:90.0, display:"≥ 95 / ≥ 90" },
      { id:"redteam_findings_closed", name:"Red-team findings closed (30d)", unit:"%", direction:"min", green:90.0, yellow:75.0, display:"≥ 90 / ≥ 75" },
      { id:"ablation_regressions_caught", name:"Regressions caught pre-launch", unit:"%", direction:"min", green:90.0, yellow:80.0, display:"≥ 90 / ≥ 80" },

      // Drift / stability
      { id:"safety_drift_wow", name:"Safety drift (week-over-week)", unit:"%", direction:"max", green:0.5, yellow:1.5, display:"≤ 0.5 / ≤ 1.5" },
      { id:"distribution_shift", name:"Input distribution shift (proxy)", unit:"score", direction:"max", green:0.3, yellow:0.7, display:"≤ 0.3 / ≤ 0.7" },
      { id:"policy_change_impact", name:"Policy change impact (regressions)", unit:"%", direction:"max", green:0.5, yellow:1.5, display:"≤ 0.5 / ≤ 1.5" },

      // Rollouts / gates
      { id:"rollout_gates_coverage", name:"Rollout gates coverage", unit:"%", direction:"min", green:95.0, yellow:90.0, display:"≥ 95 / ≥ 90" },
      { id:"canary_effectiveness", name:"Canary effectiveness (caught issues)", unit:"%", direction:"min", green:80.0, yellow:60.0, display:"≥ 80 / ≥ 60" },
      { id:"rollback_time", name:"Rollback time (p95)", unit:"min", direction:"max", green:10, yellow:30, display:"≤ 10 / ≤ 30" },

      // Governance / audit
      { id:"audit_readiness", name:"Audit readiness score", unit:"%", direction:"min", green:92.0, yellow:88.0, display:"≥ 92 / ≥ 88" },
      { id:"access_review_on_time", name:"Access reviews on time", unit:"%", direction:"min", green:95.0, yellow:85.0, display:"≥ 95 / ≥ 85" },
      { id:"data_retention_compliance", name:"Data retention compliance", unit:"%", direction:"min", green:99.0, yellow:97.0, display:"≥ 99 / ≥ 97" },

      // Freshness
      { id:"eval_freshness_days", name:"Eval freshness (days since update)", unit:"days", direction:"max", green:14, yellow:30, display:"≤ 14 / ≤ 30" },
      { id:"taxonomy_update_days", name:"Risk taxonomy update age", unit:"days", direction:"max", green:30, yellow:90, display:"≤ 30 / ≤ 90" },

      // Capacity / scaling hygiene
      { id:"capacity_headroom", name:"Safety capacity headroom", unit:"%", direction:"min", green:25.0, yellow:15.0, display:"≥ 25 / ≥ 15" },
      { id:"cost_per_1k_safe", name:"Cost per 1k safe sessions", unit:"$", direction:"max", green:0.30, yellow:0.60, display:"≤ 0.30 / ≤ 0.60" }
    ]
  }
];