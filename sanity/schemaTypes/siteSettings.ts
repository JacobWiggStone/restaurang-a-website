import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Webbplatsinställningar",
  type: "document",

  groups: [
    {
      name: "contact",
      title: "Kontakt",
      default: true,
    },
    {
      name: "hours",
      title: "Öppettider",
    },
    {
      name: "social",
      title: "Sociala medier",
    },
    {
      name: "header",
      title: "Header & CTA",
    },
  ],

  fields: [
    defineField({
      name: "phoneDisplay",
      title: "Telefonnummer - visas",
      type: "string",
      group: "contact",
      initialValue: "079-324 00 21",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "phoneHref",
      title: "Telefonnummer - länk",
      type: "string",
      group: "contact",
      description:
        'Skriv i formatet "+46793240021".',
      initialValue: "+46793240021",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "email",
      title: "E-post",
      type: "string",
      group: "contact",
      initialValue: "boka@restauranga.se",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "locationName",
      title: "Plats",
      type: "string",
      group: "contact",
      initialValue: "Åkersberga Golfklubb",
    }),

    defineField({
      name: "addressLine1",
      title: "Adressrad 1",
      type: "string",
      group: "contact",
      initialValue: "Bränsle gård 1",
    }),

    defineField({
      name: "addressLine2",
      title: "Adressrad 2",
      type: "string",
      group: "contact",
      initialValue: "184 33 Åkersberga",
    }),

    defineField({
      name: "openingHoursText",
      title: "Öppettider",
      type: "text",
      rows: 4,
      group: "hours",
      description:
        "Skriv exakt den text som ska visas på hemsidan.",
      initialValue:
        "Måndag till Söndag\n08:00 till 20:00",
    }),

    defineField({
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
      group: "social",
    }),

    defineField({
      name: "facebookUrl",
      title: "Facebook",
      type: "url",
      group: "social",
    }),

    defineField({
      name: "mainCtaLabel",
      title: "Huvudknapp - text",
      type: "string",
      group: "header",
      initialValue: "Ring & boka",
    }),

    defineField({
      name: "conferenceCtaLabel",
      title: "Konferensknapp - text",
      type: "string",
      group: "header",
      initialValue: "Skicka förfrågan",
    }),

    defineField({
      name: "conferenceSubject",
      title: "Ämnesrad för konferensmail",
      type: "string",
      group: "header",
      initialValue: "Konferensförfrågan",
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Webbplatsinställningar",
        subtitle:
          "Kontakt, öppettider, sociala medier och knappar",
      };
    },
  },
});