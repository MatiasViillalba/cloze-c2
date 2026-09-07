/**
 * Passage bank 01 — collocation, phrasal verbs and dependent prepositions.
 * Each text is an original Cambridge C2 Part 2 open cloze (eight gaps) built
 * around the target words and patterns from the learner's own answer keys.
 */
CPE.content.registerPassages([

{
  id: 'p01',
  title: 'The Rise of Positive Psychology',
  source: 'Positive Psychology',
  focus: 'Colocaciones, concesión y phrasal verbs de éxito',
  brief: 'WHAT nominal · restore TO · at the EXPENSE of · THOUGH · as FAR back as · take OFF · SINCE then · gain GROUND',
  text: `For most of the twentieth century, psychology concerned itself almost exclusively with {1} are commonly described as disorders: the anxieties, compulsions and dependencies that bring people into a consulting room in the first place. The discipline set out to restore the suffering individual {2} some notional baseline of normality, and it arguably did so at the {3} of everybody else, since a person who was merely unhappy rather than ill had no obvious claim on its attention.

{4} the profession had always insisted that it studied the whole of human experience, flourishing itself was left largely unexamined. Concern with well-being is hardly a modern invention, of course; it can be traced as {5} back as the ancient moral philosophers, for whom the good life was the only subject worth arguing about. What was genuinely new, in 1998, was the label. Martin Seligman devoted his presidential address to the American Psychological Association to the claim that happiness deserved precisely the same empirical rigour as illness, and the idea took {6} almost at once.

{7} then, positive psychology has gained {8} in schools, hospitals and boardrooms alike, though its critics still complain that measuring contentment is a good deal harder than measuring despair.`,
  gaps: [
    { n: 1, a: 'WHAT', alt: [], k: 'what-nominal-relative-subject', p: 'Nominal relative clause', tip: 'Sin antecedente: hace falta un relativo nominal que valga por «the things that». «with WHAT are commonly described as…» = «con lo que suele describirse como…».' },
    { n: 2, a: 'TO', alt: [], k: 'to-restore-something-to', p: 'Verbo + preposición (restore sth TO sth)', tip: '«Restore» rige TO cuando indica el estado o lugar al que se devuelve algo: restore something TO its rightful place / TO normality.' },
    { n: 3, a: 'EXPENSE', alt: [], k: 'expense-at-the-expense-of', p: 'Frase preposicional fija', tip: 'at the EXPENSE of = a costa de. La estructura at the ___ of pide siempre ese sustantivo.' },
    { n: 4, a: 'THOUGH', alt: ['ALTHOUGH', 'WHILE', 'WHILST'], k: 'though-concessive-conjunction', p: 'Conjunción de concesión', tip: 'Dos ideas en contraste dentro de una misma oración: «Aunque la profesión insistía…, el florecimiento quedó sin estudiar». THOUGH/ALTHOUGH encabezan la subordinada concesiva.' },
    { n: 5, a: 'FAR', alt: [], k: 'far-as-far-back-as', p: 'Frase fija de referencia temporal', tip: 'as FAR back as + época = ya desde, nada menos que hasta. Fijate en el «as … back as» que envuelve el hueco.' },
    { n: 6, a: 'OFF', alt: [], k: 'off-take-off-succeed', p: 'Phrasal verb (take off = despegar, triunfar)', tip: 'take OFF aquí no es un avión: una idea o un producto «despega», se vuelve popular de golpe.' },
    { n: 7, a: 'SINCE', alt: [], k: 'since-since-then-adverbial', p: 'Adverbial temporal fija', tip: 'SINCE then = desde entonces. Encabeza la oración y suele pedir present perfect después («has gained»).' },
    { n: 8, a: 'GROUND', alt: [], k: 'ground-gain-ground-idiom', p: 'Colocación / modismo (gain ground)', tip: 'gain GROUND = ir ganando terreno, ir siendo aceptado. Colocación fija con «gain».' }
  ]
},

{
  id: 'p02',
  title: "A Conductor's Breaking Point",
  source: 'Conductor against mobile phones',
  focus: 'Colocaciones con preposición, sustitución y énfasis',
  brief: 'lose patience WITH · WENT off · DESPITE · ONE (sustituto) · WHAT made matters worse · the fact THAT · HAD enough · intent ON',
  text: `There are few things more likely to make a professional orchestra lose patience {1} its audience than the electronic chirp of a mobile phone. At a recital in Munich last winter, one {2} off during the quietest bar of a Mahler adagio, and the conductor stopped the performance outright rather than play on.

{3} a polite announcement before the interval, the offending device was not switched off; indeed, a second {4} rang before the interval was over. {5} made matters worse was that its owner cheerfully answered it and conducted a short conversation in the stalls.

The conductor later admitted that it was not the interruption itself that had enraged him so much as the fact {6} nobody in the surrounding rows appeared remotely embarrassed by it. After thirty years on the podium, he had simply {7} enough. Musicians who devote the best part of a decade to a single symphony are, he suggested, entitled to feel a little proprietorial, and audiences intent {8} recording the evening on their phones rarely hear a note of it.

A handful of concert halls have since installed signal blockers, with mixed results.`,
  gaps: [
    { n: 1, a: 'WITH', alt: [], k: 'with-lose-patience-with', p: 'Colocación verbo + sustantivo + preposición', tip: 'lose patience WITH somebody. El sustantivo «patience» arrastra siempre WITH.' },
    { n: 2, a: 'WENT', alt: [], k: 'went-go-off-ring', p: 'Phrasal verb en pasado (go off = sonar)', tip: 'go OFF = sonar de golpe (una alarma, un teléfono). En pasado simple: WENT off.' },
    { n: 3, a: 'DESPITE', alt: ['NOTWITHSTANDING'], k: 'despite-preposition-concession', p: 'Preposición de concesión + sintagma nominal', tip: 'Delante hay un sustantivo («a polite announcement»), no una oración: por eso DESPITE y nunca ALTHOUGH.' },
    { n: 4, a: 'ONE', alt: [], k: 'one-substitute-pronoun-countable', p: 'Pronombre sustituto de contable singular', tip: 'ONE evita repetir «phone»: «a second ONE rang» = un segundo teléfono sonó.' },
    { n: 5, a: 'WHAT', alt: [], k: 'what-cleft-what-made-matters-worse', p: 'Cleft / chunk de énfasis', tip: 'WHAT made matters worse was that… = lo que empeoró las cosas fue que… Estructura hendida que abre la oración.' },
    { n: 6, a: 'THAT', alt: [], k: 'that-the-fact-that-noun-clause', p: 'the fact THAT + oración', tip: 'Tras «the fact» va THAT introduciendo la oración sustantiva. No confundir con «the fact of + -ing».' },
    { n: 7, a: 'HAD', alt: [], k: 'had-have-had-enough-idiom', p: 'Modismo (have had enough)', tip: 'have HAD enough = estar hasta las narices. Con «he had simply ___ enough» necesitás el participio de have.' },
    { n: 8, a: 'ON', alt: [], k: 'on-intent-on-doing', p: 'Adjetivo + preposición + gerundio', tip: 'intent ON doing something = empeñado en hacer algo. El adjetivo «intent» solo admite ON.' }
  ]
},

{
  id: 'p03',
  title: 'Cold Water, Warm Welcome',
  source: 'Open-water swimming',
  focus: 'Phrasal verbs, inversión con SO y frases de propósito',
  brief: 'feel LIKE + -ing · set UP · set APART · SOMETHING of a · AS much for… as · in ORDER to · SO + adj + inversión · to DATE',
  text: `Not everybody feels {1} plunging into a granite-cold lake at six o'clock on a November morning. Even so, the swimming club that Erin Doyle set {2} in a disused Cork boathouse eleven years ago now counts more than eight hundred members, and the waiting list is longer than the register.

What sets open-water swimming {3} from its chlorinated cousin, according to Doyle, is the sheer refusal of the water to behave: no lanes, no walls, no comforting black line to follow. She has become {4} of a local celebrity in the process, renowned {5} much for her unfailing good humour at dawn as for the medals gathering dust on her mantelpiece.

In {6} to raise money for a children's hospice, the club attempted a relay crossing of the Irish Sea in its second summer. {7} successful was that first attempt that a second, longer crossing was organised almost before the swimmers had dried off. To {8}, the club has raised over four hundred thousand euros, and not one of its members, Doyle notes drily, has yet learned to enjoy the cold.`,
  gaps: [
    { n: 1, a: 'LIKE', alt: [], k: 'like-feel-like-gerund', p: 'Verbo + preposición + gerundio', tip: 'feel LIKE doing something = tener ganas de hacer algo. Siempre con gerundio detrás.' },
    { n: 2, a: 'UP', alt: [], k: 'up-set-up-establish', p: 'Phrasal verb (set up = fundar)', tip: 'set UP a club / a business / a charity = fundar, montar. Es el phrasal verb más rentable del CPE.' },
    { n: 3, a: 'APART', alt: [], k: 'apart-set-something-apart', p: 'Phrasal verb (set sth apart = distinguir)', tip: 'set something APART from something else = lo que lo diferencia. Fijate en el «from» que aparece después.' },
    { n: 4, a: 'SOMETHING', alt: [], k: 'something-be-something-of-a', p: 'Chunk (be something of a…)', tip: 'be SOMETHING of a celebrity = ser una especie de celebridad, serlo hasta cierto punto.' },
    { n: 5, a: 'AS', alt: [], k: 'as-as-much-for-as-for', p: 'Estructura comparativa (as much for… as for…)', tip: 'renowned AS much for X as for Y = célebre tanto por X como por Y. El segundo «as» ya está escrito: te falta el primero.' },
    { n: 6, a: 'ORDER', alt: [], k: 'order-in-order-to-purpose', p: 'Frase de propósito', tip: 'in ORDER to + infinitivo = con el fin de. Fijate en el «In … to raise» que enmarca el hueco.' },
    { n: 7, a: 'SO', alt: [], k: 'so-inversion-so-adj-that', p: 'Inversión con SO + adjetivo', tip: 'SO successful was that attempt THAT… Cuando SO + adjetivo encabeza la frase, el verbo va delante del sujeto.' },
    { n: 8, a: 'DATE', alt: [], k: 'date-to-date-so-far', p: 'Frase fija (to date)', tip: 'to DATE = hasta la fecha, hasta ahora. Pide present perfect en la oración («has raised»).' }
  ]
},

{
  id: 'p04',
  title: 'The Woman Behind Happy Hearts',
  source: 'Happy Hearts',
  focus: 'Cláusulas de participio, concesión y causa',
  brief: "work one's WAY up · ALTHOUGH · BECAUSE of · BROUGHT about · HAVING been · HAD a profound effect · SET up · WHILE",
  text: `Marisa Okonjo did not inherit her charity; she worked her {1} up to it. Having left school at sixteen, she spent nine years behind the counter of a chemist's shop in Leeds before anyone thought to ask her opinion about anything at all.

{2} she is now routinely described as a philanthropist, she bristles at the word. The change in her circumstances came about not {3} of any windfall but as the result of a single afternoon in 2009, when a customer collapsed in the aisle and Okonjo, who had taken a first-aid course out of sheer boredom, kept her alive until the ambulance arrived. That afternoon {4} about everything that followed.

{5} been caught up in a story that the local press refused to drop, she found herself invited to speak in schools, and discovered that she was rather good at it. The experience {6} a profound effect on the way she thought about her own education.

Two years later she {7} up Happy Hearts, which now trains teenagers in emergency first aid across four counties. {8} she remains uneasy about the attention, she has learned to use it: publicity, as she puts it, is simply another form of fundraising.`,
  gaps: [
    { n: 1, a: 'WAY', alt: [], k: 'way-work-ones-way-up', p: "Modismo (work one's way up)", tip: 'work your WAY up = ir ascendiendo poco a poco por esfuerzo propio. El posesivo «her» delante te da la pista.' },
    { n: 2, a: 'ALTHOUGH', alt: ['THOUGH', 'WHILE', 'WHILST'], k: 'although-concessive-clause-initial', p: 'Conjunción de concesión', tip: 'Encabeza una oración completa con sujeto y verbo («she is now described…»), así que necesitás conjunción, no preposición.' },
    { n: 3, a: 'BECAUSE', alt: [], k: 'because-because-of-complex-preposition', p: 'Preposición compleja (because of)', tip: 'BECAUSE of + sustantivo = a causa de. Lo confirma el «not ___ of any windfall but…» que contrapone dos causas.' },
    { n: 4, a: 'BROUGHT', alt: [], k: 'brought-bring-about-cause', p: 'Phrasal verb (bring about = provocar)', tip: 'bring ABOUT = causar, provocar un cambio. En pasado simple: BROUGHT about.' },
    { n: 5, a: 'HAVING', alt: [], k: 'having-perfect-participle-clause', p: 'Cláusula de participio perfecto', tip: 'HAVING been caught up… = tras haberse visto envuelta… Marca una acción anterior a la principal, muy típica del C2.' },
    { n: 6, a: 'HAD', alt: [], k: 'had-have-a-profound-effect-on', p: 'Colocación (have an effect on)', tip: 'have a profound effect ON something. El verbo que acompaña a «effect» es «have», nunca «make».' },
    { n: 7, a: 'SET', alt: [], k: 'set-set-up-found-charity', p: 'Phrasal verb (set up = fundar)', tip: 'set UP a foundation / a charity. Aquí en pasado simple, forma invariable: SET.' },
    { n: 8, a: 'WHILE', alt: ['ALTHOUGH', 'THOUGH', 'WHILST'], k: 'while-contrast-conjunction', p: 'Conjunción de contraste', tip: 'WHILE she remains uneasy…, she has learned… = si bien sigue incómoda, ha aprendido a… Contrasta dos hechos simultáneos.' }
  ]
},

{
  id: 'p05',
  title: 'Before the Phones',
  source: 'The Mobile Era',
  focus: 'Hábitos pasados, pasiva perfecta y modismos de escasez',
  brief: 'THERE was a time when · WOULD · USED to be · not to ANSWER · have been SHOWN · few and far BETWEEN · IF · the ODD one out',
  text: `{1} was a time, not so very long ago, when leaving the house meant leaving everybody behind. You {2} arrange to meet a friend outside a cinema at seven, and if the friend failed to appear by twenty past, you went home. There {3} to be no mechanism whatever for renegotiating the evening, and, curiously, nobody seems to have found this intolerable.

What has quietly disappeared along with the phone box is the freedom not to {4} — the perfectly ordinary right to be unreachable for an afternoon. Think about how rarely that right is exercised today. Prolonged periods of disconnection have been {5} to be restorative in study after study, yet volunteers willing to attempt them are few and far {6}.

{7} you do not carry a phone, of course, you quickly discover how much social machinery now assumes that you do: the group message, the shared location, the ticket that exists only on a screen. The refusenik is not merely inconvenienced; he becomes the {8} one out, the friend for whom special arrangements must always be made.`,
  gaps: [
    { n: 1, a: 'THERE', alt: [], k: 'there-existential-there-was-a-time', p: 'THERE existencial', tip: 'THERE was a time when… = hubo una época en que… Fórmula fija para abrir un texto nostálgico.' },
    { n: 2, a: 'WOULD', alt: [], k: 'would-past-habit-modal', p: 'Modal de hábito pasado', tip: 'WOULD + infinitivo describe rutinas del pasado. Alterna con «used to», pero aquí «used» aparece más abajo.' },
    { n: 3, a: 'USED', alt: [], k: 'used-used-to-be-past-state', p: 'Semi-modal (used to be)', tip: 'There USED to be… = antes había… Describe un estado pasado que ya no existe.' },
    { n: 4, a: 'ANSWER', alt: [], k: 'answer-freedom-not-to-answer', p: 'Infinitivo tras sustantivo', tip: 'the freedom not to ANSWER = la libertad de no contestar. El sustantivo «freedom» se completa con infinitivo.' },
    { n: 5, a: 'SHOWN', alt: ['PROVED', 'PROVEN', 'FOUND'], k: 'shown-have-been-shown-to-be', p: 'Pasiva perfecta + infinitivo', tip: 'have been SHOWN to be = se ha demostrado que son. Participio dentro de la pasiva.' },
    { n: 6, a: 'BETWEEN', alt: [], k: 'between-few-and-far-between', p: 'Modismo (few and far between)', tip: 'few and far BETWEEN = escasísimos, contadísimos. Expresión invariable.' },
    { n: 7, a: 'IF', alt: [], k: 'if-first-conditional-clause', p: 'Condicional real', tip: 'IF you do not carry a phone… + presente. Condición real, tipo 1.' },
    { n: 8, a: 'ODD', alt: [], k: 'odd-the-odd-one-out', p: 'Modismo (the odd one out)', tip: 'the ODD one out = el que desentona, el raro del grupo.' }
  ]
},

{
  id: 'p06',
  title: 'Lessons by Candlelight',
  source: 'Memories of childhood',
  focus: 'Pasiva pasada, relativos y preposiciones de tiempo',
  brief: 'WERE introduced · AS a punishment · on TIME · WHO · DURING · fixed TO · SUCH lines · remote FROM',
  text: `Most of us {1} introduced to poetry at school in the worst possible way, that is to say {2} a punishment. Lines were set to be learned by heart and recited the following morning, and the boy who failed to deliver them on {3} could expect the flat of a ruler across his knuckles.

Our own schoolmaster, a gaunt Welshman {4} had been invalided out of the army in 1917, was the exception. {5} the nightly bombardments of that first winter, when the school moved into a cellar beneath the chapel, he fixed a stub of candle {6} the lid of an upturned packing case and read to us from Hardy and Edward Thomas until the noise overhead subsided.

He never dismissed {7} lines as mere decoration, nor did he pretend that they were remote {8} the lives of forty frightened children in a cellar. He addressed us directly, as though we were adults, and to my considerable surprise I have remembered half of what he read ever since.`,
  gaps: [
    { n: 1, a: 'WERE', alt: [], k: 'were-past-simple-passive', p: 'Pasiva en pasado simple', tip: 'we WERE introduced to… = se nos presentó a… Sujeto plural + participio: hace falta el auxiliar «be» en pasado.' },
    { n: 2, a: 'AS', alt: [], k: 'as-preposition-function-role', p: 'Preposición de función o equivalencia', tip: 'AS a punishment = a modo de castigo. AS indica el papel o la función que algo cumple.' },
    { n: 3, a: 'TIME', alt: [], k: 'time-on-time-fixed-phrase', p: 'Frase preposicional fija', tip: 'on TIME = puntualmente, a la hora acordada. No confundir con «in time» (a tiempo, con margen).' },
    { n: 4, a: 'WHO', alt: ['THAT'], k: 'who-defining-relative-person', p: 'Relativo de persona', tip: 'Antecedente humano («a gaunt Welshman») + verbo: relativo sujeto WHO.' },
    { n: 5, a: 'DURING', alt: [], k: 'during-preposition-time-period', p: 'Preposición de tiempo', tip: 'DURING + sustantivo de periodo = mientras duraban los bombardeos. Nunca «during» + oración con sujeto y verbo.' },
    { n: 6, a: 'TO', alt: [], k: 'to-fix-something-to', p: 'Verbo + preposición (fix sth to sth)', tip: 'fix a candle TO the lid = sujetar una vela a la tapa. «Fix» rige TO para la superficie de destino.' },
    { n: 7, a: 'SUCH', alt: [], k: 'such-determiner-anaphoric-reference', p: 'Determinante referencial', tip: 'dismiss SUCH lines as decoration = descartar tales versos como… SUCH remite a la categoría ya mencionada.' },
    { n: 8, a: 'FROM', alt: [], k: 'from-remote-from-adjective-prep', p: 'Adjetivo + preposición', tip: 'remote FROM something = ajeno a algo, alejado de algo.' }
  ]
}

]);
