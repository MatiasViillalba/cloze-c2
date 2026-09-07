/**
 * Passage bank 07 — the C2 core: negative inversion, fronted concessives and
 * inverted conditionals in extended argumentative prose.
 */
CPE.content.registerPassages([

{
  id: 'p37',
  title: 'The Nomad Question',
  source: 'Digital Nomads',
  focus: 'Concesivas con HOWEVER, condicional invertido e inversión con ONLY',
  brief: 'HOWEVER appealing · cite AS · take a toll ON · Were employers TO insist · AT the same time · to SUCH an extent · question WHETHER · Only when… will we BE',
  text: `{1} appealing the lifestyle may sound in a photograph taken from a hammock, the evidence on remote working from abroad is a good deal more equivocal than its advocates admit. Those who have tried it for more than a year routinely cite isolation {2} the single hardest thing to manage, and the constant renegotiation of visas, tax residence and time zones takes a serious toll {3} anybody's concentration.

{4} employers to insist on a fixed base tomorrow, a substantial minority of their best staff would simply resign; {5} the same time, the productivity data that supposedly justifies the arrangement has been overstated to {6} an extent that several of the original studies have now been withdrawn.

It is reasonable, then, to question {7} the model is sustainable at all in its present form. Only when we have a decade of properly controlled evidence {8} we be in a position to say.`,
  gaps: [
    { n: 1, a: 'HOWEVER', alt: [], k: 'however-adjective-concessive-clause', p: 'Concesiva con HOWEVER', tip: 'HOWEVER appealing the lifestyle may sound = por muy atractivo que suene. Orden: However + adjetivo + sujeto + verbo.' },
    { n: 2, a: 'AS', alt: [], k: 'as-cite-something-as', p: 'Verbo + preposición', tip: 'cite isolation AS the hardest thing = citar el aislamiento como lo más difícil.' },
    { n: 3, a: 'ON', alt: [], k: 'on-take-a-toll-on', p: 'Modismo (take a toll on)', tip: 'take a toll ON somebody = pasar factura a alguien.' },
    { n: 4, a: 'WERE', alt: [], k: 'were-inverted-second-conditional', p: 'Condicional invertido de tipo 2', tip: 'WERE employers to insist = si los empleadores insistieran. Sustituye a «If employers were to insist».' },
    { n: 5, a: 'AT', alt: [], k: 'at-at-the-same-time-discourse', p: 'Conector fijo', tip: 'AT the same time = al mismo tiempo, por otra parte.' },
    { n: 6, a: 'SUCH', alt: [], k: 'such-to-such-an-extent-that', p: 'Estructura de grado', tip: 'to SUCH an extent that… = hasta tal punto que…' },
    { n: 7, a: 'WHETHER', alt: ['IF'], k: 'whether-question-whether-noun-clause', p: 'Interrogativa indirecta', tip: 'question WHETHER the model is sustainable = poner en duda si el modelo es sostenible.' },
    { n: 8, a: 'WILL', alt: ['SHALL'], k: 'will-only-when-inversion-main-clause', p: 'Inversión tras ONLY WHEN', tip: 'Only when… WILL we be in a position to say. La cláusula principal se invierte: auxiliar + sujeto.' }
  ]
},

{
  id: 'p38',
  title: 'The Myth of Multitasking',
  source: 'The Myth of Multitasking',
  focus: 'Inversión con SO, reflexivos y concesivas antepuestas',
  brief: 'between THEM · So ingrained HAS the belief become · IN the face of · consider THEMSELVES · might not HAVE been · but (also) BUT · Difficult AS it may be · at ONCE',
  text: `What people call multitasking is nothing of the sort. Presented with two cognitively demanding tasks, the brain does not run them in parallel; it switches rapidly between {1}, paying a measurable penalty in accuracy each time it does so.

So ingrained {2} the belief in multitasking become that it survives in the face of overwhelming evidence against it. {3} the face of that evidence, roughly nine people in ten still consider {4} to be above average at doing two things at once — a statistical impossibility that ought to give everybody pause.

Had the research been publicised more aggressively in the 1990s, open-plan offices might not {5} been designed as they were. Not only does constant switching slow the work down, {6} it also degrades the memory of what was done. {7} as it may be to accept, the honest conclusion is that nobody does two demanding things at {8}; they merely do them badly in turn.`,
  gaps: [
    { n: 1, a: 'THEM', alt: [], k: 'them-preposition-plus-object-pronoun', p: 'Preposición + pronombre objeto', tip: 'switches between THEM = alterna entre ellas. Se refiere a las dos tareas ya mencionadas.' },
    { n: 2, a: 'HAS', alt: [], k: 'has-so-adjective-inversion-perfect', p: 'Inversión con SO + adjetivo', tip: 'So ingrained HAS the belief become = tan arraigada ha llegado a estar la creencia. So + adj + auxiliar + sujeto.' },
    { n: 3, a: 'IN', alt: [], k: 'in-in-the-face-of-idiom', p: 'Modismo (in the face of)', tip: 'IN the face of that evidence = ante esa evidencia, pese a ella.' },
    { n: 4, a: 'THEMSELVES', alt: [], k: 'themselves-reflexive-consider-oneself', p: 'Pronombre reflexivo', tip: 'consider THEMSELVES to be above average = se consideran por encima de la media.' },
    { n: 5, a: 'HAVE', alt: [], k: 'have-modal-perfect-passive-mixed-cond', p: 'Modal perfecto en pasiva', tip: 'might not HAVE been designed as they were = quizá no se habrían diseñado así. Modal + have + been + participio.' },
    { n: 6, a: 'BUT', alt: [], k: 'but-not-only-but-also-correlative', p: 'Correlativa (not only… but also)', tip: 'Not only does…, BUT it also… Cierre obligatorio de la correlación.' },
    { n: 7, a: 'DIFFICULT', alt: ['HARD'], k: 'difficult-fronted-concessive-adjective-as', p: 'Concesiva antepuesta (adj + as)', tip: 'DIFFICULT as it may be to accept = por difícil que resulte de aceptar. Adjetivo + as + sujeto + verbo.' },
    { n: 8, a: 'ONCE', alt: [], k: 'once-at-once-simultaneously', p: 'Modismo (at once)', tip: 'two things at ONCE = dos cosas a la vez.' }
  ]
},

{
  id: 'p39',
  title: 'The Science of Sleep',
  source: 'The Science of Sleep',
  focus: 'Inversiones con SO y NOT UNTIL, relativas con preposición',
  brief: 'AS little as · So fundamental is sleep THAT · HOWEVER alarming · those WHO · Were the true costs TO be expressed · Not until recently DID · without WHICH · THEIR sleep',
  text: `{1} little as six nights of restricted sleep are enough to produce measurable impairment in glucose regulation, immune response and emotional control. So fundamental is sleep to every system in the body {2} researchers now describe it not as a behaviour but as a biological necessity comparable to breathing.

{3} alarming this finding may be, it has changed remarkably little about how we live. Those {4} routinely sacrifice sleep for work continue to regard the sacrifice as a badge of seriousness. {5} the true costs to be expressed in the language ministries understand — days lost, accidents caused, treatments funded — the argument would have been settled a decade ago.

Not until surprisingly recently {6} scientists begin to map what the sleeping brain actually does. It turns out to perform functions without {7} waking life is impossible, which is why the healthiest thing most adults could do tomorrow is not to change their diet at all, but to guard {8} sleep as fiercely as they guard their salary.`,
  gaps: [
    { n: 1, a: 'AS', alt: [], k: 'as-as-little-as-emphatic-quantity', p: 'Comparativa enfática', tip: 'AS little as six nights = tan solo seis noches. Enfatiza lo pequeño de la cantidad.' },
    { n: 2, a: 'THAT', alt: [], k: 'that-so-adjective-inversion-result', p: 'Resultado tras inversión con SO', tip: 'So fundamental is sleep… THAT researchers describe it… El «that» cierra la estructura de consecuencia.' },
    { n: 3, a: 'HOWEVER', alt: [], k: 'however-adjective-concessive-clause', p: 'Concesiva con HOWEVER', tip: 'HOWEVER alarming this finding may be = por muy alarmante que sea este hallazgo.' },
    { n: 4, a: 'WHO', alt: ['THAT'], k: 'who-those-who-relative', p: 'Demostrativo + relativo', tip: 'Those WHO routinely sacrifice sleep = quienes sacrifican el sueño habitualmente.' },
    { n: 5, a: 'WERE', alt: [], k: 'were-inverted-second-conditional-passive', p: 'Condicional invertido en pasiva', tip: 'WERE the true costs to be expressed = si los costes reales se expresaran. Were + sujeto + to be + participio.' },
    { n: 6, a: 'DID', alt: [], k: 'did-not-until-inversion-past', p: 'Inversión tras NOT UNTIL', tip: 'Not until recently DID scientists begin = no fue hasta hace poco cuando los científicos empezaron. Auxiliar invertido en pasado.' },
    { n: 7, a: 'WHICH', alt: [], k: 'which-without-which-relative', p: 'Preposición + relativo', tip: 'functions without WHICH waking life is impossible = funciones sin las cuales la vigilia es imposible.' },
    { n: 8, a: 'THEIR', alt: [], k: 'their-possessive-determiner-plural', p: 'Determinante posesivo', tip: 'guard THEIR sleep = proteger su sueño. Concuerda con el sujeto plural «most adults».' }
  ]
},

{
  id: 'p40',
  title: 'The Erosion of Trust',
  source: 'The Erosion of Trust',
  focus: 'Inversión con SO y NOT UNTIL, concesivas y genitivo',
  brief: 'regardless of HOW · So thoroughly HAVE the lines been blurred · HOWEVER responsible · Not until… WILL · Were stricter regulations TO be introduced · Difficult AS it may be · WHETHER or not · in EVERYONE\'S interest',
  text: `Trust in news organisations has fallen for eleven consecutive years, a trend that shows no sign of reversing, and it now falls regardless of {1} accurate a given report may turn out to be.

So thoroughly {2} the lines between reporting, commentary and promotion been blurred that many readers no longer attempt to distinguish them. {3} responsible the majority of journalists may be, the profession is judged by its worst week.

Not until platforms are held accountable for what they amplify {4} the situation improve materially. {5} stricter regulations to be introduced tomorrow, however, the effect would take years to appear, and the least scrupulous operators would simply move jurisdiction. {6} as it may be to admit, the problem is not solely one of supply.

The harder question is {7} or not a public that has learned to distrust everything can be persuaded to trust anything, and answering it is emphatically in {8} interest.`,
  gaps: [
    { n: 1, a: 'HOW', alt: [], k: 'how-preposition-plus-wh-clause', p: 'Preposición + cláusula-wh', tip: 'regardless of HOW accurate it may be = sin importar cuán preciso sea.' },
    { n: 2, a: 'HAVE', alt: [], k: 'have-so-adverb-inversion-perfect-passive', p: 'Inversión con SO + adverbio', tip: 'So thoroughly HAVE the lines been blurred = tan a fondo se han difuminado las líneas. So + adv + auxiliar + sujeto.' },
    { n: 3, a: 'HOWEVER', alt: [], k: 'however-adjective-concessive-clause', p: 'Concesiva con HOWEVER', tip: 'HOWEVER responsible the majority may be = por muy responsable que sea la mayoría.' },
    { n: 4, a: 'WILL', alt: [], k: 'will-not-until-inversion-future', p: 'Inversión tras NOT UNTIL', tip: 'Not until platforms are held accountable WILL the situation improve. La principal se invierte.' },
    { n: 5, a: 'WERE', alt: [], k: 'were-inverted-second-conditional-passive', p: 'Condicional invertido en pasiva', tip: 'WERE stricter regulations to be introduced = si se introdujeran normas más estrictas.' },
    { n: 6, a: 'DIFFICULT', alt: ['HARD'], k: 'difficult-fronted-concessive-adjective-as', p: 'Concesiva antepuesta', tip: 'DIFFICULT as it may be to admit = por difícil que sea de admitir.' },
    { n: 7, a: 'WHETHER', alt: [], k: 'whether-whether-or-not', p: 'Frase fija (whether or not)', tip: 'WHETHER or not a public… can be persuaded = si un público… puede o no ser persuadido.' },
    { n: 8, a: "EVERYONE'S", alt: ["EVERYBODY'S"], k: 'everyones-in-everyones-interest', p: 'Genitivo en colocación fija', tip: "in EVERYONE'S interest = en interés de todos. Necesita genitivo sajón." }
  ]
},

{
  id: 'p41',
  title: 'The Illusion of Choice',
  source: 'The Illusion of Choice',
  focus: 'Inversión con SO, frases hechas formales y estructuras de propósito',
  brief: 'come to BE known as · SO great is the anxiety that · far FROM being · IN such a way as to · TO all intents and purposes · aware of HOW · called INTO question · Be that as it MAY',
  text: `The phenomenon has come to {1} known as choice overload, and it is now among the best replicated findings in consumer psychology. So great is the anxiety produced by a wall of near-identical products {2} many shoppers buy nothing at all.

Far {3} being an accident of retail design, the arrangement is deliberate. Shelves are laid out in such a way {4} to keep the customer in the aisle for as long as possible, and pricing is structured so that comparison is, {5} all intents and purposes, impossible without a calculator.

Shoppers are seldom aware of {6} thoroughly the environment has been engineered around them, and when they are told, the ethics of the practice are quickly called {7} question. Be that as it {8}, the industry's defence is a reasonable one: nobody is compelled to enter the shop, and a choice that feels overwhelming is still, technically, a choice.`,
  gaps: [
    { n: 1, a: 'BE', alt: [], k: 'be-come-to-be-known-as', p: 'Infinitivo pasivo tras verbo de proceso', tip: 'come to BE known as = pasar a ser conocido como.' },
    { n: 2, a: 'THAT', alt: [], k: 'that-so-adjective-inversion-result', p: 'Resultado tras inversión con SO', tip: 'So great is the anxiety… THAT many shoppers buy nothing. La consecuencia se cierra con «that».' },
    { n: 3, a: 'FROM', alt: [], k: 'from-far-from-gerund', p: 'Frase fija (far from + -ing)', tip: 'Far FROM being an accident = lejos de ser una casualidad.' },
    { n: 4, a: 'AS', alt: [], k: 'as-in-such-a-way-as-to', p: 'Estructura de propósito', tip: 'in such a way AS to keep the customer… = de tal manera que retenga al cliente…' },
    { n: 5, a: 'TO', alt: [], k: 'to-to-all-intents-and-purposes', p: 'Modismo formal', tip: 'TO all intents and purposes = a todos los efectos.' },
    { n: 6, a: 'HOW', alt: [], k: 'how-aware-of-how-clause', p: 'Preposición + cláusula-wh', tip: 'aware of HOW thoroughly the environment has been engineered = conscientes de hasta qué punto…' },
    { n: 7, a: 'INTO', alt: [], k: 'into-call-into-question', p: 'Colocación (call into question)', tip: 'called INTO question = puesto en tela de juicio.' },
    { n: 8, a: 'MAY', alt: [], k: 'may-be-that-as-it-may', p: 'Modismo concesivo', tip: 'Be that as it MAY = sea como fuere.' }
  ]
},

{
  id: 'p42',
  title: 'The Architecture of Silence',
  source: 'The Architecture of Silence',
  focus: 'Correlativas, condicional invertido y concesiva con AS',
  brief: 'not ONLY… but also · Were it NOT for · Remarkable AS it may seem · from WHICH · begun to BE taken seriously · So significant… THAT · rather THAN · refer TO as',
  text: `A well-designed room is quiet not {1} because of what has been kept out of it but because of what has been built into it. {2} it not for the absorbent surfaces above your head, the average open-plan office would be unusable within an hour.

{3} as it may seem, acoustic comfort was for decades an afterthought in commercial architecture, considered long after the materials from {4} a building was to be constructed had been ordered. Only in the last fifteen years has the subject begun to {5} taken seriously by developers rather than by specialists.

So significant are the measured benefits — in error rates, in reported stress, in staff turnover — {6} several firms now audit sound before they audit light. What architects refer {7} as the acoustic envelope is designed to absorb rather {8} to reflect, and the result, if it works, is a room nobody notices at all.`,
  gaps: [
    { n: 1, a: 'ONLY', alt: [], k: 'only-not-only-but-also-correlative', p: 'Correlativa (not only… but also)', tip: 'not ONLY because of X but because of Y = no solo por X sino por Y.' },
    { n: 2, a: 'WERE', alt: [], k: 'were-were-it-not-for', p: 'Condicional invertido fijo', tip: 'WERE it not for the surfaces = si no fuera por las superficies. Equivale a «If it were not for».' },
    { n: 3, a: 'REMARKABLE', alt: ['SURPRISING', 'STRANGE'], k: 'remarkable-fronted-concessive-adjective-as', p: 'Concesiva antepuesta', tip: 'REMARKABLE as it may seem = por sorprendente que parezca. Adjetivo + as + sujeto + verbo.' },
    { n: 4, a: 'WHICH', alt: [], k: 'which-preposition-from-which', p: 'Preposición + relativo', tip: 'the materials from WHICH a building was to be constructed = los materiales con los que se iba a construir.' },
    { n: 5, a: 'BE', alt: [], k: 'be-infinitive-passive-after-begun', p: 'Infinitivo pasivo', tip: 'begun to BE taken seriously = empezado a tomarse en serio.' },
    { n: 6, a: 'THAT', alt: [], k: 'that-so-adjective-inversion-result', p: 'Resultado tras inversión con SO', tip: 'So significant are the benefits… THAT several firms now audit sound.' },
    { n: 7, a: 'TO', alt: [], k: 'to-refer-to-something-as', p: 'Verbo + preposición', tip: 'refer TO something as = referirse a algo llamándolo…' },
    { n: 8, a: 'THAN', alt: [], k: 'than-rather-than-preference', p: 'Conjunción de preferencia', tip: 'to absorb rather THAN to reflect = absorber en lugar de reflejar.' }
  ]
}

]);
