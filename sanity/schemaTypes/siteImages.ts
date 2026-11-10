import { defineField, defineType } from "sanity";

export const siteImages = defineType({
  name: "siteImages",
  title: "Webbplatsbilder",
  type: "document",

  groups: [
    {
      name: "home",
      title: "Startsida",
      default: true,
    },
    {
      name: "lunch",
      title: "Lunch",
    },
    {
      name: "conference",
      title: "Konferens",
    },
    {
      name: "evening",
      title: "After Golf / Kväll",
    },
    {
      name: "gallery",
      title: "Galleri",
    },
  ],

  fields: [
    defineField({
      name: "heroImage",
      title: "Hero-bild startsida",
      type: "image",
      group: "home",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "atmosphereImage",
      title: "Atmosfärbild",
      type: "image",
      group: "home",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "teamImage",
      title: "Team / Om Å-bild",
      type: "image",
      group: "home",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "cateringImage",
      title: "Cateringbild",
      type: "image",
      group: "home",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "lunchHeroImage",
      title: "Hero-bild lunchsida",
      type: "image",
      group: "lunch",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "conferenceHeroImage",
      title: "Hero-bild konferenssida",
      type: "image",
      group: "conference",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "conferenceRoomImage",
      title: "Konferensrum",
      type: "image",
      group: "conference",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "conferenceDiningImage",
      title: "Konferensmiddag",
      type: "image",
      group: "conference",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "conferenceLoungeImage",
      title: "Konferenslounge",
      type: "image",
      group: "conference",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "eveningHeroImage",
      title: "Hero-bild After Golf / Kväll",
      type: "image",
      group: "evening",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Bildbeskrivning",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "galleryImages",
      title: "Galleri",
      type: "array",
      group: "gallery",
      description:
        "Lägg till, ta bort och sortera bilderna i den ordning ni vill visa dem.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Bildbeskrivning",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Webbplatsbilder",
        subtitle:
          "Hero, lunch, konferens, catering, galleri och övriga bilder",
      };
    },
  },
});