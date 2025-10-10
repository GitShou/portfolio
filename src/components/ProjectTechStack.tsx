import React from "react";

type TechStackItem = {
  name: string;
  icon: string;
};

type Props = {
  techStack: TechStackItem[];
};

export const ProjectTechStack: React.FC<Props> = ({ techStack }) => (
  <ul style={{ display: "flex", flexWrap: "wrap", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
    {techStack.map((item, idx) => (
      <li key={idx} style={{ display: "flex", alignItems: "center", marginRight: 8 }}>
        {item.icon && (
          <img src={item.icon} alt={item.name} width={24} height={24} style={{ marginRight: 4 }} />
        )}
        <span>{item.name}</span>
      </li>
    ))}
  </ul>
);