import SiteHeader from "../components/SiteHeader";
import { client } from "../../sanity/lib/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type DayMenu = {
  dish1?: string;
  dish2?: string;
};

type WeekendLunch = {
  dailyDish?: string;
  weekendFish?: string;
};

type WeeklyLunch = {
  year?: number;
  weekNumber?: number;

  monday?: DayMenu;
  tuesday?: DayMenu;
  wednesday?: DayMenu;
  thursday?: DayMenu;
  friday?: DayMenu;

  weeklyVegetarian?: string;

  weekendLunch?: WeekendLunch;
};

type AlaCarteItem = {
  _key?: string;
  name?: string;
  description?: string;
  price?: string;
  visible?: boolean;
};

type LunchSettings = {
  weekdayPrice?: number;

  servingStart?: string;
  servingEnd?: string;
  included?: string;

  earlyBirdEnabled?: boolean;
  earlyBirdPrice?: number;
  earlyBirdStart?: string;
  earlyBirdEnd?: string;
  earlyBirdCode?: string;

  weekendDailyPrice?: number;
  weekendFishPrice?: number;

  alaCarteItems?: AlaCarteItem[];
};

type SiteImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type SiteImages = {
  lunchHeroImage?: SiteImage;
};


type SiteSettings = {
  phoneDisplay?: string;
  phoneHref?: string;
  email?: string;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  openingHoursText?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  mainCtaLabel?: string;
  conferenceCtaLabel?: string;
  conferenceSubject?: string;
};

const WEEKLY_LUNCH_QUERY = `
  *[
    _type == "weeklyLunch" &&
    year == $year &&
    weekNumber == $weekNumber
  ]
  | order(_updatedAt desc)[0] {
    year,
    weekNumber,

    monday {
      dish1,
      dish2
    },

    tuesday {
      dish1,
      dish2
    },

    wednesday {
      dish1,
      dish2
    },

    thursday {
      dish1,
      dish2
    },

    friday {
      dish1,
      dish2
    },

    weeklyVegetarian,

    weekendLunch {
      dailyDish,
      weekendFish
    }
  }
`;

const LUNCH_SETTINGS_QUERY = `
  *[_type == "lunchSettings"]
  | order(_updatedAt desc)[0] {
    weekdayPrice,

    servingStart,
    servingEnd,
    included,

    earlyBirdEnabled,
    earlyBirdPrice,
    earlyBirdStart,
    earlyBirdEnd,
    earlyBirdCode,

    weekendDailyPrice,
    weekendFishPrice,

    alaCarteItems[] {
      _key,
      name,
      description,
      price,
      visible
    }
  }
`;

const SITE_IMAGES_QUERY = `
  *[_type == "siteImages"]
  | order(_updatedAt desc)[0] {
    lunchHeroImage {
      alt,
      asset-> {
        url
      }
    }
  }
`;


const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"]
  | order(_updatedAt desc)[0] {
    phoneDisplay,
    phoneHref,
    email,
    locationName,
    addressLine1,
    addressLine2,
    openingHoursText,
    instagramUrl,
    facebookUrl,
    mainCtaLabel,
    conferenceCtaLabel,
    conferenceSubject
  }
`;



function getStockholmDate() {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const year = Number(
    parts.find((part) => part.type === "year")?.value
  );

  const month = Number(
    parts.find((part) => part.type === "month")?.value
  );

  const day = Number(
    parts.find((part) => part.type === "day")?.value
  );

  return {
    year,
    month,
    day,
  };
}

function getISOWeek(
  year: number,
  month: number,
  day: number
) {
  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  const dayNumber = date.getUTCDay() || 7;

  date.setUTCDate(
    date.getUTCDate() + 4 - dayNumber
  );

  const isoYear = date.getUTCFullYear();

  const yearStart = new Date(
    Date.UTC(isoYear, 0, 1)
  );

  const weekNumber = Math.ceil(
    ((date.getTime() - yearStart.getTime()) /
      86400000 +
      1) /
      7
  );

  return {
    year: isoYear,
    weekNumber,
  };
}

function getDayNumber(
  year: number,
  month: number,
  day: number
) {
  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  const jsDay = date.getUTCDay();

  return jsDay === 0 ? 7 : jsDay;
}

function clean(value?: string) {
  return value?.trim() || "";
}

export const metadata: Metadata = {
  title: {
    absolute: "Lunch i Åkersberga | Veckans meny – Restaurang Å",
  },
  description:
    "Se dagens och veckans lunch i Åkersberga på Restaurang Å vid Åkersberga Golfklubb. Vardagslunch, veckans veg, helglunch och à la carte.",
  alternates: {
    canonical: "/lunch",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/lunch",
    siteName: "Restaurang Å",
    title: "Lunch i Åkersberga | Veckans meny – Restaurang Å",
    description:
      "Dagens lunch, veckans meny och helglunch vid Åkersberga Golfklubb.",
    images: [
      {
        url: "/images/restaurang-a/lunch.jpg",
        width: 1200,
        height: 630,
        alt: "Lunch på Restaurang Å i Åkersberga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunch i Åkersberga | Restaurang Å",
    description:
      "Dagens lunch, veckans meny och helglunch vid Åkersberga Golfklubb.",
    images: ["/images/restaurang-a/lunch.jpg"],
  },
};

export default async function LunchPage() {
  const stockholmDate = getStockholmDate();

  const isoWeek = getISOWeek(
    stockholmDate.year,
    stockholmDate.month,
    stockholmDate.day
  );

  const dayNumber = getDayNumber(
    stockholmDate.year,
    stockholmDate.month,
    stockholmDate.day
  );

  let weeklyLunch: WeeklyLunch | null = null;
  let settings: LunchSettings | null = null;
  let siteImages: SiteImages | null = null;
  let siteSettings: SiteSettings | null = null;

  try {
    const freshClient = client.withConfig({
      useCdn: false,
    });

    [weeklyLunch, settings, siteImages, siteSettings] = await Promise.all([
      freshClient.fetch<WeeklyLunch | null>(
        WEEKLY_LUNCH_QUERY,
        {
          year: isoWeek.year,
          weekNumber: isoWeek.weekNumber,
        },
        {
          cache: "no-store",
        }
      ),

      freshClient.fetch<LunchSettings | null>(
        LUNCH_SETTINGS_QUERY,
        {},
        {
          cache: "no-store",
        }
      ),

      freshClient.fetch<SiteImages | null>(
        SITE_IMAGES_QUERY,
        {},
        {
          cache: "no-store",
        }
      ),

      freshClient.fetch<SiteSettings | null>(
        SITE_SETTINGS_QUERY,
        {},
        {
          cache: "no-store",
        }
      ),
    ]);
  } catch (error) {
    console.error(
      "Kunde inte hämta lunchdata från Sanity:",
      error
    );
  }

  const weekdayPrice =
    settings?.weekdayPrice ?? 149;

  const servingStart =
    settings?.servingStart ?? "10:00";

  const servingEnd =
    settings?.servingEnd ?? "14:00";

  const included =
    settings?.included ??
    "Soppa, sallad, bröd, smör, kaffe och kaka";

  const weekendDailyPrice =
    settings?.weekendDailyPrice ?? 149;

  const weekendFishPrice =
    settings?.weekendFishPrice ?? 215;

  const earlyBirdEnabled =
    settings?.earlyBirdEnabled ?? true;

  const earlyBirdPrice =
    settings?.earlyBirdPrice ?? 135;

  const earlyBirdStart =
    settings?.earlyBirdStart ?? "10:00";

  const earlyBirdEnd =
    settings?.earlyBirdEnd ?? "11:00";

  const earlyBirdCode =
    settings?.earlyBirdCode ?? "Lunch10";

  const phoneDisplay =
    clean(siteSettings?.phoneDisplay) || "079-324 00 21";

  const phoneHref =
    clean(siteSettings?.phoneHref) || "+46793240021";

  const email =
    clean(siteSettings?.email) || "boka@restauranga.se";

  const locationName =
    clean(siteSettings?.locationName) || "Åkersberga Golfklubb";

  const addressLine1 =
    clean(siteSettings?.addressLine1) || "Bränsle gård 1";

  const addressLine2 =
    clean(siteSettings?.addressLine2) || "184 33 Åkersberga";

  const mainCtaLabel =
    clean(siteSettings?.mainCtaLabel) || "Ring & boka";

  const conferenceCtaLabel =
    clean(siteSettings?.conferenceCtaLabel) || "Skicka förfrågan";

  const conferenceSubject =
    clean(siteSettings?.conferenceSubject) || "Konferensförfrågan";

  const cleanPhoneHref = phoneHref.replace(/[^+\d]/g, "");

  const conferenceMailHref = `mailto:${email}?subject=${encodeURIComponent(
    conferenceSubject
  )}`;

  const weekMenu = [
    {
      day: "Måndag",
      menu: weeklyLunch?.monday,
    },
    {
      day: "Tisdag",
      menu: weeklyLunch?.tuesday,
    },
    {
      day: "Onsdag",
      menu: weeklyLunch?.wednesday,
    },
    {
      day: "Torsdag",
      menu: weeklyLunch?.thursday,
    },
    {
      day: "Fredag",
      menu: weeklyLunch?.friday,
    },
  ];

  let currentDayName = "";
  let currentMenu: DayMenu | null = null;

  switch (dayNumber) {
    case 1:
      currentDayName = "Måndag";
      currentMenu = weeklyLunch?.monday ?? null;
      break;

    case 2:
      currentDayName = "Tisdag";
      currentMenu = weeklyLunch?.tuesday ?? null;
      break;

    case 3:
      currentDayName = "Onsdag";
      currentMenu = weeklyLunch?.wednesday ?? null;
      break;

    case 4:
      currentDayName = "Torsdag";
      currentMenu = weeklyLunch?.thursday ?? null;
      break;

    case 5:
      currentDayName = "Fredag";
      currentMenu = weeklyLunch?.friday ?? null;
      break;

    case 6:
      currentDayName = "Lördag";
      break;

    case 7:
      currentDayName = "Söndag";
      break;
  }

  const isWeekend =
    dayNumber === 6 || dayNumber === 7;

  const visibleAlaCarteItems =
    settings?.alaCarteItems?.filter(
      (item) => item.visible !== false
    ) ?? [];

  const hasWeeklyMenu = Boolean(weeklyLunch);

  const lunchHeroImage = {
    src:
      siteImages?.lunchHeroImage?.asset?.url ||
      "/images/restaurang-a/lunch.jpg",
    alt:
      clean(siteImages?.lunchHeroImage?.alt) ||
      "Lunch på Restaurang Å vid Åkersberga Golfklubb",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Restaurang Å",
        item: "https://restauranga.se",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Lunch i Åkersberga",
        item: "https://restauranga.se/lunch",
      },
    ],
  };

  return (
    <main className="bg-[#F8F6F2] text-[#222222]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader
        active="lunch"
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        email={email}
        mainCtaLabel={mainCtaLabel}
        conferenceCtaLabel={conferenceCtaLabel}
        conferenceSubject={conferenceSubject}
      />

      {/* HERO */}
      <section className="relative flex min-h-[68vh] items-end overflow-hidden bg-[#1E2721]">
        <img
          src={lunchHeroImage.src}
          alt={lunchHeroImage.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
            {locationName}
          </p>

          <h1 className="serif mt-6 max-w-4xl text-6xl font-medium leading-[0.9] tracking-tight text-white md:text-8xl lg:text-[7rem]">
            Veckans
            <br />
            lunch.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-white/85 md:text-lg">
            Vällagad lunch hela veckan med smaker som varierar från vecka till
            vecka.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Lunch på Å
            </p>

            <h2 className="serif mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              Hela veckan på ett ställe.
            </h2>
          </div>

          <div className="max-w-2xl text-base leading-8 text-[#66635F] md:text-lg">
            <p>
              Veckomenyn uppdateras löpande så att du alltid kan se vad som
              serveras innan du kommer.
            </p>

            <p className="mt-6">
              I vardagslunchen ingår {included.toLowerCase()}.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-[#D5CEC4] px-5 py-2.5 text-sm font-semibold text-[#263229]">
                Lunch {weekdayPrice} kr
              </div>

              <div className="rounded-full border border-[#D5CEC4] px-5 py-2.5 text-sm font-semibold text-[#263229]">
                Måndag - fredag
              </div>

              <div className="rounded-full border border-[#D5CEC4] px-5 py-2.5 text-sm font-semibold text-[#263229]">
                {servingStart} till {servingEnd}
              </div>

              {earlyBirdEnabled && (
                <div className="rounded-full border border-[#D5CEC4] px-5 py-2.5 text-sm font-semibold text-[#263229]">
                  Early Bird {earlyBirdPrice} kr
                </div>
              )}
            </div>

            {earlyBirdEnabled && (
              <p className="mt-5 text-sm leading-7 text-[#77726C]">
                Early Bird {earlyBirdStart} - {earlyBirdEnd}.
                {earlyBirdCode
                  ? ` Använd kod: ${earlyBirdCode}.`
                  : ""}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* WEEK MENU */}
      <section className="bg-[#EDE8E0] px-6 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 border-b border-[#D2CAC0] pb-10 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5B6B56]">
                Veckans meny
              </p>

              <h2 className="serif mt-4 text-5xl font-medium tracking-tight md:text-6xl">
                Måndag till fredag.
              </h2>

              {weeklyLunch?.weekNumber && (
                <p className="mt-4 text-sm text-[#69655F]">
                  Vecka {weeklyLunch.weekNumber}
                </p>
              )}
            </div>

            <p className="max-w-md text-sm leading-7 text-[#69655F]">
              Menyn uppdateras varje vecka av Restaurang Å.
            </p>
          </div>

          {hasWeeklyMenu ? (
            <>
              {/* MÅNDAG - FREDAG */}
              <div>
                {weekMenu.map((item) => (
                  <article
                    key={item.day}
                    className="grid gap-6 border-b border-[#D2CAC0] py-9 md:grid-cols-[0.4fr_1.6fr] md:py-11"
                  >
                    <h3 className="serif text-3xl font-medium">
                      {item.day}
                    </h3>

                    <div className="flex items-start justify-between gap-8">
                      <div className="space-y-3 text-base leading-7 text-[#55524E] md:text-lg">
                        {clean(item.menu?.dish1) ? (
                          <p>{item.menu?.dish1}</p>
                        ) : (
                          <p className="italic text-[#77726C]">
                            Meny kommer snart.
                          </p>
                        )}

                        {clean(item.menu?.dish2) && (
                          <p>{item.menu?.dish2}</p>
                        )}
                      </div>

                      <p className="serif shrink-0 whitespace-nowrap text-2xl text-[#292723]">
                        {weekdayPrice} kr
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* VECKANS VEG */}
              {clean(weeklyLunch?.weeklyVegetarian) && (
                <div className="grid gap-6 border-b border-[#D2CAC0] py-9 md:grid-cols-[0.4fr_1.6fr] md:py-11">
                  <h3 className="serif text-3xl font-medium">
                    Veckans veg
                  </h3>

                  <div className="flex items-start justify-between gap-8">
                    <p className="text-base leading-7 text-[#55524E] md:text-lg">
                      {weeklyLunch?.weeklyVegetarian}
                    </p>

                    <p className="serif shrink-0 whitespace-nowrap text-2xl text-[#292723]">
                      {weekdayPrice} kr
                    </p>
                  </div>
                </div>
              )}

              {/* HELGLUNCH */}
              <div className="grid gap-6 py-10 md:grid-cols-[0.4fr_1.6fr] md:py-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C7B4F]">
                    Lördag & söndag
                  </p>

                  <h3 className="serif mt-3 text-3xl font-medium">
                    Helglunch
                  </h3>
                </div>

                <div className="space-y-6 text-base text-[#55524E] md:text-lg">
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <p className="font-semibold text-[#292723]">
                        Dagens rätt
                      </p>

                      <p className="serif text-2xl text-[#292723]">
                        {weekendDailyPrice} kr
                      </p>
                    </div>

                    <p className="mt-2 leading-7">
                      {clean(
                        weeklyLunch?.weekendLunch?.dailyDish
                      ) || "Helgens rätt kommer snart."}
                    </p>
                  </div>

                  <div className="border-t border-[#D2CAC0] pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <p className="font-semibold text-[#292723]">
                        Helgfisk
                      </p>

                      <p className="serif text-2xl text-[#292723]">
                        {weekendFishPrice} kr
                      </p>
                    </div>

                    <p className="mt-2 leading-7">
                      {clean(
                        weeklyLunch?.weekendLunch?.weekendFish
                      ) || "Helgens fisk kommer snart."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16">
              <p className="text-lg text-[#69655F]">
                Veckans meny publiceras snart.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* TODAY */}
      <section className="bg-[#263229] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
              {currentDayName}
            </p>

            <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] md:text-6xl">
              {isWeekend
                ? "Dagens helglunch."
                : "Dagens lunch."}
            </h2>

            <p className="mt-7 max-w-lg leading-8 text-white/70">
              {isWeekend
                ? "Helglunchen serveras både lördag och söndag."
                : `Dagens rätter hämtas automatiskt från veckans meny för ${currentDayName.toLowerCase()}.`}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/[0.04] p-8 md:p-10">
            {isWeekend ? (
              <div className="space-y-8">
                <div>
                  <div className="flex items-start justify-between gap-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Dagens rätt
                    </p>

                    <p className="serif text-2xl">
                      {weekendDailyPrice} kr
                    </p>
                  </div>

                  <p className="mt-3 text-lg leading-8">
                    {clean(
                      weeklyLunch?.weekendLunch?.dailyDish
                    ) || "Dagens rätt publiceras snart."}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-8">
                  <div className="flex items-start justify-between gap-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Helgfisk
                    </p>

                    <p className="serif text-2xl">
                      {weekendFishPrice} kr
                    </p>
                  </div>

                  <p className="mt-3 text-lg leading-8">
                    {clean(
                      weeklyLunch?.weekendLunch?.weekendFish
                    ) || "Helgfisken publiceras snart."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <div className="flex items-start justify-between gap-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Rätt 1
                    </p>

                    <p className="serif shrink-0 whitespace-nowrap text-2xl text-white/85">
                      {weekdayPrice} kr
                    </p>
                  </div>

                  <p className="mt-2 text-lg leading-8">
                    {clean(currentMenu?.dish1) ||
                      "Dagens rätt publiceras snart."}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Rätt 2
                  </p>

                  <p className="mt-2 text-lg leading-8">
                    {clean(currentMenu?.dish2) ||
                      "Dagens rätt publiceras snart."}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Veckans veg
                  </p>

                  <p className="mt-2 text-lg leading-8">
                    {clean(
                      weeklyLunch?.weeklyVegetarian
                    ) ||
                      "Veckans vegetariska alternativ publiceras snart."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* À LA CARTE */}
      {visibleAlaCarteItems.length > 0 && (
        <section className="bg-[#F8F6F2] px-6 py-20 md:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                  À la carte lunch
                </p>

                <h2 className="serif mt-5 max-w-md text-5xl font-medium leading-[0.95] md:text-6xl">
                  Något annat till lunch.
                </h2>
              </div>

              <div>
                {visibleAlaCarteItems.map(
                  (item, index) => (
                    <div
                      key={
                        item._key ??
                        `${item.name}-${index}`
                      }
                      className="border-b border-[#D5CEC4] py-6 first:pt-0"
                    >
                      <div className="flex items-start justify-between gap-8">
                        <div>
                          <h3 className="serif text-2xl font-medium">
                            {item.name}
                          </h3>

                          {item.description && (
                            <p className="mt-2 max-w-xl text-sm leading-7 text-[#69655F]">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <p className="whitespace-nowrap text-sm font-semibold text-[#263229]">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <footer className="bg-[#1E2721] px-6 py-16 text-white md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row">
          <div>
            <p className="serif text-2xl">
              Restaurang Å
            </p>

            <p className="mt-3 text-sm leading-6 text-white/60">
              {locationName}
              <br />
              {addressLine1}
              <br />
              {addressLine2}
            </p>
          </div>

          <div className="text-sm leading-7 text-white/70">
            <a
              href={`tel:${cleanPhoneHref}`}
              className="block transition hover:text-white"
            >
              {phoneDisplay}
            </a>

            <a
              href={`mailto:${email}`}
              className="block transition hover:text-white"
            >
              {email}
            </a>

            <a
              href="/"
              className="mt-4 block !text-white transition hover:!text-[#D1B78E]"
            >
              Till startsidan
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}