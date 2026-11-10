import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECEIVER_EMAIL = "boka@restauranga.se";

const labels: Record<string, string> = {
  konferens: "KONFERENS",
  catering: "CATERING",
  event: "EVENT",
  brollop: "BRÖLLOP",
  "privat-fest": "PRIVAT FEST",
  minnesstund: "MINNESSTUND",
  kontakt: "KONTAKT",
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function row(label: string, value: unknown) {
  const cleanValue = String(value ?? "").trim();

  if (!cleanValue) {
    return "";
  }

  return `
    <tr>
      <td
        style="
          padding: 10px 16px 10px 0;
          color: #77736d;
          font-size: 14px;
          vertical-align: top;
          white-space: nowrap;
        "
      >
        ${escapeHtml(label)}
      </td>

      <td
        style="
          padding: 10px 0;
          color: #222222;
          font-size: 15px;
          line-height: 1.6;
        "
      >
        ${escapeHtml(cleanValue)}
      </td>
    </tr>
  `;
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY saknas.");

      return NextResponse.json(
        {
          error: "Mailtjänsten är inte konfigurerad.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();

    const {
      type,
      eventName,
      name,
      company,
      email,
      phone,
      date,
      guests,
      location,
      occasion,
      message,
      website,
    } = body;

    /*
     * Honeypot.
     * Fältet är dolt för vanliga besökare.
     * Om en bot fyller i det låtsas vi att allt gick bra,
     * men skickar inget mail.
     */
    if (String(website ?? "").trim()) {
      return NextResponse.json({
        success: true,
      });
    }

    const cleanType = String(type ?? "").trim();
    const cleanName = String(name ?? "").trim();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    const cleanMessage = String(message ?? "").trim();
    const cleanEventName = String(eventName ?? "").trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        {
          error:
            "Namn, e-post och meddelande måste fyllas i.",
        },
        {
          status: 400,
        }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return NextResponse.json(
        {
          error: "Ogiltig e-postadress.",
        },
        {
          status: 400,
        }
      );
    }

    const category =
      labels[cleanType] || "KONTAKT";

    const subjectParts = [`[${category}]`];

    if (cleanEventName) {
      subjectParts.push(cleanEventName);
    }

    if (cleanName) {
      subjectParts.push(cleanName);
    }

    if (date) {
      subjectParts.push(String(date));
    }

    const subject = subjectParts.join(" – ");

    const restaurantEmailHtml = `
      <!doctype html>
      <html lang="sv">
        <body
          style="
            margin: 0;
            padding: 0;
            background: #f4f1eb;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 680px;
              margin: 0 auto;
              padding: 40px 20px;
            "
          >
            <div
              style="
                background: #1e2721;
                border-radius: 24px 24px 0 0;
                padding: 34px 36px;
                color: white;
              "
            >
              <div
                style="
                  color: #d1b78e;
                  font-size: 12px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  margin-bottom: 12px;
                "
              >
                Restaurang Å
              </div>

              <h1
                style="
                  margin: 0;
                  font-family: Georgia, serif;
                  font-size: 32px;
                  font-weight: normal;
                  line-height: 1.15;
                "
              >
                Ny ${escapeHtml(
                  category.toLowerCase()
                )}förfrågan
              </h1>
            </div>

            <div
              style="
                background: white;
                padding: 32px 36px 38px;
                border-radius: 0 0 24px 24px;
              "
            >
              ${
                cleanEventName
                  ? `
                    <div
                      style="
                        margin-bottom: 24px;
                        padding: 16px 18px;
                        background: #f4f1eb;
                        border-radius: 12px;
                      "
                    >
                      <strong>Event:</strong>
                      ${escapeHtml(cleanEventName)}
                    </div>
                  `
                  : ""
              }

              <table
                role="presentation"
                style="
                  width: 100%;
                  border-collapse: collapse;
                "
              >
                ${row("Kategori", category)}
                ${row("Namn", cleanName)}
                ${row("Företag", company)}
                ${row("E-post", cleanEmail)}
                ${row("Telefon", phone)}
                ${row("Datum", date)}
                ${row("Antal personer", guests)}
                ${row("Plats / område", location)}
                ${row("Tillställning", occasion)}
              </table>

              <div
                style="
                  margin-top: 26px;
                  padding-top: 26px;
                  border-top: 1px solid #e4dfd7;
                "
              >
                <div
                  style="
                    margin-bottom: 10px;
                    color: #77736d;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                  "
                >
                  Meddelande
                </div>

                <div
                  style="
                    color: #222222;
                    font-size: 16px;
                    line-height: 1.7;
                    white-space: pre-wrap;
                  "
                >
                  ${escapeHtml(cleanMessage)}
                </div>
              </div>

              <div
                style="
                  margin-top: 30px;
                  padding-top: 22px;
                  border-top: 1px solid #e4dfd7;
                  color: #77736d;
                  font-size: 13px;
                  line-height: 1.6;
                "
              >
                Förfrågan skickades via restauranga.se.
                Svara på detta mail för att svara kunden direkt.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    /*
     * VIKTIGT:
     * Vi börjar med Resends testavsändare.
     *
     * När restauranga.se har verifierats i Resend
     * byter vi denna till exempelvis:
     *
     * Restaurang Å <bokning@restauranga.se>
     */
    const fromAddress =
      "Restaurang Å <onboarding@resend.dev>";

    const { error: restaurantError } =
      await resend.emails.send({
        from: fromAddress,
        to: [RECEIVER_EMAIL],
        replyTo: cleanEmail,
        subject,
        html: restaurantEmailHtml,
      });

    if (restaurantError) {
      console.error(
        "Kunde inte skicka restaurangens mail:",
        restaurantError
      );

      return NextResponse.json(
        {
          error:
            "Förfrågan kunde inte skickas.",
        },
        {
          status: 500,
        }
      );
    }

    const confirmationSubject =
      cleanType === "konferens"
        ? "Vi har tagit emot er konferensförfrågan"
        : cleanType === "catering"
          ? "Vi har tagit emot din cateringförfrågan"
          : cleanType === "event"
            ? "Vi har tagit emot din eventförfrågan"
            : cleanType === "brollop"
              ? "Vi har tagit emot er bröllopsförfrågan"
              : cleanType === "minnesstund"
                ? "Vi har tagit emot er förfrågan"
                : "Vi har tagit emot din förfrågan";

    const confirmationIntro =
      cleanType === "catering"
        ? "Vi har tagit emot dina önskemål och återkommer så snart vi kan för att prata vidare om upplägg, meny och detaljer."
        : cleanType === "konferens"
          ? "Vi har tagit emot er förfrågan och återkommer så snart vi kan för att prata vidare om konferensen, mat, fika och upplägg."
          : cleanType === "event"
            ? "Vi har tagit emot din förfrågan och återkommer så snart vi kan med mer information."
            : cleanType === "brollop"
              ? "Vi har tagit emot er förfrågan och ser fram emot att höra mer om dagen ni planerar."
              : cleanType === "minnesstund"
                ? "Vi har tagit emot er förfrågan och återkommer så snart vi kan för att hjälpa er vidare."
                : "Vi har tagit emot ditt meddelande och återkommer så snart vi kan.";

    const confirmationHtml = `
      <!doctype html>
      <html lang="sv">
        <body
          style="
            margin: 0;
            padding: 0;
            background: #f4f1eb;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              max-width: 620px;
              margin: 0 auto;
              padding: 40px 20px;
            "
          >
            <div
              style="
                background: #1e2721;
                border-radius: 24px;
                padding: 40px 36px;
                color: white;
              "
            >
              <div
                style="
                  margin-bottom: 22px;
                  color: #d1b78e;
                  font-size: 12px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                "
              >
                Restaurang Å
              </div>

              <h1
                style="
                  margin: 0;
                  font-family: Georgia, serif;
                  font-size: 34px;
                  line-height: 1.15;
                  font-weight: normal;
                "
              >
                Tack för din förfrågan.
              </h1>

              <p
                style="
                  margin: 24px 0 0;
                  color: rgba(255,255,255,0.78);
                  font-size: 16px;
                  line-height: 1.8;
                "
              >
                Hej ${escapeHtml(cleanName)},
              </p>

              <p
                style="
                  margin: 14px 0 0;
                  color: rgba(255,255,255,0.78);
                  font-size: 16px;
                  line-height: 1.8;
                "
              >
                ${escapeHtml(confirmationIntro)}
              </p>

              ${
                cleanEventName
                  ? `
                    <div
                      style="
                        margin-top: 26px;
                        padding: 15px 17px;
                        border: 1px solid rgba(255,255,255,0.15);
                        border-radius: 12px;
                        color: rgba(255,255,255,0.88);
                      "
                    >
                      Förfrågan gäller:
                      <strong>${escapeHtml(
                        cleanEventName
                      )}</strong>
                    </div>
                  `
                  : ""
              }

              <p
                style="
                  margin: 26px 0 0;
                  color: rgba(255,255,255,0.65);
                  font-size: 14px;
                  line-height: 1.7;
                "
              >
                Behöver du komma i kontakt med oss direkt är
                du alltid välkommen att ringa
                <strong style="color: white;">
                  079-324 00 21
                </strong>.
              </p>

              <p
                style="
                  margin: 28px 0 0;
                  color: white;
                  font-family: Georgia, serif;
                  font-size: 20px;
                "
              >
                Restaurang Å
              </p>

              <p
                style="
                  margin: 6px 0 0;
                  color: rgba(255,255,255,0.55);
                  font-size: 13px;
                  line-height: 1.6;
                "
              >
                Åkersberga Golfklubb<br />
                Bränsle gård 1<br />
                184 33 Åkersberga
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    /*
     * Kundens bekräftelsemail.
     *
     * Om detta skulle misslyckas har restaurangen redan fått
     * själva förfrågan, så vi behandlar fortfarande formuläret
     * som skickat.
     */
    const { error: customerError } =
      await resend.emails.send({
        from: fromAddress,
        to: [cleanEmail],
        subject: confirmationSubject,
        html: confirmationHtml,
      });

    if (customerError) {
      console.error(
        "Kundens bekräftelsemail kunde inte skickas:",
        customerError
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Fel i /api/forfragan:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ett oväntat fel inträffade.",
      },
      {
        status: 500,
      }
    );
  }
}