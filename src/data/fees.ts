import { activities, fees } from './mock';

/** Monthly fee lines = base fees + the extra activities the child is enrolled in. */
export function feeLines(enrolled: Record<string, boolean>) {
  return [
    ...fees.lines,
    ...activities.filter((a) => enrolled[a.id]).map((a) => ({ label: a.name, amount: a.price })),
  ];
}

export function feeTotal(enrolled: Record<string, boolean>) {
  return feeLines(enrolled).reduce((s, l) => s + l.amount, 0);
}
