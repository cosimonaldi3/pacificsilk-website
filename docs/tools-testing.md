# Tools: manual test checklist

Covers `/tools/shipping-estimate` and `/tools/tariff-finder`. Run these in the browser after any change to the data layer or the database.
Expected values are from the 2025 data; if the data is reloaded, prices may change, but the behaviour must not.

## Setup
1. `npm test`: all tests pass.
2. `npm run dev`, then open http://localhost:3000/tools/tariff-finder.
3. Open the browser dev tools on the **Network** tab. Keep it open for the whole run:
   no request may return 404 or 400 (a 404 on a table or `rpc/...` means the code still uses an old object).
4. There is no country selector: tariffs are always for imports into the EU **from China**.

## 1. Search
Type each query (don't press Enter; results appear about 0.3 s after you stop typing).

| Query | Expected heading among the first results |
|---|---|
| `laptop` | **8471** Automatic data-processing machines (1st) |
| `laptops` | **8471** (1st): the plural must work |
| `drone` | **8806** Unmanned aircraft (1st) |
| `garlic` | **0703** Onions, shallots, garlic… (1st), shown as `0703`, not `703` |
| `3d printer` | **8485** Machines for additive manufacturing (1st), 8443 printing machinery next |

Also check:
- [ ] Each result shows the code, the description and "Also called: …" terms.
- [ ] `zzqqxx` → "Nothing matches “zzqqxx”…" (not an error, not an empty page).
- [ ] One letter (`d`) → back to the example chips, no request sent.
- [ ] Type `d`, `dr`, `drone` quickly: the final list is the one for **drone**.
- [ ] With the network offline (dev tools → Offline), a search shows "The search did not answer." with a reason.

## 2. Drill-down and breadcrumb
1. Search `garlic`, pick **0703**.
   - [ ] Code strip shows `0703` with one box filled. Breadcrumb: `07 › 0703`.
   - [ ] "Narrow it down" lists `0703 10`, `0703 20`, `0703 90`.
2. Pick **0703 20**.
   - [ ] Breadcrumb `07 › 0703 › 0703 20`; level label `HS6 0703 20`.
   - [ ] The only option is `0703 20 00`, tagged **final code**.
3. Pick **0703 20 00**.
   - [ ] Level `CN8`, all filled boxes turn red (final), no option list, a **Copy the code** button.
   - [ ] Copy → the clipboard contains `07032000`.
4. In the breadcrumb, click **07**.
   - [ ] You're on chapter 07: options `0701` … `0714`, price for chapter 07.
5. Pick **0703** again: you're back on the heading, breadcrumb `07 › 0703`.
6. **Back to the results** returns to the garlic list without searching again.
- [ ] While moving between levels, no box ever shows data for the previous code (e.g. "price for hs4 0703 20").

## 3. Prices and estimate
- [ ] **Per kg:** 0703 → `€ 1.73 / kg`, "2025 average · price for hs4 0703".
- [ ] **Per unit:** search `horses`, pick **0101** → `€ 130.00 / unit`, quantity in **units**.
  Enter `20` → estimated value **€2,600**, "20 units × € 130.00 / unit".
- [ ] **Fallback to a parent:** search `cattle`, pick **0102** → `€ 901.37 / kg`,
  "price from chapter 01, no data for this level".
- [ ] **Fallback while drilling:** 0101 → **0101 21** → "price from hs4 0101, no data for this level".
- [ ] **Quantity kept:** on 0703 enter `500` (→ €864), go down to 0703 20 and 0703 20 00: the 500 kg stay.
- [ ] Duties row reads **coming soon**; no duty amount is ever added.
- [ ] **kg entry for unit prices:** only appears when the price has kg per unit (cn8 codes with
  supplementary units). There, switch to **kg**: the note shows "X kg ÷ Y kg per unit = Z units".
- [ ] A code with no price at any level shows **Price not available for this code.** and no estimate (never €0).

## 4. Tariffs
- [ ] **Non-leaf (with descendants):** on **0703** the panel lists "Non preferential tariff quota 9.600 %",
  "China · Only for 0703 20", and the note "…and every code below it. Narrow down…".
- [ ] **Leaf:** on **0703 20 00** the same measure reads "Set at 0703 20, applies to everything below",
  and the note reads "Measures on this code and on the codes above it".
- [ ] The rate is printed exactly as stored (e.g. `Cond: B cert: Y-155 (01):50.000 % ; …` on 0101); nothing is converted.
- [ ] Erga omnes measures are labelled "All origins (erga omnes)" (see 0101 or 0102).
- [ ] The same measure never appears twice in a row (the import has duplicates; the panel shows one).
- [ ] **Many rows:** search `smartphone`, pick **8517**, click **85** in the breadcrumb: only the first 25 measures
  show, with a **Show all 999 measures** button (the database API caps a response at 1000 rows, so this list is probably cut). Chapter 07 has no button.
- [ ] **No data:** 8471 → "No measure is recorded for this code or the codes below it."
- [ ] **Origin:** the panel heading always reads "EU tariff for imports from China"; rows are labelled "China" or "All origins (erga omnes)", never another country.

## 5. Codes with a leading zero
Use **0703** (and 0101 / 0102) for every check above, and confirm:
- [ ] Results, breadcrumb, code strip, level label, price line and tariff lines all show `0703…`, never `703…`.
- [ ] Network tab: requests carry `"p_code":"0703"` / `code=in.("07","0703")` with the zero.
- [ ] Copy on a leaf copies the leading zero (`07032000`).

## 6. Shipping estimate page
- [ ] Type `drone` → the customs select lists `HS 8806 · Unmanned aircraft` first.
- [ ] Pick an EU destination (the origin is always Shanghai) and trace the route: the Tariffs line shows the database average and range, e.g. "Average tariff 3.02% · range 0–7.5%".
- [ ] Drone, Italy, 500 units comes to **€578,997** (2025 data).
- [ ] **Romania** routes through Constanța and does not crash the page.

## 7. Services section and pop-ups
- [ ] There is no Services tab: the sub-navigation has only Shipping estimate and Tariff finder.
- [ ] Before tracing a route, there is no closing band and no hint in the results.
- [ ] After the route animation, each hint opens its service: both Cost of goods links open Sourcing, the route card links open Manufacturing and Logistics, the breakdown link opens Logistics.
- [ ] The four cards (Sourcing, Manufacturing, Market Entry, Logistics) in the closing band each open the matching service.
- [ ] Previous/next goes through all four; service 1 has no previous link and service 4 no next link.
- [ ] Esc, ✕ and a click on the backdrop all close the pop-up, and focus returns to the link that opened it.
- [ ] The page behind does not scroll while the pop-up is open.
- [ ] **Contact us** goes to `/start` and keeps the locale.
- [ ] On the Tariff Finder, the link under the tariff panel opens Logistics.
- [ ] At a 375px width: the pop-up is a sheet at the bottom, the cards stack, no sideways scrolling. At 768px the top nav is the hamburger menu.

## After moving the old tables to the `legacy` schema
If that move ever happens, run the whole list again. Any 404 in the Network tab, or a box saying "could not be loaded" / "did not answer",
means some code still reads an old table: search the repo for its name and fix it before dropping the schema.
