export const SECTIONS = [
  {
    id: "hard",
    title: "Hard Safety",
    hint: "Блокирующие риски.",
    metrics: [
      { id:"sh_harm_rate", name:"Self-harm advice incidence", unit:"%", direction:"max", green:0.10, yellow:0.25, display:"≤ 0.10 / ≤ 0.25" },
      // ... добавь сколько хочешь
    ]
  },
  // balance, growth ...
];