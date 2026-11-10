import { defineField, defineType } from "sanity";

export const lunchSettings = defineType({
  name: "lunchSettings",
  title: "Lunchinställningar",
  type: "document",

  groups: [
    {
      name: "weekday",
      title: "Vardagslunch",
      default: true,
    },
    {
      name: "earlyBird",
      title: "Early Bird",
    },
    {
      name: "weekend",
      title: "Helglunch",
    },
    {
      name: "alaCarte",
      title: "À la carte lunch",
    },
  ],

  fields: [
    defineField({
      name: "weekdayPrice",
      title: "Lunchpris",
      type: "number",
      group: "weekday",
      initialValue: 149,
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: "servingStart",
      title: "Lunch börjar",
      type: "string",
      group: "weekday",
      initialValue: "10:00",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "servingEnd",
      title: "Lunch slutar",
      type: "string",
      group: "weekday",
      initialValue: "14:00",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "included",
      title: "Detta ingår",
      type: "string",
      group: "weekday",
      initialValue: "Soppa, sallad, bröd, smör, kaffe och kaka",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "earlyBirdEnabled",
      title: "Visa Early Bird",
      type: "boolean",
      group: "earlyBird",
      initialValue: true,
    }),

    defineField({
      name: "earlyBirdPrice",
      title: "Early Bird-pris",
      type: "number",
      group: "earlyBird",
      initialValue: 135,
    }),

    defineField({
      name: "earlyBirdStart",
      title: "Early Bird börjar",
      type: "string",
      group: "earlyBird",
      initialValue: "10:00",
    }),

    defineField({
      name: "earlyBirdEnd",
      title: "Early Bird slutar",
      type: "string",
      group: "earlyBird",
      initialValue: "11:00",
    }),

    defineField({
      name: "earlyBirdCode",
      title: "Early Bird-kod",
      type: "string",
      group: "earlyBird",
      initialValue: "Lunch10",
    }),

    defineField({
      name: "weekendDailyPrice",
      title: "Dagens rätt - pris",
      type: "number",
      group: "weekend",
      initialValue: 149,
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: "weekendFishPrice",
      title: "Helgfisk - pris",
      type: "number",
      group: "weekend",
      initialValue: 215,
      validation: (Rule) => Rule.required().positive(),
    }),

    defineField({
      name: "alaCarteItems",
      title: "Fasta à la carte-alternativ",
      type: "array",
      group: "alaCarte",
      description:
        "Dessa ligger kvar på lunchmenyn tills ni själva ändrar dem här.",
      of: [
        {
          type: "object",
          name: "alaCarteLunchItem",
          title: "À la carte-rätt",

          fields: [
            defineField({
              name: "name",
              title: "Namn",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "description",
              title: "Beskrivning",
              type: "text",
              rows: 2,
            }),

            defineField({
              name: "price",
              title: "Pris",
              type: "string",
              description:
                'Skriv exempelvis "169 kr" eller "169 / 199 kr".',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "visible",
              title: "Visa på hemsidan",
              type: "boolean",
              initialValue: true,
            }),
          ],

          preview: {
            select: {
              title: "name",
              subtitle: "price",
            },
          },
        },
      ],

      initialValue: [
        {
          _type: "alaCarteLunchItem",
          _key: "smash",
          name: "Å:s Smash burger",
          price: "169 kr",
          visible: true,
        },
        {
          _type: "alaCarteLunchItem",
          _key: "grilloumi",
          name: "Å:s Cheesy grilloumi burger",
          price: "169 kr",
          visible: true,
        },
        {
          _type: "alaCarteLunchItem",
          _key: "chicken",
          name: "Å:s Crispy Chicken burger",
          price: "169 kr",
          visible: true,
        },
        {
          _type: "alaCarteLunchItem",
          _key: "vegan",
          name: "Å:s Crispy vegan burger",
          price: "169 kr",
          visible: true,
        },
        {
          _type: "alaCarteLunchItem",
          _key: "raggmunk",
          name: "Raggmunk med fläsk",
          price: "169 kr",
          visible: true,
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Lunchinställningar",
        subtitle: "Priser, tider och fasta lunchalternativ",
      };
    },
  },
});