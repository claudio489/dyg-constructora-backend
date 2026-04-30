export const safeJson = (obj: any) => {
  const seen = new WeakSet();

  const clean = (value: any) => {
    if (typeof value !== "object" || value === null) return value;

    if (seen.has(value)) {
      return undefined; // rompe ciclos
    }

    seen.add(value);

    if (Array.isArray(value)) {
      return value.map(clean);
    }

    const out: any = {};

    for (const key in value) {
      try {
        const v = value[key];

        if (typeof v === "function") continue;

        if (v === value) continue;

        out[key] = clean(v);
      } catch {
        // skip broken fields
      }
    }

    return out;
  };

  return clean(obj);
};