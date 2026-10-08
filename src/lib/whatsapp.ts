import { z } from "zod";

export const waProductLink = (waNumber: string, productName: string) =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Assalamu alaikum, I want ${productName}`
  )}`;

export const CheckoutSchema = z.object({
  name: z.string().trim().min(3, "Name minimum 3 character").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Valid BD mobile number dao (01XXXXXXXXX)"),
  address: z.string().trim().min(10, "Full address dao").max(300),
  area: z.string().trim().min(1),
});

export type CheckoutForm = z.infer<typeof CheckoutSchema>;

export function buildOrderMessage(
  items: { name: string; fabric: string; qty: number; now: number }[],
  form: CheckoutForm,
  sub: number,
  del: number,
  total: number,
  areaLabel = ""
) {
  const itemText = items
    .map((c) => `${c.name} [${c.fabric}] x${c.qty} = ${c.now * c.qty}tk`)
    .join("; ");
  // Strip newlines and cap length before putting user input into the message.
  const clean = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 300);
  const areaBit = areaLabel ? ` Area: ${clean(areaLabel)}.` : "";
  return `Assalamu alaikum, I want to order: ${itemText}. Subtotal ${sub}tk + Delivery ${del}tk = Total ${total}tk.${areaBit} Name: ${clean(
    form.name
  )}, Phone: ${clean(form.phone)}, Address: ${clean(form.address)}`.slice(0, 1500);
}

export const waOrderLink = (waNumber: string, msg: string) =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
