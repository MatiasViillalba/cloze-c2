/**
 * Passage bank 06 — reference, substitution and the first inversions.
 */
CPE.content.registerPassages([

{
  id: 'p31',
  title: 'Surviving the Australian Magpie',
  source: 'The Australian Magpie',
  focus: 'Cláusulas nominales, comparativas fijas y modismos',
  brief: 'WHAT can only be described as · within WHICH · take ON · as fast as IS humanly possible · easier said than DONE · EITHER… or · WHILE negotiating · FOR good measure',
  text: `For six weeks each spring, a nesting male magpie establishes {1} can only be described as a no-fly zone, a radius of about a hundred metres within {2} any cyclist, jogger or postal worker is treated as a threat to be driven off.

The bird will happily take {3} an adult twice its height. Advice from the authorities is admirably simple: dismount, face the bird, and walk away as fast as {4} humanly possible without running. This is easier said than {5}, particularly on a hill, and most Australians opt {6} for a detour or for the traditional bicycle helmet studded with cable ties.

{7} negotiating a magpie's territory, it is worth remembering that the bird recognises individual human faces and holds grudges for years. It also, {8} good measure, remembers who fed it, which is why postal workers in some suburbs carry mince.`,
  gaps: [
    { n: 1, a: 'WHAT', alt: [], k: 'what-what-can-only-be-described-as', p: 'Cláusula nominal relativa', tip: 'establishes WHAT can only be described as… = establece lo que solo puede describirse como… Chunk muy frecuente.' },
    { n: 2, a: 'WHICH', alt: [], k: 'which-preposition-within-which', p: 'Preposición + relativo', tip: 'a radius within WHICH any cyclist… = un radio dentro del cual…' },
    { n: 3, a: 'ON', alt: [], k: 'on-take-on-someone-challenge', p: 'Phrasal verb (take on)', tip: 'take ON somebody = enfrentarse a alguien, desafiarlo.' },
    { n: 4, a: 'IS', alt: [], k: 'is-as-fast-as-is-humanly-possible', p: 'Comparativa fija', tip: 'as fast as IS humanly possible = tan rápido como es humanamente posible. El verbo va sin sujeto expreso.' },
    { n: 5, a: 'DONE', alt: [], k: 'done-easier-said-than-done', p: 'Modismo', tip: 'easier said than DONE = del dicho al hecho hay mucho trecho.' },
    { n: 6, a: 'EITHER', alt: [], k: 'either-either-or-correlative', p: 'Conjunción correlativa', tip: 'opt EITHER for a detour OR for the helmet = optar o bien por un rodeo, o bien por el casco.' },
    { n: 7, a: 'WHILE', alt: ['WHEN'], k: 'while-conjunction-plus-gerund', p: 'Conjunción + gerundio', tip: 'WHILE negotiating a territory = mientras se atraviesa un territorio. Sin sujeto: gerundio.' },
    { n: 8, a: 'FOR', alt: [], k: 'for-for-good-measure-idiom', p: 'Modismo', tip: 'FOR good measure = por si fuera poco, para rematar.' }
  ]
},

{
  id: 'p32',
  title: 'Everybody Lives in Cities Now',
  source: 'Living in Cities',
  focus: 'Cleft de sujeto, sustitución con SO y verbos de percepción',
  brief: 'ALTHOUGH · it was the city folk WHO · even MORE so · SEEMS to be · adjust TO · ONE of the challenges · WHAT of…? · WITHOUT needing',
  text: `{1} rural life is still romanticised in advertising, more than half the human population now lives in cities, and the proportion is rising every year. A century ago it was the city folk {2} were considered the anomaly; the reverse is now true, and becoming even {3} so with each generation.

What {4} to be happening is a change not merely of address but of expectation. City dwellers adjust {5} a density of strangers that would once have been regarded as intolerable, and they do it within weeks.

{6} of the great unanswered challenges is what this does to us. {7} of the quiet that rural life supposedly guarantees? Most new arrivals report that they sleep no worse, and that they value being able to buy bread at midnight {8} needing to know a single neighbour by name.`,
  gaps: [
    { n: 1, a: 'ALTHOUGH', alt: ['THOUGH', 'WHILE', 'WHILST'], k: 'although-concessive-clause-initial', p: 'Conjunción de concesión', tip: 'ALTHOUGH rural life is romanticised… = aunque la vida rural se idealiza… Oración completa detrás.' },
    { n: 2, a: 'WHO', alt: ['THAT'], k: 'who-cleft-it-was-x-who', p: 'Cleft de sujeto', tip: 'it was the city folk WHO were considered… = eran los urbanitas quienes se consideraban… Estructura enfática.' },
    { n: 3, a: 'MORE', alt: [], k: 'more-substitution-even-more-so', p: 'Sustitución con «so»', tip: 'becoming even MORE so = siéndolo aún más. «So» reemplaza al adjetivo anterior y «more» lo compara.' },
    { n: 4, a: 'SEEMS', alt: ['APPEARS'], k: 'seems-seem-to-be-happening', p: 'Verbo + infinitivo (seem to be)', tip: 'What SEEMS to be happening = lo que parece estar ocurriendo. Sujeto «what», singular.' },
    { n: 5, a: 'TO', alt: [], k: 'to-adjust-to-something', p: 'Verbo + preposición', tip: 'adjust TO something = adaptarse a algo.' },
    { n: 6, a: 'ONE', alt: [], k: 'one-of-the-superlative-chunk', p: 'Chunk (one of the…)', tip: 'ONE of the great unanswered challenges = uno de los grandes retos sin respuesta.' },
    { n: 7, a: 'WHAT', alt: [], k: 'what-what-of-fixed-question', p: 'Fórmula interrogativa fija', tip: 'WHAT of the quiet…? = ¿y qué hay del silencio…? Pregunta retórica formal.' },
    { n: 8, a: 'WITHOUT', alt: [], k: 'without-preposition-plus-gerund', p: 'Preposición + gerundio', tip: 'WITHOUT needing to know anybody = sin necesidad de conocer a nadie.' }
  ]
},

{
  id: 'p33',
  title: 'Learning by Post',
  source: 'Education by mail',
  focus: 'Referencia con former/latter, preposiciones de función',
  brief: 'some time LATER · AROUND the world · AS its primary methods · divide INTO · at the SAME time · the LATTER · on one\'s OWN schedule · those WHO',
  text: `Correspondence courses began in Britain in the 1840s, and some time {1}, once the penny post had spread {2} the world, they became the first genuinely global form of education. {3} its primary delivery methodologies, the early distance university used the postal service, the printed pamphlet and, eventually, the gramophone record.

Distance learning divides {4} two broad kinds. In the first, students work through material at fixed points in a calendar; in the second, they proceed at whatever speed suits them. The advantage of the former is that everybody covers the same ground at the {5} time and can therefore discuss it; the advantage of the {6} is that a student who works nights can study on their {7} schedule without apologising to anybody.

Neither model suits everybody. Those {8} thrive at a distance tend to be older, more stubborn, and considerably better organised than they were at eighteen.`,
  gaps: [
    { n: 1, a: 'LATER', alt: [], k: 'later-some-time-later-time-expression', p: 'Expresión temporal', tip: 'some time LATER = algún tiempo después.' },
    { n: 2, a: 'AROUND', alt: ['ACROSS'], k: 'around-around-the-world-collocation', p: 'Frase preposicional', tip: 'AROUND the world = por todo el mundo.' },
    { n: 3, a: 'AS', alt: [], k: 'as-preposition-function-role', p: 'Preposición de función', tip: 'AS its primary delivery methodologies = como sus principales métodos de entrega. AS indica el papel que algo desempeña.' },
    { n: 4, a: 'INTO', alt: [], k: 'into-divide-into', p: 'Verbo + preposición', tip: 'divide INTO two kinds = se divide en dos tipos.' },
    { n: 5, a: 'SAME', alt: [], k: 'same-at-the-same-time', p: 'Frase fija', tip: 'at the SAME time = al mismo tiempo.' },
    { n: 6, a: 'LATTER', alt: [], k: 'latter-former-and-latter-reference', p: 'Referencia (the former / the latter)', tip: 'the former… the LATTER = el primero… el segundo (el último mencionado).' },
    { n: 7, a: 'OWN', alt: [], k: 'own-possessive-plus-own', p: 'Posesivo + own', tip: 'on their OWN schedule = a su propio ritmo. Siempre tras un posesivo.' },
    { n: 8, a: 'WHO', alt: ['THAT'], k: 'who-those-who-relative', p: 'Demostrativo + relativo', tip: 'Those WHO thrive at a distance = quienes prosperan a distancia.' }
  ]
},

{
  id: 'p34',
  title: 'Where Does the Solar System End?',
  source: 'The Solar System',
  focus: 'Verbos con preposición, adverbios enfáticos y conectores',
  brief: 'arise FROM · equally WELL · WITH any of these definitions · extend OUT to · ITSELF lying at · HOWEVER · AS for · confined TO',
  text: `Disagreements about the size of the solar system arise {1} the fact that there are at least three defensible definitions of where it stops, and that each could equally {2} be used in a textbook.

The first places the boundary at the outermost planet; the second at the heliopause, where the solar wind gives way to interstellar gas; the third at the outer edge of the Oort cloud. The trouble {3} any of these definitions is that they produce answers differing by a factor of several thousand. The last would have the system extend {4} to roughly a quarter of the distance to the nearest star, that star {5} lying at a little over four light years.

Voyager 1, {6}, is generally described as having left the solar system in 2012, on the second definition. {7} for the Oort cloud, no spacecraft will reach it for another three centuries. Our certainty, it turns out, is confined {8} the region we have actually visited.`,
  gaps: [
    { n: 1, a: 'FROM', alt: [], k: 'from-arise-from', p: 'Verbo + preposición', tip: 'arise FROM the fact that… = surgen del hecho de que…' },
    { n: 2, a: 'WELL', alt: [], k: 'well-could-equally-well', p: 'Colocación adverbial', tip: 'could equally WELL be used = podría emplearse igualmente bien.' },
    { n: 3, a: 'WITH', alt: [], k: 'with-the-trouble-with', p: 'Sustantivo + preposición', tip: 'The trouble WITH these definitions = el problema con estas definiciones.' },
    { n: 4, a: 'OUT', alt: [], k: 'out-extend-out-to', p: 'Phrasal verb', tip: 'extend OUT to = extenderse hasta.' },
    { n: 5, a: 'ITSELF', alt: [], k: 'itself-emphatic-pronoun-apposition', p: 'Pronombre enfático', tip: 'that star ITSELF lying at… = estando la propia estrella a… Refuerza el sustantivo en una cláusula absoluta.' },
    { n: 6, a: 'HOWEVER', alt: ['MEANWHILE'], k: 'however-conjunctive-adverb-parenthetical', p: 'Adverbio conjuntivo entre comas', tip: 'Voyager 1, HOWEVER, is described as… = la Voyager 1, en cambio, se describe como…' },
    { n: 7, a: 'AS', alt: [], k: 'as-as-for-topic-shift', p: 'Frase fija (as for)', tip: 'AS for the Oort cloud = en cuanto a la nube de Oort. Cambia de tema.' },
    { n: 8, a: 'TO', alt: [], k: 'to-confined-to', p: 'Verbo + preposición', tip: 'confined TO the region we have visited = limitada a la región que hemos visitado.' }
  ]
},

{
  id: 'p35',
  title: 'Two Wheels, Two Centuries',
  source: 'The Bicycle',
  focus: 'Phrasal verbs de viaje, cuantificadores y compuestos',
  brief: 'SET out on · as we now KNOW it · MUCH has changed · REMAINED true to · of WHICH · THANKS to · GOOD looks · disc BRAKES',
  text: `In 1817 Karl Drais {1} out on a fourteen-kilometre ride through Mannheim on a wooden contraption with no pedals, and the bicycle as we now {2} it was on its way. Rather {3} has changed since, and yet the machine has {4} remarkably true to its origins: two equal wheels, a diamond frame, the rider's weight distributed between three points.

The gains have come in materials, of {5} carbon fibre is only the most recent, and in the components. {6} to indexed gearing, a modern rider changes ratio without thinking; {7} to disc {8}, the same rider stops in the wet at something like the distance a car would need. What has not changed at all is the reason people ride: it remains, as Drais discovered on that first morning, faster than walking and much more fun.`,
  gaps: [
    { n: 1, a: 'SET', alt: [], k: 'set-set-out-on-journey', p: 'Phrasal verb (set out on)', tip: 'SET out on a ride = emprender un trayecto.' },
    { n: 2, a: 'KNOW', alt: [], k: 'know-as-we-know-it-fixed', p: 'Frase fija', tip: 'as we now KNOW it = tal y como lo conocemos hoy.' },
    { n: 3, a: 'MUCH', alt: ['LITTLE'], k: 'much-pronoun-as-subject', p: 'Pronombre cuantificador como sujeto', tip: 'Rather MUCH has changed since = bastante ha cambiado desde entonces. Funciona como sujeto singular.' },
    { n: 4, a: 'REMAINED', alt: ['STAYED'], k: 'remained-remain-true-to', p: 'Verbo + adjetivo + preposición', tip: 'has REMAINED true to its origins = se ha mantenido fiel a sus orígenes.' },
    { n: 5, a: 'WHICH', alt: [], k: 'which-preposition-of-which', p: 'Preposición + relativo', tip: 'in materials, of WHICH carbon fibre is the most recent = de los cuales la fibra de carbono es el más reciente.' },
    { n: 6, a: 'THANKS', alt: ['OWING', 'DUE'], k: 'thanks-thanks-to-prepositional', p: 'Frase preposicional', tip: 'THANKS to indexed gearing = gracias al cambio indexado.' },
    { n: 7, a: 'THANKS', alt: ['OWING', 'DUE'], k: 'thanks-thanks-to-prepositional', p: 'Frase preposicional', tip: 'El paralelismo con la oración anterior te da la respuesta: la misma fórmula repetida.' },
    { n: 8, a: 'BRAKES', alt: [], k: 'brakes-disc-brakes-compound', p: 'Sustantivo compuesto', tip: 'disc BRAKES = frenos de disco.' }
  ]
},

{
  id: 'p36',
  title: 'The Paradox of Expertise',
  source: 'The Paradox of Expertise',
  focus: 'Inversión negativa, condicionales invertidos y relativos formales',
  brief: 'by NO means · what IS known as · NOWHERE is this more apparent · THEIR colleagues · but (also) · Had researchers BEEN · Be that as it MAY · the way IN which',
  text: `Expertise is by {1} means a guarantee of good judgement. Psychologists have documented what {2} known as the overconfidence effect for half a century, and {3} is this more apparent than among specialists asked to forecast events within their own field.

In one long-running study, the predictions of senior clinicians were no more accurate than those of {4} most junior colleagues. Not only did the experts get more wrong; they {5} expressed far greater certainty while doing so.

Had researchers {6} aware of these findings in the 1970s, a great deal of policy might have been designed differently. Be that as it {7}, the practical lesson is not that expertise is worthless. It is that the way {8} which an expert reasons — quickly, by pattern recognition, on the basis of cases already seen — is exactly what makes a genuinely novel case so dangerous.`,
  gaps: [
    { n: 1, a: 'NO', alt: [], k: 'no-by-no-means-idiom', p: 'Frase preposicional fija', tip: 'by NO means = en absoluto, de ninguna manera.' },
    { n: 2, a: 'IS', alt: [], k: 'is-what-is-known-as', p: 'Pasiva en cláusula nominal', tip: 'what IS known as the overconfidence effect = lo que se conoce como el efecto de exceso de confianza.' },
    { n: 3, a: 'NOWHERE', alt: [], k: 'nowhere-negative-inversion-fronted', p: 'Inversión negativa', tip: 'NOWHERE is this more apparent than… = en ningún sitio resulta más evidente que… El adverbio negativo al frente invierte sujeto y verbo.' },
    { n: 4, a: 'THEIR', alt: [], k: 'their-possessive-anaphoric-colleagues', p: 'Determinante posesivo', tip: 'those of THEIR most junior colleagues = las de sus colegas más jóvenes. Concuerda con «clinicians».' },
    { n: 5, a: 'ALSO', alt: [], k: 'also-not-only-but-also-correlative', p: 'Correlativa (not only… but also)', tip: 'Not only did they…; they ALSO expressed… Segunda mitad de la correlación.' },
    { n: 6, a: 'BEEN', alt: [], k: 'been-had-inversion-third-conditional', p: 'Condicional invertido de tipo 3', tip: 'Had researchers BEEN aware = si los investigadores hubieran sido conscientes. «Had» + sujeto + participio, sin «if».' },
    { n: 7, a: 'MAY', alt: [], k: 'may-be-that-as-it-may', p: 'Modismo concesivo', tip: 'Be that as it MAY = sea como fuere, a pesar de ello.' },
    { n: 8, a: 'IN', alt: [], k: 'in-the-way-in-which', p: 'Relativa con preposición', tip: 'the way IN which an expert reasons = la manera en que razona un experto.' }
  ]
}

]);
