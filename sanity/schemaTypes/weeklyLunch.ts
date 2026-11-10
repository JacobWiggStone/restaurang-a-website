import { defineField, defineType } from "sanity";

export const weeklyLunch = defineType({
  name: "weeklyLunch",
  title: "Veckans lunch",
  type: "document",

  groups: [
    {
      name: "week",
      title: "Vecka",
      default: true,
    },
    {
      name: "weekdayMenu",
      title: "Måndag - fredag",
    },
    {
      name: "vegetarian",
      title: "Veckans veg",
    },
    {
      name: "weekend",
      title: "Helglunch",
    },
  ],

  fields: [
    defineField({
      name: "year",
      title: "År",
      type: "number",
      group: "week",
      initialValue: new Date().getFullYear(),
      validation: (Rule) => Rule.required().min(2026).max(2100),
    }),

    defineField({
      name: "weekNumber",
      title: "Vecka",
      type: "number",
      group: "week",
      description: "Veckonummer, till exempel 35.",
      validation: (Rule) => Rule.required().min(1).max(53),
    }),

    defineField({
      name: "monday",
      title: "Måndag",
      type: "object",
      group: "weekdayMenu",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "dish1",
          title: "Rätt 1",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "dish2",
          title: "Rätt 2",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "tuesday",
      title: "Tisdag",
      type: "object",
      group: "weekdayMenu",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "dish1",
          title: "Rätt 1",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "dish2",
          title: "Rätt 2",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "wednesday",
      title: "Onsdag",
      type: "object",
      group: "weekdayMenu",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "dish1",
          title: "Rätt 1",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "dish2",
          title: "Rätt 2",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "thursday",
      title: "Torsdag",
      type: "object",
      group: "weekdayMenu",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "dish1",
          title: "Rätt 1",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "dish2",
          title: "Rätt 2",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "friday",
      title: "Fredag",
      type: "object",
      group: "weekdayMenu",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "dish1",
          title: "Rätt 1",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "dish2",
          title: "Rätt 2",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: "weeklyVegetarian",
      title: "Veckans veg",
      type: "text",
      rows: 3,
      group: "vegetarian",
      description: "Vegetariska alternativet som gäller hela veckan.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "weekendLunch",
      title: "Helglunch",
      type: "object",
      group: "weekend",
      description:
        "Samma helglunch visas både lördag och söndag.",
      fields: [
        defineField({
          name: "dailyDish",
          title: "Dagens rätt",
          type: "text",
          rows: 3,
          description: "Pris hämtas från Lunchinställningar.",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "weekendFish",
          title: "Helgfisk",
          type: "text",
          rows: 3,
          description: "Pris hämtas från Lunchinställningar.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],

  preview: {
    select: {
      year: "year",
      weekNumber: "weekNumber",
    },

    prepare({ year, weekNumber }) {
      return {
        title: `Veckans lunch - vecka ${weekNumber ?? ""}`,
        subtitle: `${year ?? ""} | Restaurang Å`,
      };
    },
  },
});