# T09 human recording scenarios

Status: scenarios prepared; two short human recordings resembling R01/R02 have been received and evaluated. Ingredient-level references are confirmed, with R01 salt recorded as half a tablespoon instead of the scripted half teaspoon. Full source review remains pending; R03/R04 inputs are still missing. See [audio evidence](../../../docs/evidence/t09-natural-audio.md). These materials do not close T09, T03 or a readiness gate. These fictional recipes are extraction test material, not tested cooking advice. Instructions are in English; quoted Polish speech is the evaluation stimulus.

## Recording instructions

Record **four separate files with a real human voice**: three short recipes and one continuous five-minute narration. A laptop microphone is sufficient for this T09 model test. It does not establish native microphone permissions, interruption handling or physical-device persistence in T03. Do not use TTS, loop a short passage, splice takes or pad the long sample with silence.

Speak naturally in Polish, as if explaining a recipe to another person. Use the quoted passages as fact anchors, not a speed-reading exercise. Pauses, hesitations and spontaneous wording are welcome. Keep intentional corrections audible; do not restart the take to remove them. Avoid adding unplanned quantities, temperatures or durations. If you do change a fact, record the final spoken value in the review sheet instead of assuming the written scenario is ground truth.

Use the recorder's normal M4A/AAC, WebM/Opus or WAV output; no particular codec is required from the speaker. Preserve the original file. Record in an ordinary room; optionally use normal background kitchen noise for one short recording, but avoid other people's speech unless they also consent. No actual cooking, private family details or names are needed.

Save private files in ignored `tests/assets/t09-recordings/`, using the proposed names below. Record the speaker's permission for local evaluation and Cloudflare Workers AI processing before submission. Do not put credentials or personal details in the manifest. Expected facts below must be checked against the actual recording by a human; the script is not automatically an approved reference.

| File stem | Target duration | Main checks |
| --- | --- | --- |
| `r01-fractions-and-quantity-correction` | 45-90 seconds | Mixed fraction, half unit, later quantity correction, unknown frying time and temperature |
| `r02-temperature-and-time-correction` | 60-100 seconds | Quarter packet, corrected sugar, corrected oven temperature and baking time, ingredient/step consistency |
| `r03-unknowns-and-incomplete-method` | 45-90 seconds | Three-quarter cup, one-and-a-half teaspoons, unknown fruit amount, absent chilling time, incomplete method |
| `r04-five-minute-delayed-corrections` | 4:55-5:00; do not exceed 300 seconds | Continuous narration, delayed corrections across chunks, duplicates, unknown rest time and optional ingredient quantity |

The long sample must contain approximately five minutes of genuine narration, not merely a five-minute container. Aim to finish the content by about 4:58 and stop before 5:00. The recorded duration and decoded audio will be measured; timing headings below are pacing guides, not evidence of actual correction timestamps. If the take is too short or exceeds the limit, retain it as an additional sample and record a new full take. Do not stretch or loop it to satisfy duration.

## R01: fractions and quantity correction

Tell this in your own conversational rhythm, retaining the facts and audible correction:

> Opowiem o naleśnikach. Do miski wsypuję dwie i pół szklanki mąki. Dodaję dwa jajka, trzysta mililitrów mleka i pół łyżeczki soli. Mieszam ciasto, żeby nie było grudek. Na patelnię daję trochę oleju, ale nie odmierzam go i nie podaję jego ilości. Chwileczkę, pomyliłem ilość mleka. Ma być dwieście pięćdziesiąt mililitrów, nie trzysta. To poprawka do całego przepisu, także do mieszania ciasta. Porcje smażę z obu stron. Nie mam zapisanego czasu smażenia ani temperatury patelni. Nie dopowiadam tych wartości. Tyle pamiętam z tego sposobu przygotowania.

Human reference to check after recording: flour **2.5 cups**, eggs **2**, milk **250 ml**, salt **0.5 teaspoon**, oil amount **unknown**. Mix and fry both sides. Temperature and duration **null**. No invented serving count. Neither ingredients nor steps may retain 300 ml as the active amount.

## R02: temperature and time correction

> Teraz opiszę proste ciasto do piekarnika. Potrzebuję dwieście gramów mąki, sto gramów cukru, jedno jajko i ćwierć paczki masła. Nie podaję, ile gramów waży paczka. Masło mieszam z cukrem, dodaję jajko, a potem mąkę. Przekładam masę do formy. Początkowo powiedziałbym: piecz w stu osiemdziesięciu stopniach przez dwadzieścia minut. Sprawdzam jednak swoją notatkę i poprawiam trzy rzeczy. Cukru ma być osiemdziesiąt gramów zamiast stu. Temperatura pieczenia to sto siedemdziesiąt stopni Celsjusza zamiast stu osiemdziesięciu. Czas pieczenia wynosi dwadzieścia pięć minut zamiast dwudziestu. Te poprawki obowiązują także w opisie przygotowania. Nie znam wymiarów formy ani liczby porcji. Nie dodaję żadnych innych składników.

Human reference: flour **200 g**, sugar **80 g**, egg **1**, butter **0.25 packet** with unknown packet weight; oven **170°C**, bake **25 minutes**. Mix butter/sugar, add egg/flour, transfer to form, bake. Do not convert the packet to grams. Do not retain 100 g, 180°C or 20 minutes in active cooking steps. Missing pan size/servings stay unknown.

## R03: unknowns and incomplete method

> Trzeci przepis to deser na zimno. Biorę trzy serki waniliowe, trzy czwarte szklanki jogurtu naturalnego i półtorej łyżeczki żelatyny. Do żelatyny przygotowuję ćwierć szklanki wody. Dodaję owoce, ale nie określam ani ich ilości, ani rodzaju. W mojej notatce jest tylko: przygotować żelatynę, wymieszać z serkami i jogurtem, dodać owoce, przełożyć do naczynia i wstawić do lodówki. Nie mam opisu, jak dokładnie przygotować żelatynę. Nie podaję temperatury wody ani czasu chłodzenia deseru. Nie chcę ich zgadywać. Nie ma tu pieczenia, cukru ani dodatkowej galaretki. Na tym kończy się moja notatka.

Human reference: vanilla cheese **3**, yogurt **0.75 cup**, gelatin **1.5 teaspoons**, water **0.25 cup**, fruit type/amount **unknown**. Prepare gelatin by an **unspecified method**, mix, add fruit, transfer, refrigerate. No invented heating/soaking/chilling duration or temperature. Explicitly absent sugar/jelly are not ingredients. Flag the incomplete gelatin method.

## R04: continuous five-minute narration

Make one continuous recording. The following approximately 550-word Polish narration is a rehearsal guide. Adjust pace naturally and use the timer; do not skip the final corrections. If paraphrasing, preserve the facts in the reference table. Do not read section headings or timestamps aloud. Use ordinary short pauses between thoughts, without deliberate silent padding.

### About 0:00-1:00: initial list and context

> Opowiem cały przepis na drożdżowe bułeczki z jabłkami. Chcę opisać go tak, jak tłumaczyłbym komuś przy kuchennym stole, a nie tylko wyliczyć składniki. Najpierw zbieram wszystko w jednym miejscu, żeby później nie przerywać mieszania. Do ciasta mam zapisane czterysta pięćdziesiąt gramów mąki, trzysta mililitrów mleka, pięćdziesiąt gramów masła, siedem gramów suchych drożdży, dwa jajka, jedną łyżkę cukru i pół łyżeczki soli. Do środka przygotowuję trzy jabłka oraz cynamon. Ilości cynamonu nie zapisuję, bo w tej notatce jej nie ma. Na razie podaję dokładnie to, co pamiętam z pierwszej wersji listy. Podczas opowiadania sprawdzę jeszcze swoją notatkę i jeśli zauważę pomyłkę, poprawię ją wyraźnie. Proszę traktować późniejsze poprawki jako obowiązujące w całym przepisie.

### About 1:00-2:00: first correction and mixing

> Wybieram miskę, w której będzie mi wygodnie mieszać. Nie podaję jej średnicy ani pojemności, bo nie są częścią przepisu. Łączę mąkę, suche drożdże, cukier i sól. Do tych składników dodaję mleko, jajka oraz miękkie masło. Tutaj zatrzymam się przy jajkach, bo już widzę pierwszą pomyłkę. Powiedziałem dwa jajka, ale powinno być jedno jajko. To jedno jajko trafia do ciasta; nie ma drugiego jajka do smarowania wierzchu ani do innej czynności. Mieszam składniki, a następnie wyrabiam ciasto, aż będzie gładkie. Nie mam zapisanego czasu wyrabiania, więc nie będę podawał liczby minut. Nie podaję też liczbowej temperatury mleka. Zależy mi na zachowaniu tego, co jest zapisane, bez uzupełniania przepisu z pamięci.

### About 2:00-3:00: second correction, rest and filling

> Jeszcze jedna poprawka dotyczy mleka. Wcześniej podałem trzysta mililitrów, a prawidłowa ilość wynosi dwieście pięćdziesiąt mililitrów. Zastępuję poprzednią ilość tą nową, nie dolewam dodatkowego mleka. Wyrobione ciasto przykrywam i zostawiam do podwojenia objętości. Nie wiem, ile minut to zajmie, i nie ustalam stałego czasu wyrastania. W tym czasie zajmuję się nadzieniem. Obieram trzy jabłka i kroję je w niewielką kostkę. Dodaję cynamon oraz jedną łyżeczkę soku z cytryny. Mieszam nadzienie. Nie dodaję tu cukru ani masła. Jeżeli ktoś pyta o wagę jabłek, nie mam takiej informacji. W przepisie liczę jabłka na sztuki. Sok z cytryny należy do nadzienia, a nie do ciasta. Te składniki pozostają oddzielną częścią przygotowania.

### About 3:00-4:00: shaping and provisional oven settings

> Gdy ciasto podwoi objętość, przekładam je na blat. Rozwałkowuję, nakładam nadzienie i zwijam. Nie mam zapisanej grubości rozwałkowanego ciasta ani wymiarów prostokąta, więc zostawiam te wielkości bez liczb. Kroję zwinięte ciasto na kawałki i układam je na blasze wyłożonej papierem. Nie podaję liczby bułeczek, bo zależy od tego krojenia i nie została ustalona w notatce. Wierzchu niczym nie smaruję. Nie ma też osobnego, zapisanego czasu drugiego wyrastania. W pierwszej wersji opisu piekarnik miał być ustawiony na sto dziewięćdziesiąt stopni Celsjusza, a pieczenie miało trwać dwadzieścia pięć minut. Za chwilę jeszcze sprawdzę te ustawienia. Teraz mówię o kolejności czynności, nie o dodatkowych składnikach. Papier na blasze nie jest składnikiem nadzienia ani ciasta.

### About 4:00-5:00: delayed corrections and final instruction

> Wracam do początku listy, bo znalazłem właściwy zapis ilości mąki. Ma być pięćset gramów, a nie czterysta pięćdziesiąt. Ta poprawka dotyczy całego ciasta. Nie chodzi o dosypanie dodatkowych pięciuset gramów do wcześniejszej ilości. Sprawdziłem też piekarnik: ostatecznie piekę w stu osiemdziesięciu stopniach Celsjusza przez trzydzieści minut. Zastępuję więc wcześniejsze sto dziewięćdziesiąt stopni i dwadzieścia pięć minut. Zostają jedno jajko i dwieście pięćdziesiąt mililitrów mleka, tak jak poprawiłem wcześniej. Po pieczeniu wyjmuję bułeczki i pozostawiam do wystudzenia. Nie podaję czasu studzenia. Nie robię lukru ani polewy. Ilość cynamonu, czas wyrabiania oraz czas wyrastania nadal są nieznane. To koniec przepisu i wszystkie moje poprawki. Ostateczny opis powinien zawierać już tylko poprawione wartości, zarówno na liście składników, jak i w czynnościach.

### R04 reference checklist

| Fact | Final intended value | Earlier value that must not remain active |
| --- | --- | --- |
| Flour | 500 g | 450 g; do not add both amounts |
| Milk | 250 ml | 300 ml; do not treat as an extra addition |
| Eggs | 1 | 2; no extra egg for brushing |
| Butter | 50 g | None |
| Dry yeast | 7 g | None |
| Dough sugar | 1 tablespoon | No sugar in the filling |
| Salt | 0.5 teaspoon | None |
| Apples | 3 pieces | Weight unknown |
| Cinnamon | Unknown quantity | No inferred teaspoon quantity |
| Lemon juice | 1 teaspoon, filling | Not part of dough |
| Oven | 180°C | 190°C |
| Baking | 30 minutes | 25 minutes |
| Kneading, rising, cooling | No numeric durations | No guessed 10/60/120-minute intervals |
| Rest endpoint | Double in volume | Not a fixed number of minutes |

Preserve mixing/kneading, covered rest until doubled, apple preparation, rolling/filling/rolling up/cutting, baking and cooling. Do not invent glaze, egg wash, extra proofing duration, portions or dough dimensions. Repeated corrected facts near the end are confirmations, not additional ingredients. Actual timing must be annotated from the completed recording to determine whether corrections cross the ASR chunk boundaries; the script does not prove this in advance.

## Hand-off and human reference review

For each file, record: filename, speaker consent to Cloudflare processing, language, recorder/device, original container/codec if known, room/noise conditions, measured duration, deviations from this scenario, and the human-checked final facts. Keep these records local with the private audio. A manifest may set `synthetic: false` for human-recorded speech while separately declaring `scripted: true`; never describe scripted speech as spontaneous narration.

Before evaluating, listen once and confirm the actual corrections, unknowns and final amounts. Annotate approximate correction timestamps for R04. Keep the script/reference separate from model input: inference receives the audio bytes, never this answer key. Record usability/correction time during review of the actual model draft, not from the script.

These four human recordings would address the missing-audio input gap only after consent, decoding, reference confirmation and actual evaluation. They would be a controlled human-speech corpus, not proof across accents, speakers or spontaneous kitchen dictation, and they would not satisfy the fifty-example release gate. Physical-device evidence in T03 remains independently outstanding.
