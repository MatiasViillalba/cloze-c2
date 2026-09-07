/**
 * Drill bank 01 — single-gap reps.
 *
 * Drills are the scheduler's fine-grained instrument: one sentence, one gap,
 * one skill. A word missed inside a full passage comes back here within
 * minutes, and again days later, in a completely different sentence.
 */
CPE.content.registerDrills([

/* ---- The Holy Grail ----------------------------------------------------- */
{ id: 'd001', a: 'UP', k: 'up-conjure-up-image', p: 'Phrasal verb (conjure up)', src: 'The Holy Grail', s: 'The very phrase conjures {1} an image of knights, quests and improbable oaths.', tip: 'conjure UP = evocar, hacer aparecer en la imaginación.' },
{ id: 'd002', a: 'MAYBE', alt: ['PERHAPS'], k: 'maybe-adverb-possibility', p: 'Adverbio de posibilidad', src: 'The Holy Grail', s: '{1} the cup never existed at all; the search for it has certainly outlived any evidence that it did.', tip: 'MAYBE / PERHAPS abre la oración expresando conjetura.' },
{ id: 'd003', a: 'ITS', k: 'its-possessive-inanimate', p: 'Posesivo de objeto inanimado', src: 'The Holy Grail', s: 'Every version of the legend supplies the relic with {1} eternal guardian.', tip: 'ITS = su (de una cosa). No confundir con «it’s».' },
{ id: 'd004', a: 'WHOSE', k: 'whose-possessive-relative', p: 'Relativo posesivo', src: 'The Holy Grail', s: 'Chrétien de Troyes introduced a knight {1} reputed goal was never actually stated.', tip: 'WHOSE = cuyo. Une posesión y relativo en una sola palabra.' },
{ id: 'd005', a: 'LEAST', k: 'least-at-least-fixed-phrase', p: 'Frase fija (at least)', src: 'The Holy Grail', s: 'At {1} four medieval churches have claimed to hold the genuine article.', tip: 'at LEAST = al menos, como mínimo.' },
{ id: 'd006', a: 'ACCORDING', k: 'according-according-to-prepositional', p: 'Frase preposicional', src: 'The Holy Grail', s: '{1} to one tradition, the cup was carried to Britain within a generation of the crucifixion.', tip: 'ACCORDING to = según.' },
{ id: 'd007', a: 'BOTH', k: 'both-quantifier-of-whom', p: 'Cuantificador + relativo', src: 'The Holy Grail', s: 'The quest was completed by Galahad and Percival, {1} of whom were held to be without sin.', tip: 'BOTH of whom = ambos de los cuales.' },
{ id: 'd008', a: 'FOR', k: 'for-contend-for', p: 'Verbo + preposición', src: 'The Holy Grail', s: 'A dozen rival relics still contend {1} the title of the one true Grail.', tip: 'contend FOR something = disputarse algo.' },

/* ---- Spoilt for choice --------------------------------------------------- */
{ id: 'd009', a: 'ARE', k: 'are-be-faced-with-passive', p: 'Pasiva / colocación', src: 'Spoilt for choice', s: 'Shoppers {1} faced with eleven varieties of what is essentially the same product.', tip: 'be faced WITH = enfrentarse a. Sujeto plural en presente.' },
{ id: 'd010', a: 'EACH', k: 'each-determiner-distributive-model', p: 'Determinante distributivo', src: 'Spoilt for choice', s: 'The catalogue lists forty models, {1} one categorised by price, weight and battery life.', tip: 'EACH one = cada uno. Distribuye uno por uno.' },
{ id: 'd011', a: 'OF', k: 'of-in-awe-of', p: 'Sustantivo + preposición', src: 'Spoilt for choice', s: 'Standing in the aisle, I was frankly in awe {1} the sheer quantity of it.', tip: 'in awe OF something = maravillado o abrumado ante algo.' },
{ id: 'd012', a: 'WERE', k: 'were-eyes-were-glazed-passive', p: 'Pasiva / participio adjetival', src: 'Spoilt for choice', s: 'By the third shelf my eyes {1} glazed and my resolve had gone.', tip: 'my eyes WERE glazed = tenía la mirada vidriosa. Pasado simple en pasiva.' },
{ id: 'd013', a: 'TO', k: 'to-response-to-noun-prep', p: 'Sustantivo + preposición', src: 'Spoilt for choice', s: 'The manufacturer’s response {1} complaints of this kind is to add yet another model.', tip: 'a response TO something = una respuesta a algo.' },
{ id: 'd014', a: 'ON', k: 'on-research-on-noun-prep', p: 'Sustantivo + preposición', src: 'Spoilt for choice', s: 'Research {1} consumer paralysis has been conducted in supermarkets since the 1990s.', tip: 'research ON / INTO something = investigación sobre algo.' },
{ id: 'd015', a: 'WAY', k: 'way-make-ones-way-to', p: 'Modismo', src: 'Spoilt for choice', s: 'I made my {1} to the door with nothing in my basket at all.', tip: 'make your WAY to somewhere = dirigirse a un sitio.' },
{ id: 'd016', a: 'WITHOUT', k: 'without-slightest-hesitation', p: 'Frase preposicional', src: 'Spoilt for choice', s: 'My grandmother would have chosen one {1} the slightest hesitation.', tip: 'WITHOUT the slightest hesitation = sin la menor vacilación.' },

/* ---- Dreams -------------------------------------------------------------- */
{ id: 'd017', a: 'OF', k: 'of-reminiscence-of', p: 'Sustantivo + preposición', src: 'Dreams', s: 'The image struck him as a reminiscence {1} something he had seen as a child.', tip: 'a reminiscence OF = un recuerdo o eco de.' },
{ id: 'd018', a: 'TOOK', k: 'took-take-it-for-granted', p: 'Modismo (take for granted)', src: 'Dreams', s: 'The ancients {1} it for granted that dreams were messages rather than noise.', tip: 'take something for granted = darlo por sentado. Pasado: TOOK.' },
{ id: 'd019', a: 'WHOM', k: 'whom-preposition-plus-whom', p: 'Preposición + relativo', src: 'Dreams', s: 'They addressed their prayers to beings in {1} they genuinely believed.', tip: 'in WHOM they believed = en los que creían. Tras preposición, «whom» y no «who».' },
{ id: 'd020', a: 'SERVE', k: 'serve-serve-a-purpose', p: 'Colocación', src: 'Dreams', s: 'Most researchers now agree that dreams {1} some special purpose, even if nobody can say what.', tip: 'SERVE a purpose = cumplir una función.' },
{ id: 'd021', a: 'ON', k: 'on-make-an-impression-on', p: 'Colocación con preposición', src: 'Dreams', s: 'A vivid dream can produce an impression {1} the sleeper that lasts for days.', tip: 'an impression ON somebody = una impresión en alguien.' },
{ id: 'd022', a: 'THEM', k: 'them-pronoun-reference-object', p: 'Pronombre de referencia', src: 'Dreams', s: 'Our conception of {1} has changed less in two thousand years than we like to think.', tip: 'THEM retoma «dreams» sin repetir el sustantivo.' },
{ id: 'd023', a: 'TO', k: 'to-attribute-something-to', p: 'Verbo + preposición', src: 'Dreams', s: 'Freud attributed {1} the dream a function that his successors have spent a century disputing.', tip: 'attribute something TO something = atribuir algo a algo.' },
{ id: 'd024', a: 'THE', k: 'the-definite-article-exact-number', p: 'Artículo definido con número exacto', src: 'Dreams', s: 'In {1} two works of his maturity, the argument is stated in almost identical terms.', tip: 'In THE two works = en las dos obras (número exacto y conocido).' },

/* ---- Art ----------------------------------------------------------------- */
{ id: 'd025', a: 'COLLECTOR', k: 'collector-art-collector-compound', p: 'Sustantivo compuesto', src: 'Art', s: 'He is described in the catalogue as an art {1} of some seriousness.', tip: 'an art COLLECTOR = un coleccionista de arte.' },
{ id: 'd026', a: 'PIECE', k: 'piece-piece-of-art-partitive', p: 'Partitivo', src: 'Art', s: 'Not one {1} of art in the collection was bought at auction.', tip: 'a PIECE of art / of furniture / of advice: partitivo obligatorio con incontables.' },
{ id: 'd027', a: 'AROUND', alt: ['ABOUT'], k: 'around-carry-around-phrasal', p: 'Phrasal verb', src: 'Art', s: 'The sketchbook is small enough to carry {1} in a coat pocket.', tip: 'carry AROUND = llevar encima de un sitio a otro.' },
{ id: 'd028', a: 'WELL', k: 'well-well-known-for', p: 'Colocación adjetival', src: 'Art', s: 'The gallery is {1} known for refusing to lend anything at all.', tip: 'WELL known for = célebre por.' },
{ id: 'd029', a: 'AGREE', k: 'agree-agree-to-infinitive', p: 'Verbo + infinitivo', src: 'Art', s: 'Very few private owners {1} to be named in the exhibition notes.', tip: 'AGREE to do something = acceder a hacer algo.' },
{ id: 'd030', a: 'SPREADS', k: 'spreads-spread-across', p: 'Verbo + preposición', src: 'Art', s: 'The mural {1} across three walls and part of the ceiling.', tip: 'SPREAD across = extenderse por.' },
{ id: 'd031', a: 'WHICH', k: 'which-preposition-from-which', p: 'Preposición + relativo', src: 'Art', s: 'The window from {1} the whole valley is visible was added in 1890.', tip: 'from WHICH = desde la cual.' },
{ id: 'd032', a: 'HAND', k: 'hand-right-hand-side-compound', p: 'Compuesto fijo', src: 'Art', s: 'The signature is just visible on the right-{1} side of the canvas.', tip: 'the right-HAND side = el lado derecho.' },

/* ---- Scotland's mountain ridges ------------------------------------------ */
{ id: 'd033', a: 'ABOVE', k: 'above-punch-above-your-weight', p: 'Modismo', src: "Scotland's mountain ridges", s: 'For their modest height, these hills punch well {1} their weight.', tip: 'punch ABOVE your weight = rendir por encima de lo esperado.' },
{ id: 'd034', a: 'FOR', k: 'for-make-up-for', p: 'Phrasal verb (make up for)', src: "Scotland's mountain ridges", s: 'What the range lacks in altitude it makes up {1} in sheer awkwardness.', tip: 'make up FOR something = compensar algo.' },
{ id: 'd035', a: 'THOSE', k: 'those-those-who-relative', p: 'Demostrativo + relativo', src: "Scotland's mountain ridges", s: '{1} who have walked the ridge in November rarely recommend it.', tip: 'THOSE who = quienes, los que.' },
{ id: 'd036', a: 'ANYWHERE', k: 'anywhere-pretty-much-anywhere', p: 'Colocación adverbial', src: "Scotland's mountain ridges", s: 'You can pitch a tent pretty much {1} above the tree line.', tip: 'pretty much ANYWHERE = prácticamente en cualquier sitio.' },
{ id: 'd037', a: 'TAKE', k: 'take-give-or-take-idiom', p: 'Modismo', src: "Scotland's mountain ridges", s: 'The traverse is eleven hours, give or {1} an hour for the weather.', tip: 'give or TAKE = más o menos, arriba o abajo.' },
{ id: 'd038', a: 'WHAT', k: 'what-nominal-relative-subject', p: 'Relativo nominal', src: "Scotland's mountain ridges", s: '{1} we have here is the oldest exposed rock in the country.', tip: 'WHAT we have here = lo que tenemos aquí.' },
{ id: 'd039', a: 'OWN', k: 'own-hold-their-own-idiom', p: 'Modismo', src: "Scotland's mountain ridges", s: 'Against the Alps these summits hold their {1} rather better than the guidebooks admit.', tip: 'hold your OWN = defenderse, mantener el tipo.' },
{ id: 'd040', a: 'INTO', k: 'into-packed-into-preposition', p: 'Participio + preposición', src: "Scotland's mountain ridges", s: 'Four distinct climatic zones are packed {1} a walk of nine miles.', tip: 'packed INTO = concentrado dentro de.' },

/* ---- Suitably dressed ---------------------------------------------------- */
{ id: 'd041', a: 'DOES', k: 'does-emphatic-auxiliary', p: 'Auxiliar enfático', src: 'Suitably dressed', s: 'It {1} now appear that the office suit is finished as a daily uniform.', tip: 'It DOES appear that… = ciertamente parece que… «Do/does» refuerza el verbo.' },
{ id: 'd042', a: 'TIME', k: 'time-at-one-time-fixed-phrase', p: 'Locución adverbial', src: 'Suitably dressed', s: 'At one {1}, no bank would have admitted a customer without a tie.', tip: 'At one TIME = en otra época, antaño.' },
{ id: 'd043', a: 'BETWEEN', k: 'between-tell-the-difference-between', p: 'Colocación', src: 'Suitably dressed', s: 'Nobody under thirty can now tell the difference {1} a work shirt and a weekend one.', tip: 'tell the difference BETWEEN A and B.' },
{ id: 'd044', a: 'OUR', k: 'our-possessive-determiner-ideas', p: 'Determinante posesivo', src: 'Suitably dressed', s: 'There has been a sea change in {1} ideas about what looks professional.', tip: 'OUR ideas = nuestras ideas.' },
{ id: 'd045', a: 'COME', k: 'come-come-as-no-surprise-to', p: 'Modismo', src: 'Suitably dressed', s: 'It would {1} as no surprise to anybody who has worked from home since 2020.', tip: 'COME as no surprise to somebody = no sorprender a nadie.' },
{ id: 'd046', a: 'OURSELVES', k: 'ourselves-find-oneself-gerund', p: 'Reflexivo + gerundio', src: 'Suitably dressed', s: 'We find {1} dressing down for occasions our parents would have dressed up for.', tip: 'find OURSELVES doing something = encontrarnos haciendo algo.' },
{ id: 'd047', a: 'BEING', k: 'being-that-being-said-connector', p: 'Conector fijo', src: 'Suitably dressed', s: 'That {1} said, certain professions remain immovable on the subject.', tip: 'That BEING said = dicho esto.' },
{ id: 'd048', a: 'DO', k: 'do-something-will-do-idiom', p: 'Uso idiomático de «do»', src: 'Suitably dressed', s: 'For a funeral, only certain clothes will {1}.', tip: 'something will DO = algo sirve, es adecuado.' },

/* ---- Hollywood ----------------------------------------------------------- */
{ id: 'd049', a: 'GAVE', k: 'gave-ditransitive-give-sth-sth', p: 'Verbo ditransitivo', src: 'Hollywood (California)', s: 'A single dusty suburb {1} the movies their birthplace and the language a byword.', tip: 'GIVE somebody something: estructura de doble objeto en pasado.' },
{ id: 'd050', a: 'AS', k: 'as-serve-as-synonym', p: 'Colocación (serve as)', src: 'Hollywood (California)', s: 'For eighty years the name served {1} a synonym for the industry itself.', tip: 'serve AS = servir de, hacer las veces de.' },
{ id: 'd051', a: 'ONE', k: 'one-at-one-time-fixed-phrase', p: 'Locución adverbial', src: 'Hollywood (California)', s: 'At {1} time there were more studios there than anywhere else on earth.', tip: 'At ONE time = en otro tiempo.' },
{ id: 'd052', a: 'THEMSELVES', k: 'themselves-climb-over-themselves', p: 'Reflexivo en modismo', src: 'Hollywood (California)', s: 'Producers climbed over {1} to buy land nobody had wanted a decade earlier.', tip: 'climb over THEMSELVES to do something = atropellarse por hacer algo.' },
{ id: 'd053', a: 'DURING', k: 'during-preposition-time-period', p: 'Preposición de tiempo', src: 'Hollywood (California)', s: '{1} its gold heyday the town produced eight hundred pictures a year.', tip: 'DURING + periodo. Nunca con oración.' },
{ id: 'd054', a: 'FOR', k: 'for-cater-for-somebody', p: 'Verbo + preposición', src: 'Hollywood (California)', s: 'An entire service economy grew up to cater {1} them.', tip: 'cater FOR somebody = atender las necesidades de alguien (BrE).' },
{ id: 'd055', a: 'WHO', k: 'who-defining-relative-person', p: 'Relativo de persona', src: 'Hollywood (California)', s: 'The average person {1} came west in 1915 had never seen a camera.', tip: 'Antecedente humano + verbo: WHO.' },
{ id: 'd056', a: 'INTO', k: 'into-grow-into-something', p: 'Phrasal verb', src: 'Hollywood (California)', s: 'Within fifteen years the settlement had grown {1} a small town with its own police force.', tip: 'grow INTO something = convertirse en algo al crecer.' },

/* ---- Plastic ------------------------------------------------------------- */
{ id: 'd057', a: 'KEEP', k: 'keep-keep-on-gerund', p: 'Phrasal verb + gerundio', src: 'Plastic', s: 'We {1} on creating a material that outlasts every use we can think of for it.', tip: 'KEEP on doing something = seguir haciendo algo.' },
{ id: 'd058', a: 'HEAVY', k: 'heavy-do-the-heavy-lifting', p: 'Modismo', src: 'Plastic', s: 'Recycling is expected to do the {1} lifting, and it cannot.', tip: 'do the HEAVY lifting = hacer el trabajo pesado.' },
{ id: 'd059', a: 'MORE', k: 'more-comparative-more-than', p: 'Comparativa', src: 'Plastic', s: 'By 2050 there will be {1} plastic in the sea, by weight, than fish.', tip: 'MORE X than Y: comparativa con incontables.' },
{ id: 'd060', a: 'EVER', k: 'ever-noun-ever-past-participle', p: 'Chunk adverbial', src: 'Plastic', s: 'Almost every piece of plastic {1} produced is still somewhere on the planet.', tip: '[sustantivo] EVER produced = jamás producido, de todos los tiempos.' },
{ id: 'd061', a: 'STILL', k: 'still-adverb-continuation-exists', p: 'Adverbio de continuidad', src: 'Plastic', s: 'Unless it has been incinerated, it {1} exists in some form.', tip: 'STILL exists = sigue existiendo.' },
{ id: 'd062', a: 'NEVER', k: 'never-adverb-frequency-zero', p: 'Adverbio de frecuencia', src: 'Plastic', s: 'The aim is a circular economy in which plastics {1} become waste at all.', tip: 'NEVER become waste = nunca se convierten en residuo.' },
{ id: 'd063', a: 'WHICH', k: 'which-quantifier-some-of-which', p: 'Cuantificador + relativo', src: 'Plastic', s: 'Nine alternative materials are under trial, some of {1} have already reached the shelves.', tip: 'some of WHICH = algunos de los cuales.' },
{ id: 'd064', a: 'GRIP', k: 'grip-get-a-grip-idiom', p: 'Modismo', src: 'Plastic', s: 'Unless we get a {1} on production itself, the rest is decoration.', tip: 'get a GRIP on something = controlar algo, tomar las riendas.' },

/* ---- Reinforcement: high-value C2 structures ----------------------------- */
{ id: 'd065', a: 'WHAT', k: 'what-nominal-relative-subject', p: 'Relativo nominal', src: 'Refuerzo', s: '{1} began as a hobby has turned into the most profitable part of the business.', tip: 'WHAT = «the thing that». Sujeto sin antecedente.' },
{ id: 'd066', a: 'GROUND', k: 'ground-gain-ground-idiom', p: 'Modismo', src: 'Refuerzo', s: 'The proposal has gained {1} steadily among younger members of the committee.', tip: 'gain GROUND = ganar terreno.' },
{ id: 'd067', a: 'OFF', k: 'off-take-off-succeed', p: 'Phrasal verb', src: 'Refuerzo', s: 'The scheme never really took {1}, despite two years of expensive publicity.', tip: 'take OFF = despegar, triunfar.' },
{ id: 'd068', a: 'EXPENSE', k: 'expense-at-the-expense-of', p: 'Frase fija', src: 'Refuerzo', s: 'Speed was achieved at the {1} of accuracy, as it usually is.', tip: 'at the EXPENSE of = a costa de.' },
{ id: 'd069', a: 'FAR', k: 'far-as-far-back-as', p: 'Frase temporal fija', src: 'Refuerzo', s: 'Complaints about the noise go back as {1} as the 1890s.', tip: 'as FAR back as = ya desde.' },
{ id: 'd070', a: 'BAY', k: 'bay-keep-at-bay-idiom', p: 'Modismo', src: 'Refuerzo', s: 'Two centuries of sea walls have kept the Atlantic at {1}, but only just.', tip: 'keep at BAY = mantener a raya.' },
{ id: 'd071', a: 'AGROUND', k: 'aground-run-aground-idiom', p: 'Colocación', src: 'Refuerzo', s: 'The freighter ran {1} within sight of the harbour entrance.', tip: 'run AGROUND = encallar.' },
{ id: 'd072', a: 'MEANS', k: 'means-by-no-means-idiom', p: 'Frase fija', src: 'Refuerzo', s: 'The result was by no {1} certain until the final count.', tip: 'by no MEANS = en absoluto.' },
{ id: 'd073', a: 'SUCH', k: 'such-emphatic-determiner-such-a-place', p: 'Determinante enfático', src: 'Refuerzo', s: 'In {1} a climate, nothing survives outdoors for more than a season.', tip: 'in SUCH a climate = en un clima así.' },
{ id: 'd074', a: 'TAKING', k: 'taking-participle-clause-result', p: 'Participio de resultado', src: 'Refuerzo', s: 'The firm relocated to Tallinn, thus {1} advantage of a far simpler tax regime.', tip: 'thus TAKING advantage of… = aprovechando así…' },
{ id: 'd075', a: 'ORDER', k: 'order-in-order-to-purpose', p: 'Frase de propósito', src: 'Refuerzo', s: 'In {1} to qualify, applicants must have lived in the region for five years.', tip: 'in ORDER to = con el fin de.' },
{ id: 'd076', a: 'DATE', k: 'date-to-date-so-far', p: 'Frase fija', src: 'Refuerzo', s: 'To {1}, not one of the sixty applications has been approved.', tip: 'To DATE = hasta la fecha.' },
{ id: 'd077', a: 'SOMETHING', k: 'something-be-something-of-a', p: 'Chunk', src: 'Refuerzo', s: 'Her father was {1} of an expert on medieval glass.', tip: 'be SOMETHING of an expert = ser una especie de experto.' },
{ id: 'd078', a: 'APART', k: 'apart-set-something-apart', p: 'Phrasal verb', src: 'Refuerzo', s: 'What sets this recording {1} from the others is the silence between the movements.', tip: 'set APART from = distinguir de.' },
{ id: 'd079', a: 'WAY', k: 'way-work-ones-way-up', p: 'Modismo', src: 'Refuerzo', s: 'He worked his {1} up from the post room to the board in eleven years.', tip: "work one's WAY up = ascender poco a poco." },
{ id: 'd080', a: 'HAVING', k: 'having-perfect-participle-clause', p: 'Participio perfecto', src: 'Refuerzo', s: '{1} spent a decade abroad, she found the return harder than the departure.', tip: 'HAVING spent = tras haber pasado. Acción anterior a la principal.' },
{ id: 'd081', a: 'BROUGHT', k: 'brought-bring-about-cause', p: 'Phrasal verb', src: 'Refuerzo', s: 'The reforms {1} about a change nobody in the ministry had predicted.', tip: 'bring ABOUT = provocar.' },
{ id: 'd082', a: 'ODD', k: 'odd-the-odd-one-out', p: 'Modismo', src: 'Refuerzo', s: 'Among four economists and a poet, he was plainly the {1} one out.', tip: 'the ODD one out = el que desentona.' },
{ id: 'd083', a: 'BETWEEN', k: 'between-few-and-far-between', p: 'Modismo', src: 'Refuerzo', s: 'Trains after ten in the evening are few and far {1}.', tip: 'few and far BETWEEN = escasísimos.' },
{ id: 'd084', a: 'SHOWN', alt: ['PROVED', 'PROVEN', 'FOUND'], k: 'shown-have-been-shown-to-be', p: 'Pasiva perfecta', src: 'Refuerzo', s: 'These measures have been {1} to be effective in three separate trials.', tip: 'have been SHOWN to be = se ha demostrado que son.' },
{ id: 'd085', a: 'ENOUGH', k: 'enough-quantifier-plural-noun', p: 'Cuantificador', src: 'Refuerzo', s: 'There were not {1} inspectors to cover a single county properly.', tip: 'not ENOUGH inspectors = no había suficientes inspectores.' },
{ id: 'd086', a: 'AHEAD', k: 'ahead-well-ahead-of', p: 'Colocación', src: 'Refuerzo', s: 'Book well {1} of the summer if you want a berth at all.', tip: 'well AHEAD of = con mucha antelación respecto a.' },
{ id: 'd087', a: 'PLENTY', k: 'plenty-allow-plenty-of-time', p: 'Cuantificador', src: 'Refuerzo', s: 'Allow {1} of time for the crossing; the ferry is rarely punctual.', tip: 'PLENTY of time = tiempo de sobra.' },
{ id: 'd088', a: 'THUS', alt: ['THEREBY'], k: 'thus-adverb-result-participle', p: 'Adverbio de consecuencia', src: 'Refuerzo', s: 'The bridge was closed for repairs, {1} cutting the village off for a fortnight.', tip: 'THUS cutting… = dejando así aislado…' },
{ id: 'd089', a: 'FROM', k: 'from-prevent-someone-from-gerund', p: 'Verbo + preposición + gerundio', src: 'Refuerzo', s: 'Nothing in the contract prevents them {1} selling the land tomorrow.', tip: 'prevent somebody FROM doing = impedirle hacer.' },
{ id: 'd090', a: 'CLEAR', k: 'clear-steer-clear-of', p: 'Modismo', src: 'Refuerzo', s: 'Sensible walkers steer {1} of the north face after October.', tip: 'steer CLEAR of = evitar.' },
{ id: 'd091', a: 'THAN', k: 'than-other-than-that', p: 'Frase fija', src: 'Refuerzo', s: 'Other {1} that, the flat is perfectly habitable.', tip: 'Other THAN that = aparte de eso.' },
{ id: 'd092', a: 'FIRST', k: 'first-in-the-first-place-idiom', p: 'Frase fija', src: 'Refuerzo', s: 'Nobody could explain why the money had been borrowed in the {1} place.', tip: 'in the FIRST place = de entrada, para empezar.' },
{ id: 'd093', a: 'CAME', k: 'came-come-to-an-abrupt-end', p: 'Colocación', src: 'Refuerzo', s: 'The partnership {1} to an abrupt end over a disagreement about a font.', tip: 'COME to an end = llegar a su fin.' },
{ id: 'd094', a: 'LITTLE', k: 'little-of-little-value-quantifier', p: 'Cuantificador', src: 'Refuerzo', s: 'The furniture proved to be of {1} value, whatever the auctioneer had implied.', tip: 'of LITTLE value = de escaso valor.' },
{ id: 'd095', a: 'NONE', k: 'none-pronoun-zero-quantity-subject', p: 'Pronombre de cantidad cero', src: 'Refuerzo', s: '{1} of this was explained to the residents beforehand.', tip: 'NONE of this = nada de esto. Funciona como sujeto.' },
{ id: 'd096', a: 'GRIPS', k: 'grips-get-to-grips-with', p: 'Modismo', src: 'Refuerzo', s: 'It takes a fortnight to get to {1} with the filing system.', tip: 'get to GRIPS with = hacerse con, entender a fondo.' },
{ id: 'd097', a: 'LARGE', k: 'large-loom-large-idiom', p: 'Modismo', src: 'Refuerzo', s: 'The question of funding looms {1} over every meeting.', tip: 'loom LARGE = pesar mucho, tener gran presencia.' },
{ id: 'd098', a: 'TURN', k: 'turn-wait-your-turn', p: 'Colocación', src: 'Refuerzo', s: 'You will have to wait your {1} like everybody else.', tip: 'wait your TURN = esperar tu turno.' },
{ id: 'd099', a: 'REST', k: 'rest-the-rest-is-history', p: 'Modismo', src: 'Refuerzo', s: 'She sent the demo to a producer in Bristol, and the {1} is history.', tip: 'the REST is history = lo demás es historia.' },
{ id: 'd100', a: 'LATTER', k: 'latter-former-and-latter-reference', p: 'Referencia', src: 'Refuerzo', s: 'Of speed and accuracy, the {1} matters rather more in this line of work.', tip: 'the former / the LATTER = el primero / el segundo.' }

]);
