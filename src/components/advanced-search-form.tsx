"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { getTagIcon } from "@/lib/card-icons";
import {
  domainFilterOptions,
  numericFilterRanges,
  rarityFilterOptions,
  typeFilterOptions,
} from "@/lib/search";
import type { AdvancedSearchFilters } from "@/lib/search";
import { cn } from "@/lib/utils";

type SetOption = {
  code: string;
  name: string;
};

type AdvancedSearchFormProps = {
  filters: AdvancedSearchFilters;
  sets: SetOption[];
};

type MultiSelectOption = {
  value: string;
  label: string;
  description?: string;
};

export function AdvancedSearchForm({ filters, sets }: AdvancedSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.query);
  const [domains, setDomains] = useState(filters.domains);
  const [selectedSets, setSelectedSets] = useState(filters.sets);
  const [types, setTypes] = useState(filters.types);
  const [rarities, setRarities] = useState(filters.rarities);
  const [energy, setEnergy] = useState(filters.energy);
  const [power, setPower] = useState(filters.power);
  const [might, setMight] = useState(filters.might);

  useEffect(() => {
    setQuery(filters.query);
    setDomains(filters.domains);
    setSelectedSets(filters.sets);
    setTypes(filters.types);
    setRarities(filters.rarities);
    setEnergy(filters.energy);
    setPower(filters.power);
    setMight(filters.might);
  }, [filters]);

  const setOptions = useMemo(
    () =>
      sets.map((set) => ({
        value: set.code,
        label: set.code,
        description: set.name,
      })),
    [sets],
  );

  const typeOptions = useMemo(
    () => typeFilterOptions.map((type) => ({ value: type, label: type })),
    [],
  );
  const rarityOptions = useMemo(
    () =>
      rarityFilterOptions.map((rarity) => ({ value: rarity, label: rarity })),
    [],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    domains.forEach((domain) => params.append("domain", domain));
    selectedSets.forEach((set) => params.append("set", set));
    types.forEach((type) => params.append("type", type));
    rarities.forEach((rarity) => params.append("rarity", rarity));
    appendRangeParams(params, "energy", energy);
    appendRangeParams(params, "power", power);
    appendRangeParams(params, "might", might);

    const search = params.toString();
    router.push(search ? `/search/advanced?${search}` : "/search/advanced");
  }

  function resetFilters() {
    router.push("/search/advanced");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cards"
            aria-label="Search cards"
            className="h-11 pl-9"
          />
        </div>
        <Button type="submit" className="h-11">
          <Search className="h-4 w-4" />
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={resetFilters}
        >
          <X className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-[max-content_minmax(8rem,1fr)_minmax(8rem,10rem)_minmax(9rem,11rem)] lg:gap-4 lg:grid-cols-[max-content_minmax(12rem,1fr)_minmax(8rem,10rem)_minmax(9rem,11rem)]">
        <DomainFilter selected={domains} onChange={setDomains} />
        <MultiSelectFilter
          label="Set"
          placeholder="All sets"
          options={setOptions}
          selected={selectedSets}
          onChange={setSelectedSets}
        />
        <MultiSelectFilter
          label="Type"
          placeholder="All types"
          options={typeOptions}
          selected={types}
          onChange={setTypes}
        />
        <MultiSelectFilter
          label="Rarity"
          placeholder="All rarities"
          options={rarityOptions}
          selected={rarities}
          onChange={setRarities}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <RangeFilter
          label="Energy"
          rangeKey="energy"
          value={energy}
          onChange={setEnergy}
        />
        <RangeFilter
          label="Power"
          rangeKey="power"
          value={power}
          onChange={setPower}
        />
        <RangeFilter
          label="Might"
          rangeKey="might"
          value={might}
          onChange={setMight}
        />
      </div>
    </form>
  );
}

function DomainFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (domains: string[]) => void;
}) {
  function toggleDomain(domain: string, checked: boolean) {
    onChange(
      checked
        ? [...selected, domain]
        : selected.filter((selectedDomain) => selectedDomain !== domain),
    );
  }

  return (
    <div className="w-full space-y-2 md:w-max">
      <Label>Domain</Label>
      <div className="grid grid-cols-6 gap-1 sm:gap-0.5 place-items-center">
        {domainFilterOptions.map((domain) => {
          const icon = getTagIcon(domain);
          const checked = selected.includes(domain);

          return (
            <Button
              key={domain}
              type="button"
              variant="ghost"
              aria-pressed={checked}
              aria-label={domain}
              onClick={() => toggleDomain(domain, !checked)}
              className={cn(
                "relative flex h-12 w-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs sm:h-10 sm:w-10 sm:text-[10px]",
                checked && "border-primary bg-primary/10 text-primary",
              )}
            >
              {icon?.mode === "image" ? (
                <img
                  src={icon.path}
                  alt=""
                  className="h-8 w-8 object-contain"
                  aria-hidden="true"
                />
              ) : (
                <span>{domain}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function MultiSelectFilter({
  label,
  placeholder,
  options,
  selected,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  function toggleValue(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((selectedValue) => selectedValue !== value)
        : [...selected, value],
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-between px-3 font-normal"
          >
            <span className="truncate">
              {selected.length === 0
                ? placeholder
                : `${selected.length} selected`}
            </span>
            <ChevronDown
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.description ?? ""}`}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <Checkbox checked={selected.includes(option.value)} />
                    <span className="font-medium">{option.label}</span>
                    {option.description ? (
                      <span className="truncate text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function RangeFilter({
  label,
  rangeKey,
  value,
  onChange,
}: {
  label: string;
  rangeKey: "energy" | "power" | "might";
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const bounds = numericFilterRanges[rangeKey];
  const isAny = value[0] === bounds.min && value[1] === bounds.max;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {isAny ? "Any" : `${value[0]}-${value[1]}`}
        </span>
      </div>
      <Slider
        value={value}
        min={bounds.min}
        max={bounds.max}
        step={1}
        minStepsBetweenThumbs={0}
        onValueChange={(nextValue) => {
          if (nextValue.length === 2) {
            onChange([nextValue[0], nextValue[1]]);
          }
        }}
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{bounds.min}</span>
        <span>{bounds.max}</span>
      </div>
    </div>
  );
}

function appendRangeParams(
  params: URLSearchParams,
  key: "energy" | "power" | "might",
  value: [number, number],
) {
  const bounds = numericFilterRanges[key];

  if (value[0] === bounds.min && value[1] === bounds.max) {
    return;
  }

  params.set(`${key}Min`, String(value[0]));
  params.set(`${key}Max`, String(value[1]));
}
