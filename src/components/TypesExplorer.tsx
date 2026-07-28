"use client";

import { useMemo, useState } from "react";
import { TypeCard } from "@/components/TypeCard";
import {
  destinyTypes,
  elementFamilyOptions,
  elementThemes,
  getStructureDisplayName,
  structureOptions,
  tenGodArchetypes,
  tenGodOptions,
  type DestinyType,
  type ElementFamily,
  type TenGod,
} from "@/data/types";

type AllOption = "all";

const filterControlClass =
  "mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none transition-[border-color,background-color,color,box-shadow] duration-200 focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--line-strong)]";

const inactiveSelectClass =
  "border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] hover:border-[var(--line-strong)]";

const activeSelectClass =
  "border-[var(--ink)] bg-[var(--ink)] text-[var(--white)]";

function matchesSearch(type: DestinyType, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    type.destinyMainName,
    type.socialName,
    type.nameEn,
    type.oneLiner,
    type.code,
    type.dominantTenGod,
    type.spiritArchetype,
    elementThemes[type.elementFamily].name,
    getStructureDisplayName(type.structureKey, type.dominantTenGod),
    ...type.keywords,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function TypesExplorer() {
  const [query, setQuery] = useState("");
  const [element, setElement] = useState<ElementFamily | AllOption>("all");
  const [tenGod, setTenGod] = useState<TenGod | AllOption>("all");
  const [structure, setStructure] = useState<string | AllOption>("all");

  const elementCounts = useMemo(() => {
    return destinyTypes.reduce(
      (counts, type) => ({
        ...counts,
        [type.elementFamily]: (counts[type.elementFamily] ?? 0) + 1,
      }),
      {} as Record<ElementFamily, number>,
    );
  }, []);

  const filteredTypes = useMemo(() => {
    return destinyTypes.filter((type) => {
      const elementMatched =
        element === "all" || type.elementFamily === element;
      const tenGodMatched =
        tenGod === "all" || type.dominantTenGod === tenGod;
      const structureMatched =
        structure === "all" || type.structureKey === structure;

      return (
        elementMatched &&
        tenGodMatched &&
        structureMatched &&
        matchesSearch(type, query)
      );
    });
  }, [element, query, structure, tenGod]);

  return (
    <>
      <section className="mx-auto mt-7 max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:max-w-6xl sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_140px_170px_190px]">
          <label className="block">
            <span className="text-xs font-bold tracking-[0.16em] text-[var(--muted)]">
              搜索命格
            </span>
            <input
              className={`${filterControlClass} border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] placeholder:text-[var(--muted)] hover:border-[var(--line-strong)]`}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="命格主名 / 传播名 / 关键词"
              value={query}
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold tracking-[0.16em] text-[var(--muted)]">
              五行
            </span>
            <select
              className={`${filterControlClass} font-semibold ${
                element === "all" ? inactiveSelectClass : activeSelectClass
              }`}
              onChange={(event) =>
                setElement(event.target.value as ElementFamily | AllOption)
              }
              value={element}
            >
              <option value="all">全部五行</option>
              {elementFamilyOptions.map((item) => (
                <option key={item} value={item}>
                  {elementThemes[item].name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold tracking-[0.16em] text-[var(--muted)]">
              十神灵相
            </span>
            <select
              className={`${filterControlClass} font-semibold ${
                tenGod === "all" ? inactiveSelectClass : activeSelectClass
              }`}
              onChange={(event) =>
                setTenGod(event.target.value as TenGod | AllOption)
              }
              value={tenGod}
            >
              <option value="all">全部十神</option>
              {tenGodOptions.map((item) => (
                <option key={item} value={item}>
                  {item} · {tenGodArchetypes[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold tracking-[0.16em] text-[var(--muted)]">
              十神结构倾向
            </span>
            <select
              className={`${filterControlClass} font-semibold ${
                structure === "all" ? inactiveSelectClass : activeSelectClass
              }`}
              onChange={(event) => setStructure(event.target.value)}
              value={structure}
            >
              <option value="all">全部结构</option>
              {structureOptions.map((item) => (
                <option key={item} value={item}>
                  {getStructureDisplayName(item)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4 text-xs font-semibold text-[var(--muted)]">
          <span className="rounded-md border border-[var(--line-strong)] bg-[var(--ink)] px-3 py-1.5 text-[var(--white)]">
            全部标签 {destinyTypes.length}
          </span>
          {elementFamilyOptions.map((item) => (
            <span
              className="rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-3 py-1.5 text-[var(--ink-soft)]"
              key={item}
            >
              {elementThemes[item].name} {elementCounts[item] ?? 0}
            </span>
          ))}
          <span className="rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-3 py-1.5 text-[var(--muted)]">
            当前显示 {filteredTypes.length}
          </span>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTypes.map((type) => (
          <TypeCard key={type.id} type={type} />
        ))}
      </section>
    </>
  );
}
