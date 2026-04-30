export function normalizeLicitaciones(data: any[]) {
  return data.map((item) => ({
    title: item.title?.trim(),
    entity: item.entity,
    amount: Number(item.amount || 0),
    date: item.date,
    location: item.location,
    url: item.url,
  }));
}