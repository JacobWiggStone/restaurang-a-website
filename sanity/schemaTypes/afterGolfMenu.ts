import { defineField, defineType } from "sanity";

const menuItem = {
  type: "object",
  name: "menuItem",
  title: "Menyrätt",

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
        'Skriv exempelvis "169 kr", "115 / 185 kr" eller "från 95 kr".',
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
};

const menuSection = {
  type: "object",
  name: "menuSection",
  title: "Menysektion",

  fields: [
    defineField({
      name: "title",
      title: "Rubrik",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "items",
      title: "Rätter / drycker",
      type: "array",
      of: [menuItem],
    }),
  ],

  preview: {
    select: {
      title: "title",
      items: "items",
    },

    prepare({
      title,
      items,
    }: {
      title?: string;
      items?: unknown[];
    }) {
      return {
        title: title || "Menysektion",
        subtitle: `${items?.length ?? 0} poster`,
      };
    },
  },
};

export const afterGolfMenu = defineType({
  name: "afterGolfMenu",
  title: "After Golf / Kvällsmeny",
  type: "document",

  groups: [
    {
      name: "food",
      title: "After Golf",
      default: true,
    },
    {
      name: "drinks",
      title: "Dryckesmeny",
    },
    {
      name: "settings",
      title: "Inställningar",
    },
  ],

  fields: [
    defineField({
      name: "servingText",
      title: "Serveringstext",
      type: "string",
      group: "settings",
      initialValue: "Serveras från eftermiddagen",
    }),

    defineField({
      name: "foodSections",
      title: "After Golf",
      type: "array",
      group: "food",
      of: [menuSection],

      initialValue: [
        {
          _type: "menuSection",
          _key: "snacks",
          title: "Snacks",
          items: [
            {
              _type: "menuItem",
              _key: "pommes",
              name: "Pommes med dipp",
              price: "65 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "jalapeno",
              name: "Jalapeño poppers",
              price: "65 kr",
              visible: true,
            },
          ],
        },

        {
          _type: "menuSection",
          _key: "forratter",
          title: "Förrätter",
          items: [
            {
              _type: "menuItem",
              _key: "skagen",
              name: "Skagen toast",
              price: "115 / 185 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "rakor",
              name: "Friterade vannemeiräkor",
              price: "135 kr",
              visible: true,
            },
          ],
        },

        {
          _type: "menuSection",
          _key: "sallader",
          title: "Sallader",
          items: [
            {
              _type: "menuItem",
              _key: "caesar",
              name: "Caesarsallad",
              price: "185 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "raksallad",
              name: "Räksallad",
              price: "220 kr",
              visible: true,
            },
          ],
        },

        {
          _type: "menuSection",
          _key: "hamburgare",
          title: "Hamburgare",
          items: [
            {
              _type: "menuItem",
              _key: "smash",
              name: "Å:s Smash burger",
              price: "169 / 199 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "grilloumi",
              name: "Å:s Grilloumi burger",
              price: "169 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "chicken",
              name: "Å:s Crispy chicken burger",
              price: "169 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "vegan",
              name: "Å:s Crispy vegan burger",
              price: "169 kr",
              visible: true,
            },
          ],
        },
      ],
    }),

    defineField({
      name: "drinkSections",
      title: "Dryckesmeny",
      type: "array",
      group: "drinks",
      of: [menuSection],

      initialValue: [
        {
          _type: "menuSection",
          _key: "vin",
          title: "Vin",
          items: [
            {
              _type: "menuItem",
              _key: "white",
              name: "Husets vita",
              price: "från 95 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "rose",
              name: "Husets rosé",
              price: "från 95 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "red",
              name: "Husets röda",
              price: "från 95 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "sparkling",
              name: "Mousserande",
              price: "från 90 kr",
              visible: true,
            },
          ],
        },

        {
          _type: "menuSection",
          _key: "beer",
          title: "Öl och cider",
          items: [
            {
              _type: "menuItem",
              _key: "mariestads",
              name: "Mariestads",
              price: "69 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "wisby",
              name: "Wisby Pils",
              price: "72 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "briska",
              name: "Briska",
              price: "69 kr",
              visible: true,
            },
          ],
        },

        {
          _type: "menuSection",
          _key: "alcoholfree",
          title: "Alkoholfritt",
          items: [
            {
              _type: "menuItem",
              _key: "soda",
              name: "Läsk",
              price: "35 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "beerfree",
              name: "Alkoholfri öl",
              price: "från 45 kr",
              visible: true,
            },
            {
              _type: "menuItem",
              _key: "winefree",
              name: "Alkoholfritt vin",
              price: "från 69 kr",
              visible: true,
            },
          ],
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "After Golf / Kvällsmeny",
        subtitle: "Mat och dryck",
      };
    },
  },
});