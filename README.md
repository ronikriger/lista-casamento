# Lista de presentes

A static wedding gift registry in Brazilian Portuguese. Guests pick symbolic gifts, pay the total with PIX, and leave their name and a note. Nothing is shipped. The couple receives the money in their own bank account.

The site is plain HTML, CSS, and JavaScript. Publish the repository root on GitHub Pages. There is no build step.

## 1. Fill in the couple’s details

Edit `assets/js/config.js`. Any value still written in `UPPER_SNAKE_CASE` (or `AAAA-MM-DD`) is treated as “not configured”: a warning banner stays on the page and the PIX step does not generate a QR code.

| Field | What to put |
|---|---|
| `noiva`, `noivo` | First names, as you want them in the title. |
| `dataCasamento` | `YYYY-MM-DD`. Parsed as a local date, so the day does not shift in Brazil. |
| `horario`, `localNome`, `localEndereco`, `localMapaUrl` | Optional. If both time and venue name are empty, the “O grande dia” section is hidden. The map link must be an `http` or `https` URL. |
| `mensagemBoasVindas` | Optional. Empty uses the default welcome paragraph. Separate paragraphs with a blank line. |
| `historia` | Optional. Empty hides “Nossa história”. |
| `fotoCasal` | Optional relative path, for example `assets/img/casal.jpg`. Empty shows a monogram. |
| `pix.chave` | The PIX key guests will pay. Prefer a **random key (chave aleatória)** or an e-mail. A CPF or phone number is visible to anyone with the link. |
| `pix.tipo` | `aleatoria`, `email`, `telefone`, `cpf`, or `cnpj`. Must match the key. |
| `pix.nomeTitular` | Full name of the account that receives the money, exactly as the bank shows it. |
| `pix.cidadeTitular` | City of that account. Accents are fine; the PIX code strips them. |
| `pix.descricao` | Leave empty. A description makes some bank apps reject the code. |
| `appsScriptUrl` | Optional. The `/exec` URL from the Google Apps Script deployment below. Empty keeps the site fully usable; confirmations stay in the guest’s browser. |
| `muralAtivo` | `true` shows the message wall when `appsScriptUrl` is set. |
| `valorLivre.minimo` / `maximo` | Bounds for the “Presente surpresa”, in whole reais. |
| `pagamentoExterior` | Optional note for guests outside Brazil. Empty hides that question. Line breaks are kept. URLs become links. |
| `credito` | Optional footer line, for example `Feito com 💛 pelo Roni`. |
| `siteUrl` | The public GitHub Pages URL, with a trailing slash. |

Then replace the same placeholders in the `<head>` of `index.html`. WhatsApp does not run JavaScript, so these tags must be real text:

- `og:title`
- `og:image` (absolute URL, not a relative path)
- `og:url`

`og:description` can stay as it is. Leave `<meta name="robots" content="noindex">` in place so the page stays out of Google.

## 2. Replace the images

| File | What it is |
|---|---|
| `assets/img/casal.jpg` | Optional photo, about 1600px wide, under 400 KB. Point `fotoCasal` at it. |
| `assets/img/og-image.jpg` | Link-preview image, 1200×630, under 300 KB. The file in the repo is a placeholder. |
| `assets/img/favicon.svg` | Monogram. |
| `assets/img/apple-touch-icon.png` | 180×180 home-screen icon. |

## 3. Google Sheet (optional, recommended)

The sheet is the guest list of confirmations. It is not proof that the PIX arrived; the bank statement is.

1. Create a Google Sheet in the bride’s account, so she owns the data and receives the e-mails.
2. Extensions → Apps Script. Replace the default file with the contents of `apps-script/Code.gs`.
3. Set `EMAIL_AVISO` to her e-mail, or leave it empty to skip mail.
4. Run `configurarPlanilha` once and authorize the script. This creates the `Presentes` tab, headers, currency format, and checkboxes.
5. Deploy → New deployment → type **Web app**. Execute as **Me**. Who has access: **Anyone**. Copy the URL that ends in `/exec` into `appsScriptUrl`.
6. After any later edit to the script, open Deploy → Manage deployments → Edit → Version: **New version**. The URL stays the same only if you publish a new version.

Column J is hidden. It stores the raw items as JSON so the site can show “Já presenteado”. Do not delete it. Column D is a number; with the spreadsheet language set to Português (Brasil) it displays as `R$ #.##0,00`.

The web app accepts at most 60 confirmations every 10 minutes. A honeypot field and a formula-injection guard are included. The site never sends a `Content-Type` header, which is what lets the browser talk to Apps Script without a preflight.

## 4. Publish on GitHub Pages

1. Push this folder to a **public** repository.
2. Settings → Pages → Build and deployment → Deploy from a branch.
3. Branch `main`, folder `/ (root)`.
4. Wait about a minute. The site is at `https://USER.github.io/REPO/`.

`.nojekyll` is already in the root so GitHub Pages serves the files as they are. Paths are relative (`assets/...`) because the site lives under `/REPO/`.

## 5. Test the PIX before sharing the link

1. Open the site on a computer. Add a gift and go to the PIX step.
2. Scan the QR code with a banking app. Check that the receiver name and the amount are right, then **cancel**. You do not need to pay.
3. On a phone, use “Copiar código” and paste it into the bank’s Pix Copia e Cola. The amount should already be filled in. Cancel that too.

On a phone the copy-and-paste code is shown first, because the guest cannot scan the phone they are holding. On a computer the QR code is shown first.

## 6. How to edit the gifts

The catalog is `assets/js/presentes.js`. Names, descriptions, and prices can change at any time. Prices in the file are already in centavos (`280` reais is `28000`).

Do not change an `id` after the link has been shared. Confirmations in the sheet point at those ids. New gifts need a new unique id. `qtd: null` means the gift can be given many times (a “cota”). `qtd: 1` can only be chosen once. `destaque: true` puts it in “Os favoritos dos noivos”.

## 7. Guia rápido para a noiva

Abra a planilha do Google. Cada linha é a confirmação de um convidado: o nome, o que a pessoa escolheu, o valor e o recado.

A planilha é a palavra do convidado, não a prova do pagamento. Confira no aplicativo do banco se o PIX chegou antes de contar o presente como recebido.

- **Ocultar do mural:** marque para esconder um recado no site. O presente continua registrado.
- **Cancelado:** marque para anular uma confirmação repetida ou que não foi paga. O presente volta a aparecer como disponível no site em cerca de um minuto.
- **Mostrar no mural:** vem marcado quando a pessoa aceitou publicar o recado. Só entra no mural quem escreveu uma mensagem.

Se alguém avisar que pagou e o nome não aparecer, peça para a pessoa abrir o site de novo no mesmo celular: o site tenta reenviar a confirmação sozinho.

## 8. Local development

ES modules do not work from `file://`. From this folder:

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080/`.

Tests cover the PIX payload (including the Banco Central example) and the money parser:

```bash
npm test
```

No dependencies are installed. Node 22 does not accept a directory as a `node --test` argument when `package.json` has `"type": "module"`, so the script runs `tests/*.mjs` instead.
