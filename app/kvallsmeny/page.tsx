import SiteHeader from "../components/SiteHeader";
import { client } from "../../sanity/lib/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type MenuItem = {
  _key?: string;
  name?: string;
  description?: string;
  price?: string;
  visible?: boolean;
};

type MenuSection = {
  _key?: string;
  title?: string;
  items?: MenuItem[];
};

type AfterGolfMenu = {
  servingText?: string;
  foodSections?: MenuSection[];
  drinkSections?: MenuSection[];
};

type SiteImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

type SiteImages = {
  eveningHeroImage?: SiteImage;
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

const AFTER_GOLF_QUERY = `
  *[_type == "afterGolfMenu"]
  | order(_updatedAt desc)[0] {
    servingText,

    foodSections[] {
      _key,
      title,
      items[] {
        _key,
        name,
        description,
        price,
        visible
      }
    },

    drinkSections[] {
      _key,
      title,
      items[] {
        _key,
        name,
        description,
        price,
        visible
      }
    }
  }
`;

const SITE_IMAGES_QUERY = `
  *[_type == "siteImages"]
  | order(_updatedAt desc)[0] {
    eveningHeroImage {
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



function clean(value?: string) {
  return value?.trim() || "";
}

function getVisibleItems(items?: MenuItem[]) {
  return (items ?? []).filter(
    (item) =>
      item.visible !== false &&
      clean(item.name) &&
      clean(item.price)
  );
}

function getVisibleSections(sections?: MenuSection[]) {
  return (sections ?? [])
    .map((section) => ({
      ...section,
      items: getVisibleItems(section.items),
    }))
    .filter(
      (section) =>
        clean(section.title) &&
        (section.items?.length ?? 0) > 0
    );
}

export const metadata: Metadata = {
  title: {
    absolute: "Middag & kvällsmeny i Åkersberga | Restaurang Å",
  },
  description:
    "Se kvällsmeny och After Golf på Restaurang Å i Åkersberga. Snacks, sallader, hamburgare, andra rätter och dryck efter lunchen vid Åkersberga Golfklubb.",
  alternates: {
    canonical: "/kvallsmeny",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/kvallsmeny",
    siteName: "Restaurang Å",
    title: "Middag & kvällsmeny i Åkersberga | Restaurang Å",
    description:
      "After Golf, mat och dryck efter lunchen vid Åkersberga Golfklubb.",
    images: [
      {
        url: "/images/restaurang-a/catering.jpg",
        width: 1200,
        height: 630,
        alt: "Kvällsmeny och After Golf på Restaurang Å i Åkersberga",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Middag & kvällsmeny i Åkersberga | Restaurang Å",
    description:
      "After Golf, mat och dryck efter lunchen vid Åkersberga Golfklubb.",
    images: ["/images/restaurang-a/catering.jpg"],
  },
};

export default async function EveningMenuPage() {
  let menu: AfterGolfMenu | null = null;
  let siteImages: SiteImages | null = null;
  let siteSettings: SiteSettings | null = null;

  try {
    const freshClient = client.withConfig({
      useCdn: false,
    });

    [menu, siteImages, siteSettings] = await Promise.all([
      freshClient.fetch<AfterGolfMenu | null>(
        AFTER_GOLF_QUERY,
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
      "Kunde inte hämta After Golf-menyn från Sanity:",
      error
    );
  }

  const servingText =
    clean(menu?.servingText) ||
    "Serveras från eftermiddagen";

  const foodSections = getVisibleSections(
    menu?.foodSections
  );

  const drinkSections = getVisibleSections(
    menu?.drinkSections
  );

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

  const eveningHeroImage = {
    src:
      siteImages?.eveningHeroImage?.asset?.url ||
      "/images/restaurang-a/catering.jpg",
    alt:
      clean(siteImages?.eveningHeroImage?.alt) ||
      "Mat på Restaurang Å",
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
        name: "Middag & kvällsmeny i Åkersberga",
        item: "https://restauranga.se/kvallsmeny",
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
        active="evening"
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
          src={eveningHeroImage.src}
          alt={eveningHeroImage.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/58 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 md:px-10 md:pb-20 lg:px-16 lg:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
            Restaurang Å
          </p>

          <h1 className="serif mt-6 max-w-4xl text-6xl font-medium leading-[0.9] tracking-tight text-white md:text-8xl lg:text-[7rem]">
            After Golf
            <br />
            på Å.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-white/85 md:text-lg">
            När lunchen är över fortsätter dagen med mat,
            något gott i glaset och utsikten över golfbanan.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
              Kvällsmeny
            </p>

            <h2 className="serif mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              Från eftermiddagen och vidare.
            </h2>
          </div>

          <div className="max-w-2xl text-base leading-8 text-[#66635F] md:text-lg">
            <p>
              After Golf-menyn serveras efter lunchen och
              kombinerar enklare rätter, snacks, sallader
              och hamburgare med restaurangens dryckesmeny.
            </p>

            <p className="mt-6">
              Menyer och priser uppdateras direkt av
              restaurangen.
            </p>
          </div>
        </div>
      </section>

      {/* AFTER GOLF MENU */}
      <section className="bg-[#263229] px-6 py-20 text-white md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-10 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D1B78E]">
                Mat
              </p>

              <h2 className="serif mt-4 text-5xl font-medium md:text-6xl">
                After Golf.
              </h2>
            </div>

            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              {servingText}
            </p>
          </div>

          {foodSections.length > 0 ? (
            <div className="mt-12 grid gap-x-16 gap-y-14 md:grid-cols-2">
              {foodSections.map((group, groupIndex) => (
                <div
                  key={
                    group._key ??
                    `${group.title}-${groupIndex}`
                  }
                >
                  <h3 className="serif border-b border-white/15 pb-4 text-3xl">
                    {group.title}
                  </h3>

                  <div className="mt-4">
                    {group.items?.map(
                      (item, itemIndex) => (
                        <div
                          key={
                            item._key ??
                            `${item.name}-${itemIndex}`
                          }
                          className="border-b border-white/10 py-4"
                        >
                          <div className="flex justify-between gap-6">
                            <span className="text-white/85">
                              {item.name}
                            </span>

                            <span className="whitespace-nowrap text-white/60">
                              {item.price}
                            </span>
                          </div>

                          {clean(item.description) && (
                            <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                              {item.description}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16">
              <p className="text-white/65">
                After Golf-menyn publiceras snart.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* DRINK MENU */}
      <section className="bg-[#EDE8E0] px-6 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                I glaset
              </p>

              <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] md:text-6xl">
                Dryckesmeny.
              </h2>
            </div>

            {drinkSections.length > 0 ? (
              <div className="grid gap-12 md:grid-cols-2">
                {drinkSections.map(
                  (group, groupIndex) => (
                    <div
                      key={
                        group._key ??
                        `${group.title}-${groupIndex}`
                      }
                    >
                      <h3 className="serif border-b border-[#CFC7BC] pb-4 text-3xl">
                        {group.title}
                      </h3>

                      <div className="mt-3">
                        {group.items?.map(
                          (item, itemIndex) => (
                            <div
                              key={
                                item._key ??
                                `${item.name}-${itemIndex}`
                              }
                              className="border-b border-[#D5CEC4] py-4"
                            >
                              <div className="flex justify-between gap-6">
                                <span>
                                  {item.name}
                                </span>

                                <span className="whitespace-nowrap text-[#6B6761]">
                                  {item.price}
                                </span>
                              </div>

                              {clean(
                                item.description
                              ) && (
                                <p className="mt-2 text-sm leading-6 text-[#77726C]">
                                  {
                                    item.description
                                  }
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div>
                <p className="text-[#69655F]">
                  Dryckesmenyn publiceras snart.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8F6F2] px-6 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px] rounded-[2rem] bg-[#EEE9E1] px-8 py-14 md:px-14 md:py-16">
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9C7B4F]">
                Boka bord
              </p>

              <h2 className="serif mt-5 text-5xl font-medium leading-[0.95] md:text-6xl">
                Stanna kvar lite längre.
              </h2>
            </div>

            <div>
              <p className="leading-8 text-[#66635F]">
                Ring oss om du vill boka bord eller har
                frågor om dagens meny.
              </p>

              <a
                href={`tel:${cleanPhoneHref}`}
                className="mt-7 inline-flex rounded-full bg-[#263229] px-7 py-3.5 text-sm font-semibold !text-white transition hover:-translate-y-0.5 hover:bg-[#344338]"
              >
                Ring {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
              href={`mailto:${email}`}
              className="block hover:text-white"
            >
              {email}
            </a>

            <a
              href={`tel:${cleanPhoneHref}`}
              className="block hover:text-white"
            >
              {phoneDisplay}
            </a>

            <a
              href="/"
              className="mt-4 block !text-white hover:!text-[#D1B78E]"
            >
              Till startsidan
            </a>
          </div>
        </div>
        </footer>
    </main>
  );
}