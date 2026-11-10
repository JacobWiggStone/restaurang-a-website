import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",

  groups: [
    {
      name: "content",
      title: "Event",
      default: true,
    },
    {
      name: "booking",
      title: "Bokning",
    },
    {
      name: "settings",
      title: "Inställningar",
    },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Eventnamn",
      type: "string",
      group: "content",
      description:
        'Exempel: "Vinprovning", "Mors dag" eller "Quizkväll".',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "date",
      title: "Datum",
      type: "date",
      group: "content",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "time",
      title: "Tid",
      type: "string",
      group: "content",
      description:
        'Exempel: "18:00", "Från 17:00" eller "17:00 - 22:00".',
    }),

    defineField({
      name: "shortDescription",
      title: "Kort beskrivning",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Den här texten visas på startsidan under eventet.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },

      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
          description:
            "Kort beskrivning av bilden, till exempel Vinprovning på Restaurang Å.",
        }),
      ],
    }),

    defineField({
      name: "price",
      title: "Pris",
      type: "string",
      group: "content",
      description:
        'Valfritt. Exempel: "495 kr/person" eller "Fri entré".',
    }),

    defineField({
      name: "bookingLabel",
      title: "Text på bokningsknapp",
      type: "string",
      group: "booking",
      initialValue: "Boka plats",
    }),

    defineField({
      name: "bookingLink",
      title: "Bokningslänk",
      type: "string",
      group: "booking",
      description:
        'Kan vara exempelvis "mailto:boka@restauranga.se?subject=Vinprovning", ett telefonnummer eller en https-länk.',
    }),

    defineField({
      name: "visible",
      title: "Visa eventet på hemsidan",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),

    defineField({
      name: "featured",
      title: "Utvalt event",
      type: "boolean",
      group: "settings",
      description:
        "Kan senare användas för att lyfta ett särskilt event extra tydligt.",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "title",
      date: "date",
      media: "image",
      visible: "visible",
    },

    prepare({ title, date, media, visible }) {
      return {
        title: title || "Namnlöst event",
        subtitle: `${date || "Inget datum"}${
          visible === false ? " - Dolt" : ""
        }`,
        media,
      };
    },
  },
});