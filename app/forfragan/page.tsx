"use client";

import { FormEvent, useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";

type InquiryType =
  | "konferens"
  | "catering"
  | "event"
  | "brollop"
  | "privat-fest"
  | "minnesstund"
  | "kontakt";

type FormConfig = {
  label: string;
  heading: string;
  intro: string;
  submitLabel: string;
  successHeading: string;
  successText: string;
};

const configs: Record<InquiryType, FormConfig> = {
  konferens: {
    label: "Konferensförfrågan",
    heading: "Berätta om er konferens.",
    intro:
      "Fyll i det ni vet redan nu. Vi återkommer och hjälper er vidare med lokal, mat, fika och upplägg.",
    submitLabel: "Skicka konferensförfrågan",
    successHeading: "Tack för er förfrågan.",
    successText:
      "Vi har tagit emot uppgifterna och återkommer så snart vi kan för att prata vidare om konferensen och upplägget.",
  },

  catering: {
    label: "Cateringförfrågan",
    heading: "Vad planerar ni?",
    intro:
      "Berätta lite om tillfället, ungefär hur många ni blir och vad ni har tänkt er så hjälper vi er att hitta ett upplägg som passar.",
    submitLabel: "Skicka cateringförfrågan",
    successHeading: "Tack för din cateringförfrågan.",
    successText:
      "Vi har tagit emot dina önskemål och återkommer så snart vi kan för att prata vidare om upplägg, meny och detaljer.",
  },

  event: {
    label: "Eventförfrågan",
    heading: "Ses vi på nästa?",
    intro:
      "Har du frågor om ett event eller vill boka något hos oss? Skicka några rader så återkommer vi.",
    submitLabel: "Skicka eventförfrågan",
    successHeading: "Tack för din förfrågan.",
    successText:
      "Vi har tagit emot ditt meddelande och återkommer så snart vi kan med mer information.",
  },

  brollop: {
    label: "Bröllopsförfrågan",
    heading: "Berätta om er dag.",
    intro:
      "Skicka det ni vet om datum, antal gäster och hur ni föreställer er dagen. Vi återkommer gärna och pratar vidare om möjligheterna.",
    submitLabel: "Skicka bröllopsförfrågan",
    successHeading: "Tack för er förfrågan.",
    successText:
      "Vi har tagit emot era uppgifter och ser fram emot att höra mer om dagen ni planerar.",
  },

  "privat-fest": {
    label: "Privat tillställning",
    heading: "Vad vill ni fira?",
    intro:
      "Födelsedag, jubileum eller något helt annat. Berätta lite om tillfället så hjälper vi er vidare.",
    submitLabel: "Skicka förfrågan",
    successHeading: "Tack för din förfrågan.",
    successText:
      "Vi har tagit emot dina uppgifter och återkommer så snart vi kan för att prata vidare om tillställningen.",
  },

  minnesstund: {
    label: "Minnesstund",
    heading: "Vi hjälper er med det praktiska.",
    intro:
      "Berätta gärna det ni vet om datum, antal personer och era önskemål så återkommer vi med ett passande upplägg.",
    submitLabel: "Skicka förfrågan",
    successHeading: "Tack för er förfrågan.",
    successText:
      "Vi har tagit emot era uppgifter och återkommer så snart vi kan för att hjälpa er vidare.",
  },

  kontakt: {
    label: "Kontakt",
    heading: "Hur kan vi hjälpa dig?",
    intro:
      "Skicka några rader så återkommer vi så snart vi kan.",
    submitLabel: "Skicka meddelande",
    successHeading: "Tack för ditt meddelande.",
    successText:
      "Vi har tagit emot det och återkommer så snart vi kan.",
  },
};

function normalizeType(value: string | null): InquiryType {
  if (
    value === "konferens" ||
    value === "catering" ||
    value === "event" ||
    value === "brollop" ||
    value === "privat-fest" ||
    value === "minnesstund" ||
    value === "kontakt"
  ) {
    return value;
  }

  return "kontakt";
}

export default function InquiryPage() {
  const [type, setType] = useState<InquiryType>("kontakt");
  const [eventName, setEventName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setType(normalizeType(params.get("typ")));
    setEventName(params.get("event") || "");
  }, []);

  const config = configs[type];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");

    try {
      const response = await fetch("/api/forfragan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          eventName,
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          date: formData.get("date"),
          guests: formData.get("guests"),
          location: formData.get("location"),
          occasion: formData.get("occasion"),
          message: formData.get("message"),

          // Enkel botfälla. Vanliga besökare ser inte detta fält.
          website: formData.get("website"),
        }),
      });

      if (!response.ok) {
        throw new Error("Kunde inte skicka formuläret.");
      }

      setStatus("success");
      form.reset();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#F8F6F2] text-[#222222]">
        <SiteHeader active="home" />

        <section className="flex min-h-screen items-center px-6 pb-20 pt-32 md:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-[1100px]">
            <div className="rounded-[2rem] bg-[#1E2721] px-7 py-14 text-white sm:px-10 md:px-16 md:py-20">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D1B78E]">
                Restaurang Å
              </p>

              <h1 className="serif mt-6 max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
                {config.successHeading}
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                {config.successText}
              </p>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
                Behöver du komma i kontakt med oss direkt är du alltid
                välkommen att ringa på{" "}
                <a
                  href="tel:+46793240021"
                  className="font-semibold text-white underline underline-offset-4"
                >
                  079-324 00 21
                </a>
                .
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="/"
                  className="rounded-full bg-[#F8F6F2] px-7 py-3.5 text-sm font-semibold !text-[#1E2721] transition hover:-translate-y-0.5"
                >
                  Till startsidan
                </a>

                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white"
                >
                  Skicka en ny förfrågan
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2] text-[#222222]">
      <SiteHeader active="home" />

      <section className="bg-[#1E2721] px-6 pb-16 pt-32 text-white md:px-10 md:pb-20 md:pt-40 lg:px-16">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D1B78E]">
            {config.label}
          </p>

          <h1 className="serif mt-6 max-w-4xl text-[3.6rem] font-medium leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {config.heading}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
            {config.intro}
          </p>

          {eventName && (
            <div className="mt-7 inline-flex rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-white/85">
              Gäller: {eventName}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A57D45]">
              Förfrågan
            </p>

            <h2 className="serif mt-5 max-w-md text-4xl font-medium leading-[0.98] tracking-tight md:text-5xl">
              Några detaljer räcker för att börja.
            </h2>

            <p className="mt-7 max-w-md leading-8 text-[#66635F]">
              Fyll i det du vet. Du behöver inte ha alla detaljer klara
              innan du hör av dig.
            </p>

            <div className="mt-10 border-t border-[#DDD7CE] pt-8">
              <p className="text-sm text-[#77736D]">Vill du hellre ringa?</p>

              <a
                href="tel:+46793240021"
                className="serif mt-2 inline-block text-2xl !text-[#222222] transition hover:opacity-60"
              >
                079-324 00 21
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Honeypot mot enklare spam */}
            <div
              aria-hidden="true"
              className="absolute -left-[10000px] h-px w-px overflow-hidden"
            >
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Namn"
                name="name"
                type="text"
                autoComplete="name"
                required
              />

              <Field
                label="E-post"
                name="email"
                type="email"
                autoComplete="email"
                required
              />

              <Field
                label="Telefon"
                name="phone"
                type="tel"
                autoComplete="tel"
              />

              {type === "konferens" && (
                <Field
                  label="Företag"
                  name="company"
                  type="text"
                  autoComplete="organization"
                />
              )}

              {(type === "konferens" ||
                type === "catering" ||
                type === "event" ||
                type === "brollop" ||
                type === "privat-fest" ||
                type === "minnesstund") && (
                <>
                  <Field label="Önskat datum" name="date" type="date" />

                  <Field
                    label="Ungefärligt antal personer"
                    name="guests"
                    type="number"
                    min="1"
                  />
                </>
              )}

              {type === "catering" && (
                <>
                  <Field
                    label="Plats / område"
                    name="location"
                    type="text"
                    placeholder="Ex. Åkersberga, Täby, Stockholm"
                  />

                  <Field
                    label="Typ av tillställning"
                    name="occasion"
                    type="text"
                    placeholder="Ex. företagslunch, fest, bröllop"
                  />
                </>
              )}

              {type === "event" && !eventName && (
                <Field
                  label="Vilket event gäller det?"
                  name="occasion"
                  type="text"
                />
              )}

              {(type === "brollop" ||
                type === "privat-fest" ||
                type === "minnesstund") && (
                <Field
                  label="Typ av tillställning"
                  name="occasion"
                  type="text"
                  defaultValue={
                    type === "brollop"
                      ? "Bröllop"
                      : type === "minnesstund"
                        ? "Minnesstund"
                        : ""
                  }
                />
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-3 block text-sm font-semibold text-[#35332F]"
              >
                Berätta lite mer
              </label>

              <textarea
                id="message"
                name="message"
                rows={7}
                required
                placeholder="Skriv gärna era önskemål, frågor eller annat som kan vara bra för oss att veta."
                className="w-full resize-y rounded-2xl border border-[#D8D2C8] bg-white px-5 py-4 text-base text-[#222222] outline-none transition placeholder:text-[#AAA49B] focus:border-[#8B714F] focus:ring-2 focus:ring-[#8B714F]/10"
              />
            </div>

            <div className="border-t border-[#DDD7CE] pt-8">
              <p className="mb-6 max-w-xl text-sm leading-6 text-[#77736D]">
                När du skickar formuläret använder vi uppgifterna för att
                kunna svara på din förfrågan.
              </p>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#1E2721] px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#28352C] disabled:cursor-wait disabled:opacity-60"
              >
                {status === "sending"
                  ? "Skickar..."
                  : config.submitLabel}
              </button>

              {status === "error" && (
                <p
                  role="alert"
                  className="mt-5 max-w-xl text-sm leading-6 text-red-700"
                >
                  Något gick fel när förfrågan skulle skickas. Försök igen,
                  eller ring oss på 079-324 00 21.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#172019] px-6 py-12 text-white md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="serif text-2xl">Restaurang Å</p>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Åkersberga Golfklubb
              <br />
              Bränsle gård 1
              <br />
              184 33 Åkersberga
            </p>
          </div>

          <div className="text-sm leading-7 text-white/70">
            <a
              href="tel:+46793240021"
              className="block transition hover:text-white"
            >
              079-324 00 21
            </a>

            <span className="block">boka@restauranga.se</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  min?: string;
  defaultValue?: string;
};

function Field({
  label,
  name,
  type,
  required = false,
  placeholder,
  autoComplete,
  min,
  defaultValue,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-3 block text-sm font-semibold text-[#35332F]"
      >
        {label}
        {required && <span className="ml-1 text-[#9B7650]">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-[#D8D2C8] bg-white px-5 py-4 text-base text-[#222222] outline-none transition placeholder:text-[#AAA49B] focus:border-[#8B714F] focus:ring-2 focus:ring-[#8B714F]/10"
      />
    </div>
  );
}