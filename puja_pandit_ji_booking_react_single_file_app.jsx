import React, { useMemo, useRef, useState } from "react";

// === QUICK SETUP ===
// 1) Replace CONTACT and PAYMENT constants below with real details.
// 2) Drop this file into a React/Vite project and make it the default route OR render it in App.jsx.
// 3) Ensure Tailwind CSS is configured. (PostCSS + tailwind.config.js with content scanning.)
// 4) Run `npm run dev` and customize as needed.

const CONTACT = {
  panditName: "Pandit Vinod Sharma",
  phone: "+91 98765 43210", // Publicly shown on site
  whatsapp: "919876543210", // Digits only for wa.me link (country code + number). Replace with your number.
  address: "Shree Mandir Marg, Jaipur, Rajasthan",
  email: "bookings@panditji.example"
};

const PAYMENT = {
  upiString: "panditji@upi", // For text display
  qrImageUrl:
    "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi%3A%2F%2Fpay%3Fpa%3Dpanditji%40upi%26pn%3DPandit%2520Ji%26cu%3DINR", // Replace with your static UPI QR image URL
};

const PUJAS = [
  {
    id: "satyanarayan-katha",
    name: "Satyanarayan Katha",
    price: 2100,
    duration: "2–3 hours",
    materials: [
      "Kalash",
      "Coconut",
      "Moli",
      "Panchamrit",
      "Dry fruits",
      "Panch phal",
      "Ghee diya",
      "Laung elaichi",
      "Hawan samagri",
    ],
    desc:
      "Auspicious katha for prosperity and family well-being, performed on full moon or special occasions.",
  },
  {
    id: "griha-pravesh",
    name: "Griha Pravesh Puja",
    price: 3100,
    duration: "3–4 hours",
    materials: [
      "Navagraha yantra",
      "Kalash",
      "Gangajal",
      "Mango leaves",
      "Turmeric",
      "Rice",
      "Flowers",
      "Camphor",
      "Hawan samagri",
    ],
    desc:
      "Housewarming ceremony to purify the new home and invite positive energies.",
  },
  {
    id: "rudrabhishek",
    name: "Rudrabhishek",
    price: 2500,
    duration: "2 hours",
    materials: [
      "Bilva patra",
      "Milk curd honey ghee sugar",
      "Ganga jal",
      "Bhasma",
      "White flowers",
      "Rudra mantra book",
    ],
    desc:
      "Lord Shiva abhishek for health, protection, and removal of obstacles.",
  },
  {
    id: "navratri-puja",
    name: "Navratri Puja (Daily/Complete)",
    price: 5100,
    duration: "Custom",
    materials: [
      "Durga idol or photo",
      "Kumkum",
      "Akshat",
      "Nariyal",
      "Panchmeva",
      "Deepak",
      "Hawan samagri",
    ],
    desc:
      "Nine-day worship of Goddess Durga with daily archana and hawan.",
  },
  {
    id: "marriage-puja",
    name: "Vivah Puja (Pre/Post)",
    price: 11000,
    duration: "Half/Full day",
    materials: [
      "Mandap setup",
      "Samidha",
      "Havan kund",
      "Haldi kumkum",
      "Akshat",
      "Kalasas",
      "Fruits sweets",
    ],
    desc:
      "Traditional marriage rituals as per sampradaya, muhurat, and gotra.",
  },
];

const FESTIVALS = [
  "Makar Sankranti",
  "Mahashivratri",
  "Holi",
  "Navratri",
  "Ganesh Chaturthi",
  "Dussehra",
  "Diwali",
  "Chhath Puja",
  "Guru Purnima",
];

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

function Section({ title, subtitle, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-700">{title}</h2>
        {subtitle && (
          <p className="text-sm md:text-base text-slate-600 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function useCaptcha(len = 6) {
  const [value, setValue] = useState("");
  const regenerate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid easily-confused chars
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    setValue(out);
  };
  React.useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { value, regenerate };
}

function PujaCard({ puja, onSelect }) {
  return (
    <div className="rounded-2xl shadow-md bg-white border border-amber-100 hover:shadow-lg transition p-5 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{puja.name}</h3>
          <p className="text-sm text-slate-600 mt-1">{puja.desc}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-amber-700">₹ {puja.price.toLocaleString()}</div>
          <div className="text-xs text-slate-500">Duration: {puja.duration}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-medium text-slate-700 mb-1">Materials:</div>
        <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
          {puja.materials.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => onSelect(puja)}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-amber-600 text-white px-4 py-2 font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Book {puja.name}
      </button>
    </div>
  );
}

function Receipt({ booking }) {
  const ref = useRef(null);
  const onPrint = () => {
    if (!ref.current) return;
    const printContents = ref.current.innerHTML;
    const w = window.open("", "print");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Receipt</title><style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;padding:24px} .box{border:1px solid #ddd;border-radius:12px;padding:16px} .muted{color:#475569}</style></head><body>${printContents}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  if (!booking) return null;
  const { name, phone, address, pujaType, pujaName, date, time, amount, notes, orderId } = booking;
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5">
      <div ref={ref}>
        <div className="box">
          <h3 className="text-xl font-bold text-amber-700">Receipt – Puja Booking</h3>
          <p className="text-sm text-slate-600">Order ID: {orderId}</p>
          <hr className="my-3" />
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold">Customer</div>
              <div className="muted">{name}</div>
              <div className="muted">{phone}</div>
              <div className="muted">{address}</div>
            </div>
            <div>
              <div className="font-semibold">Booking Details</div>
              <div className="muted">Puja: {pujaName}</div>
              <div className="muted">Date: {date}</div>
              <div className="muted">Time: {time}</div>
              <div className="muted">Advance Paid: ₹ {amount?.toLocaleString?.() ?? amount}</div>
            </div>
          </div>
          {notes && (
            <div className="mt-3 text-sm">
              <div className="font-semibold">Notes</div>
              <div className="muted">{notes}</div>
            </div>
          )}
          <hr className="my-3" />
          <div className="text-sm">
            <div className="font-semibold">Pandit Ji</div>
            <div className="muted">{CONTACT.panditName}</div>
            <div className="muted">Phone: {CONTACT.phone}</div>
            <div className="muted">Address: {CONTACT.address}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onPrint}
          className="inline-flex items-center rounded-xl bg-amber-600 text-white px-4 py-2 hover:bg-amber-700"
        >
          Print / Save PDF
        </button>
        {booking?.phone && (
          <a
            href={`https://wa.me/${booking.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Receipt – Puja Booking%0AOrder ID: ${orderId}%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}%0APuja: ${pujaName}%0ADate: ${date}%0ATime: ${time}%0AAdvance Paid: ₹ ${amount}\nThank you for booking with ${CONTACT.panditName}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl border border-amber-300 text-amber-700 px-4 py-2 hover:bg-amber-50"
          >
            Send Receipt on Customer WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export default function PujaBookingApp() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const { value: captchaValue, regenerate } = useCaptcha(6);
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pujaId: "",
    date: "",
    time: "",
    festival: "",
    amount: "",
    notes: "",
    captchaInput: "",
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return PUJAS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.materials.some((m) => m.toLowerCase().includes(q))
    );
  }, [query]);

  const onSelectPuja = (puja) => {
    setSelected(puja);
    setForm((f) => ({ ...f, pujaId: puja.id }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const currentPuja = useMemo(() => PUJAS.find((p) => p.id === form.pujaId) || selected, [form.pujaId, selected]);

  const openWhatsAppToPandit = (payloadText) => {
    const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(payloadText)}`;
    window.open(url, "_blank");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const required = ["name", "phone", "address", "date", "time"];
    for (const key of required) {
      if (!form[key]) {
        alert(`Please fill ${key}.`);
        return;
      }
    }
    if (!currentPuja) {
      alert("Please select a puja.");
      return;
    }
    if (form.captchaInput.trim().toUpperCase() !== captchaValue) {
      alert("Captcha incorrect. Please try again.");
      regenerate();
      return;
    }

    const orderId = `PJ-${Date.now().toString().slice(-8)}`;
    const payload = `New Puja Booking\nOrder ID: ${orderId}\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\nPuja: ${currentPuja.name}\nDate: ${form.date}\nTime: ${form.time}\nFestival: ${form.festival || "-"}\nAdvance (₹): ${form.amount || "0"}\nNotes: ${form.notes || "-"}`;

    // WhatsApp to Pandit Ji
    openWhatsAppToPandit(payload);

    // Save booking for receipt display
    setBooking({
      orderId,
      name: form.name,
      phone: form.phone,
      address: form.address,
      pujaType: currentPuja.id,
      pujaName: currentPuja.name,
      date: form.date,
      time: form.time,
      amount: Number(form.amount || 0),
      notes: form.notes,
    });

    // Reset captcha
    regenerate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-amber-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">🪔</div>
            <div>
              <div className="text-lg font-bold text-slate-800">Puja & Pandit Ji Services</div>
              <div className="text-xs text-slate-500">Spiritual rituals • Trusted guidance</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <a href="#pujas" className="text-slate-700 hover:text-amber-700">Pujas</a>
            <a href="#booking" className="text-slate-700 hover:text-amber-700">Booking</a>
            <a href="#payment" className="text-slate-700 hover:text-amber-700">Payment</a>
            <a href="#contact" className="text-slate-700 hover:text-amber-700">Contact</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-amber-800">
              Book Trusted Puja & Rituals with {CONTACT.panditName}
            </h1>
            <p className="mt-3 text-slate-600">
              Authentic Vedic rituals for your home, office, and auspicious occasions. Clear pricing, materials list, and instant WhatsApp booking.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#booking" className="rounded-xl bg-amber-600 text-white px-5 py-3 font-medium hover:bg-amber-700">Book Now</a>
              <a href={`tel:${CONTACT.phone}`} className="rounded-xl border border-amber-300 text-amber-700 px-5 py-3 font-medium hover:bg-amber-50">Call {CONTACT.phone}</a>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-amber-100 p-5 shadow-sm">
            <div className="text-sm font-medium text-slate-700 mb-2">Festival Advance Booking</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FESTIVALS.map((f) => (
                <div key={f} className="text-xs px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-800">
                  {f}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Book early to secure your preferred date during peak seasons like Navratri and Diwali.
            </p>
          </div>
        </div>
      </section>

      {/* Pujas List */}
      <Section id="pujas" title="Available Pujas" subtitle="Transparent pricing with full materials list">
        <div className="flex items-center gap-3 mb-5">
          <input
            type="text"
            placeholder="Search puja or material…"
            className="w-full md:w-80 rounded-xl border border-amber-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <a
            href="#booking"
            className="rounded-xl bg-amber-600 text-white px-4 py-2 font-medium hover:bg-amber-700"
          >
            Go to Booking
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <PujaCard key={p.id} puja={p} onSelect={onSelectPuja} />
          ))}
        </div>
      </Section>

      {/* Booking */}
      <Section id="booking" title="Book a Puja" subtitle="Fill details, confirm captcha, and send to WhatsApp instantly">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-amber-200 p-5 grid md:grid-cols-2 gap-5">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
              <input name="phone" value={form.phone} onChange={onChange} placeholder="e.g. 9198XXXXXXXX" className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Address</label>
              <textarea name="address" value={form.address} onChange={onChange} rows={3} className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" name="date" value={form.date} onChange={onChange} className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Time</label>
                <input type="time" name="time" value={form.time} onChange={onChange} className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Select Puja</label>
              <select
                name="pujaId"
                value={form.pujaId}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Choose Puja --</option>
                {PUJAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹ {p.price.toLocaleString()})
                  </option>
                ))}
              </select>
              {currentPuja && (
                <p className="text-xs text-slate-500 mt-1">Materials: {currentPuja.materials.join(", ")}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Festival (optional)</label>
                <select name="festival" value={form.festival} onChange={onChange} className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select Festival --</option>
                  {FESTIVALS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Advance Amount (₹)</label>
                <input name="amount" value={form.amount} onChange={onChange} type="number" min="0" className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Special Instructions</label>
              <textarea name="notes" value={form.notes} onChange={onChange} rows={3} className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500" />
            </div>

            {/* Captcha */}
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700">Enter Captcha</label>
                <input name="captchaInput" value={form.captchaInput} onChange={onChange} placeholder="Type the code shown" className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2 focus:ring-2 focus:ring-amber-500 tracking-widest uppercase" />
              </div>
              <div className="flex flex-col items-center">
                <div className="select-none rounded-xl border border-amber-300 bg-amber-50 text-amber-800 font-extrabold text-lg px-4 py-2 tracking-widest">
                  {captchaValue}
                </div>
                <button type="button" onClick={regenerate} className="text-xs text-amber-700 mt-1 hover:underline">Refresh</button>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" className="rounded-xl bg-amber-600 text-white px-5 py-3 font-medium hover:bg-amber-700">Confirm & Send to WhatsApp</button>
              {currentPuja && (
                <button
                  type="button"
                  onClick={() => onSelectPuja(currentPuja)}
                  className="rounded-xl border border-amber-300 text-amber-700 px-5 py-3 font-medium hover:bg-amber-50"
                >
                  View Materials
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Show receipt after booking */}
        {booking && (
          <div className="mt-6">
            <Receipt booking={booking} />
          </div>
        )}
      </Section>

      {/* Payment */}
      <Section id="payment" title="Payment – UPI / QR" subtitle="Scan and pay advance. Share transaction reference on WhatsApp for instant confirmation.">
        <div className="bg-white rounded-3xl border border-amber-200 p-5 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-sm text-slate-600">Scan QR to Pay</div>
            <img
              src={PAYMENT.qrImageUrl}
              alt="Payment QR"
              className="mt-2 w-56 h-56 object-contain rounded-xl border border-amber-100 bg-amber-50 p-2"
            />
            <div className="text-sm text-slate-600 mt-3">UPI ID: <span className="font-semibold text-slate-800">{PAYMENT.upiString}</span></div>
            <p className="text-xs text-slate-500 mt-1">Note: Replace QR image URL and UPI string in code with your real payment details.</p>
          </div>
          <div className="text-sm text-slate-700">
            <ul className="list-disc pl-5 space-y-2">
              <li>Pay advance to confirm your date during festivals.</li>
              <li>Keep payment reference ID for receipt.</li>
              <li>For any payment issue, message us on WhatsApp.</li>
            </ul>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hello Pandit Ji, I have paid the advance. My name is ")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-4 rounded-xl bg-amber-600 text-white px-5 py-3 font-medium hover:bg-amber-700"
            >
              WhatsApp Payment Confirmation
            </a>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact" subtitle="Reach out for muhurat & custom rituals">
        <div className="bg-white rounded-3xl border border-amber-200 p-5 grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-slate-600">Pandit Ji</div>
            <div className="text-lg font-bold text-slate-800">{CONTACT.panditName}</div>
            <div className="text-sm text-slate-600">Phone: <a className="hover:underline" href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a></div>
            <div className="text-sm text-slate-600">WhatsApp: <a className="hover:underline" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">wa.me/{CONTACT.whatsapp}</a></div>
            <div className="text-sm text-slate-600">Email: <a className="hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
            <div className="text-sm text-slate-600">Address: {CONTACT.address}</div>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-amber-200 p-4 text-sm text-slate-700 bg-amber-50">
              <div className="font-semibold text-amber-800">Note on WhatsApp Notifications</div>
              <p className="mt-1">
                This site opens WhatsApp with all booking details filled. Please ensure your WhatsApp number is correct in the code (CONTACT.whatsapp). For automated server-side messaging, integrate a backend with WhatsApp Business API or Twilio.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-amber-100 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Puja & Pandit Ji Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
