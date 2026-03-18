"use client";

import { CompanyCard } from "@/app/components/CompanyCard/CompanyCard";

export default function Page() {
  const companies = [
    {
      id: "a1",
      name: "perim",
      people: 35,
      hi: "Amil",
    },
  ];
  return (
    <div className="space-y-6 p-8">
      <h1 className="font-bold text-2xl">EMPRESAS</h1>
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          name={company.name}
          people={company.people}
          hi={company.hi}
        />
      ))}
    </div>
  );
}
