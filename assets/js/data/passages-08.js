/**
 * Passage bank 08 — advanced argumentative texts. Every gap here targets a
 * structure that separates a Grade C from a Grade A: inversion, fronted
 * concession, inverted conditionals and formal prepositional relatives.
 */
CPE.content.registerPassages([

{
  id: 'p43',
  title: 'The Limits of Language',
  source: 'The Limits of Language',
  focus: 'Concesivas antepuestas, condicional invertido e inversión con ONLY BY',
  brief: 'according TO · Radical AS it may have seemed · languages WITH no fixed terms · not that… BUT rather that · Were it NOT for · HOW far · a problem to WHICH · Only by… CAN we',
  text: `According {1} the strong version of the linguistic relativity hypothesis, the language a person speaks determines the thoughts that person is capable of having. {2} as the claim may have seemed when it was first advanced, a weaker version of it now commands considerable support.

Speakers of languages {3} no fixed terms for left and right, for instance, navigate by compass direction and are demonstrably better at it than the rest of us. The finding is not that such speakers think in an entirely alien fashion, {4} rather that the habits a language enforces are practised thousands of times a day.

{5} it not for a handful of careful field studies conducted in the 1990s, the whole question would still be dismissed as unfalsifiable. What remains disputed is {6} far its implications extend — a problem to {7} no experiment has yet responded convincingly. Only by continuing to test the hypothesis in languages that are themselves disappearing {8} we hope to settle it.`,
  gaps: [
    { n: 1, a: 'TO', alt: [], k: 'to-according-to-prepositional', p: 'Frase preposicional', tip: 'According TO the hypothesis = según la hipótesis.' },
    { n: 2, a: 'RADICAL', alt: ['STRANGE', 'ODD'], k: 'radical-fronted-concessive-adjective-as', p: 'Concesiva antepuesta', tip: 'RADICAL as the claim may have seemed = por radical que pareciera la afirmación. Adjetivo + as + sujeto + verbo.' },
    { n: 3, a: 'WITH', alt: [], k: 'with-preposition-characteristic', p: 'Preposición de característica', tip: 'languages WITH no fixed terms = lenguas que carecen de términos fijos.' },
    { n: 4, a: 'BUT', alt: [], k: 'but-not-that-but-rather-that', p: 'Correlativa de oposición', tip: 'not that X, BUT rather that Y = no que X, sino más bien que Y.' },
    { n: 5, a: 'WERE', alt: [], k: 'were-were-it-not-for', p: 'Condicional invertido fijo', tip: 'WERE it not for a handful of studies = si no fuera por un puñado de estudios.' },
    { n: 6, a: 'HOW', alt: [], k: 'how-how-far-noun-clause', p: 'Cláusula nominal con HOW', tip: 'is HOW far its implications extend = es hasta dónde llegan sus implicaciones.' },
    { n: 7, a: 'WHICH', alt: [], k: 'which-preposition-to-which-relative', p: 'Preposición + relativo', tip: 'a problem to WHICH no experiment has responded = un problema al que ningún experimento ha respondido. «Respond to» arrastra la preposición al frente.' },
    { n: 8, a: 'CAN', alt: ['MAY', 'COULD'], k: 'can-only-by-inversion-main-clause', p: 'Inversión tras ONLY BY', tip: 'Only by continuing to test it CAN we hope to settle it. «Only by + gerundio» obliga a invertir la principal.' }
  ]
},

{
  id: 'p44',
  title: 'The Thinking Machine',
  source: 'The Thinking Machine',
  focus: 'Gerundio pasivo, inversión con SO y condicional invertido',
  brief: 'without BEING identified · Simple AS this test may appear · WHAT would once have seemed · So rapidly HAS AI advanced · HOWEVER impressive · Were a computer TO produce · distinction BETWEEN · Not until… WILL',
  text: `Turing's proposal was disarmingly practical: a machine could be said to think if it could conduct a conversation for five minutes without {1} identified as a machine. {2} as this test may appear, it sidesteps a question philosophers had been unable to settle in three centuries.

{3} would once have seemed a distant thought experiment is now a weekly commercial claim. So rapidly {4} the field advanced in the past decade that systems routinely pass versions of the test Turing described.

{5} impressive these achievements are, they settle nothing about understanding. {6} a computer to produce a flawless translation of a poem, we should still have no way of knowing whether anything had been understood, and the distinction {7} performing a task and grasping it remains exactly where Turing left it. Not until we possess a workable theory of consciousness {8} we be able to do better than guess.`,
  gaps: [
    { n: 1, a: 'BEING', alt: [], k: 'being-preposition-plus-passive-gerund', p: 'Preposición + gerundio pasivo', tip: 'without BEING identified = sin ser identificado. Tras preposición, gerundio; en pasiva, «being» + participio.' },
    { n: 2, a: 'SIMPLE', alt: ['CRUDE', 'BASIC'], k: 'simple-fronted-concessive-adjective-as', p: 'Concesiva antepuesta', tip: 'SIMPLE as this test may appear = por sencilla que parezca esta prueba.' },
    { n: 3, a: 'WHAT', alt: [], k: 'what-nominal-relative-subject', p: 'Relativo nominal como sujeto', tip: 'WHAT would once have seemed a thought experiment = lo que en otro tiempo habría parecido un experimento mental.' },
    { n: 4, a: 'HAS', alt: [], k: 'has-so-adverb-inversion-perfect', p: 'Inversión con SO + adverbio', tip: 'So rapidly HAS the field advanced = tan rápidamente ha avanzado el campo.' },
    { n: 5, a: 'HOWEVER', alt: [], k: 'however-adjective-concessive-clause', p: 'Concesiva con HOWEVER', tip: 'HOWEVER impressive these achievements are = por impresionantes que sean estos logros.' },
    { n: 6, a: 'WERE', alt: [], k: 'were-inverted-second-conditional', p: 'Condicional invertido de tipo 2', tip: 'WERE a computer to produce a translation = si un ordenador produjera una traducción.' },
    { n: 7, a: 'BETWEEN', alt: [], k: 'between-distinction-between', p: 'Sustantivo + preposición', tip: 'the distinction BETWEEN performing and grasping = la distinción entre ejecutar y comprender.' },
    { n: 8, a: 'WILL', alt: ['SHALL', 'CAN'], k: 'will-not-until-inversion-future', p: 'Inversión tras NOT UNTIL', tip: 'Not until we possess a theory WILL we be able… La principal invierte auxiliar y sujeto.' }
  ]
},

{
  id: 'p45',
  title: 'The Classroom Reimagined',
  source: 'The Classroom Reimagined',
  focus: 'Inversión con ONLY y NOT ONLY, cláusulas nominales',
  brief: 'Only with the advent… DID · more effectively… THAN · adopted WHAT is known as · Radical AS this departure may seem · Not only DO students · Were the model TO be adopted · remains to be seen is WHETHER · the methods with WHICH',
  text: `Only with the arrival of cheap video {1} serious questions begin to be asked about the lecture. If students absorb material more effectively when they meet it alone, at their own pace, {2} when they meet it in a hall containing three hundred people, the obvious conclusion is that the hall is being used for the wrong thing.

Several universities have accordingly adopted {3} is known as the flipped classroom, in which the lecture is watched at home and the seminar is spent doing the work. {4} as this departure may seem, it is closer to the medieval tutorial than to anything invented since.

Not only {5} students in flipped courses perform better on average; they also report enjoying the subject more. {6} the model to be adopted wholesale tomorrow, however, the retraining bill would be considerable. What remains to be seen is {7} lecturers can be persuaded to abandon the methods with {8} they are most comfortable.`,
  gaps: [
    { n: 1, a: 'DID', alt: [], k: 'did-only-with-inversion-past', p: 'Inversión tras ONLY + sintagma', tip: 'Only with the arrival of video DID questions begin = solo con la llegada del vídeo empezaron a plantearse preguntas.' },
    { n: 2, a: 'THAN', alt: [], k: 'than-comparative-correlation-when', p: 'Comparativa', tip: 'more effectively when… THAN when… = con más eficacia cuando… que cuando…' },
    { n: 3, a: 'WHAT', alt: [], k: 'what-what-is-known-as', p: 'Relativo nominal', tip: 'adopted WHAT is known as the flipped classroom = han adoptado lo que se conoce como aula invertida.' },
    { n: 4, a: 'RADICAL', alt: ['STRANGE', 'ODD'], k: 'radical-fronted-concessive-adjective-as', p: 'Concesiva antepuesta', tip: 'RADICAL as this departure may seem = por radical que parezca este giro.' },
    { n: 5, a: 'DO', alt: [], k: 'do-not-only-inversion-present', p: 'Inversión tras NOT ONLY', tip: 'Not only DO students perform better = no solo rinden mejor los estudiantes. Presente simple: auxiliar «do» + sujeto.' },
    { n: 6, a: 'WERE', alt: [], k: 'were-inverted-second-conditional-passive', p: 'Condicional invertido en pasiva', tip: 'WERE the model to be adopted wholesale = si el modelo se adoptara de forma generalizada.' },
    { n: 7, a: 'WHETHER', alt: ['IF'], k: 'whether-remains-to-be-seen-whether', p: 'Cláusula nominal con WHETHER', tip: 'What remains to be seen is WHETHER lecturers can be persuaded = lo que está por ver es si…' },
    { n: 8, a: 'WHICH', alt: [], k: 'which-preposition-with-which-relative', p: 'Preposición + relativo', tip: 'the methods with WHICH they are most comfortable = los métodos con los que se sienten más cómodos.' }
  ]
},

{
  id: 'p46',
  title: 'The Weight of Heritage',
  source: 'The Weight of Heritage',
  focus: 'Cleft con ONLY, concesivas y correlativas comparativas',
  brief: 'fall OUT of use · the scale of WHAT is being lost · HOWEVER passionate · rather THAN · Were it not FOR · it is often only when… THAT · BE that as it may · not so much… AS',
  text: `In a world where a language falls {1} of use roughly every fortnight, few people outside universities have any sense of the scale of {2} is being lost. {3} passionate the campaigners are, and they are very passionate indeed, the argument tends to be conducted in a vocabulary of nostalgia {4} than of evidence.

{5} it not for a small number of recording projects, several of the languages documented in the past thirty years would have vanished without a single sentence preserved. It is often only when the last fluent speaker dies {6} a community discovers what it had.

{7} that as it may, the strongest case for preservation is not so much sentimental {8} practical: a language is a record of how one group of people classified the world, and each one lost narrows, permanently, the range of solutions available to everybody else.`,
  gaps: [
    { n: 1, a: 'OUT', alt: [], k: 'out-fall-out-of-use', p: 'Modismo (fall out of use)', tip: 'fall OUT of use = caer en desuso.' },
    { n: 2, a: 'WHAT', alt: [], k: 'what-nominal-relative-object-of-prep', p: 'Relativo nominal tras preposición', tip: 'the scale of WHAT is being lost = la magnitud de lo que se está perdiendo.' },
    { n: 3, a: 'HOWEVER', alt: [], k: 'however-adjective-concessive-clause', p: 'Concesiva con HOWEVER', tip: 'HOWEVER passionate the campaigners are = por muy apasionados que sean los activistas.' },
    { n: 4, a: 'RATHER', alt: [], k: 'rather-rather-than-preference', p: 'Conjunción de preferencia', tip: 'of nostalgia RATHER than of evidence = de nostalgia más que de pruebas.' },
    { n: 5, a: 'WERE', alt: [], k: 'were-were-it-not-for', p: 'Condicional invertido fijo', tip: 'WERE it not for a small number of projects = si no fuera por unos pocos proyectos.' },
    { n: 6, a: 'THAT', alt: [], k: 'that-cleft-it-is-only-when-that', p: 'Cleft con ONLY WHEN', tip: 'It is often only when the last speaker dies THAT a community discovers… = solo cuando muere el último hablante descubre la comunidad…' },
    { n: 7, a: 'BE', alt: [], k: 'be-be-that-as-it-may', p: 'Modismo concesivo', tip: 'BE that as it may = sea como fuere. Fórmula invariable que abre la oración.' },
    { n: 8, a: 'AS', alt: [], k: 'as-not-so-much-as-correlative', p: 'Correlativa (not so much… as…)', tip: 'not so much sentimental AS practical = no tanto sentimental cuanto práctico.' }
  ]
},

{
  id: 'p47',
  title: 'The Great Migration',
  source: 'The Great Migration',
  focus: 'Inversión con NEVER BEFORE y NOT ONLY, relativos con WHOM',
  brief: 'What HAS changed · Never before HAVE · Grave AS the implications are · WERE it not for · many of WHOM · Not only DO they · For ALL the challenges · remains to BE seen',
  text: `Human beings have always moved, and mass migration is by no means a modern invention. What {1} changed is the scale, the speed and the visibility of it. Never before {2} so many people been displaced at one time, nor so thoroughly counted while it happened.

{3} as the humanitarian implications undoubtedly are, the economic argument is rarely made with equal force. {4} it not for migrant labour, the agriculture, construction and care sectors of most wealthy economies would collapse within a season. Many of the workers concerned, {5} of whom hold qualifications their host countries decline to recognise, are doing work that nobody else has applied for in years.

Not only {6} they fill vacancies; they also create demand, pay tax and, on the available evidence, commit fewer crimes than the settled population. {7} all the challenges that rapid arrival undoubtedly brings, the long-term balance sheet is far more favourable than the debate suggests — though whether any of this changes a single vote remains to {8} seen.`,
  gaps: [
    { n: 1, a: 'HAS', alt: [], k: 'has-wh-cleft-what-has-changed', p: 'Cleft con WHAT', tip: 'What HAS changed is the scale = lo que ha cambiado es la escala. Sujeto singular «what».' },
    { n: 2, a: 'HAVE', alt: [], k: 'have-never-before-inversion', p: 'Inversión tras NEVER BEFORE', tip: 'Never before HAVE so many people been displaced = nunca antes había habido tantos desplazados.' },
    { n: 3, a: 'GRAVE', alt: ['SERIOUS'], k: 'grave-fronted-concessive-adjective-as', p: 'Concesiva antepuesta', tip: 'GRAVE as the implications are = por graves que sean las implicaciones.' },
    { n: 4, a: 'WERE', alt: [], k: 'were-were-it-not-for', p: 'Condicional invertido fijo', tip: 'WERE it not for migrant labour = si no fuera por la mano de obra migrante.' },
    { n: 5, a: 'MANY', alt: ['SOME'], k: 'many-quantifier-of-whom-relative', p: 'Cuantificador + of whom', tip: 'MANY of whom hold qualifications = muchos de los cuales poseen títulos. Relativa no definitoria referida a personas.' },
    { n: 6, a: 'DO', alt: [], k: 'do-not-only-inversion-present', p: 'Inversión tras NOT ONLY', tip: 'Not only DO they fill vacancies = no solo cubren vacantes.' },
    { n: 7, a: 'FOR', alt: [], k: 'for-for-all-concessive', p: 'Preposición concesiva (for all)', tip: 'FOR all the challenges = pese a todos los retos. Equivale a «despite».' },
    { n: 8, a: 'BE', alt: [], k: 'be-remains-to-be-seen', p: 'Modismo (remains to be seen)', tip: 'remains to BE seen = está por ver. Infinitivo pasivo obligatorio.' }
  ]
},

{
  id: 'p48',
  title: 'The Scales of Justice',
  source: 'The Scales of Justice',
  focus: 'Inversión con SO, MUCH AS concesivo y relativos formales',
  brief: 'the extent to WHICH · WERE it not for · So profound HAS the impact been · than WAS once believed · Not only do witnesses… BUT · Much AS the profession may resist · in the absence of WHICH · prove to BE sufficient',
  text: `Few people outside the law appreciate the extent to {1} a criminal trial depends on human memory, or how poor an instrument that turns out to be. {2} it not for a series of studies conducted since the 1970s, the courts might still treat a confident witness as a reliable one.

So profound {3} the impact of that research been that identification procedures in several jurisdictions have been rewritten twice. Eyewitness evidence is now known to be far less dependable than {4} once believed, particularly when the witness has been asked the same question more than once.

Not only do witnesses forget, {5} their recollections can also be reshaped, without any dishonesty whatever, by the wording of the questions put to them. {6} as the legal profession may resist the conclusion, memory is a reconstruction rather than a recording. Safeguards therefore exist, in the absence of {7} a conviction may be unsafe; whether they will prove to {8} sufficient is a question the appeal courts are still answering.`,
  gaps: [
    { n: 1, a: 'WHICH', alt: [], k: 'which-the-extent-to-which', p: 'Frase relativa fija', tip: 'the extent to WHICH a trial depends on memory = la medida en que un juicio depende de la memoria.' },
    { n: 2, a: 'WERE', alt: [], k: 'were-were-it-not-for', p: 'Condicional invertido fijo', tip: 'WERE it not for a series of studies = si no fuera por una serie de estudios.' },
    { n: 3, a: 'HAS', alt: [], k: 'has-so-adjective-inversion-perfect', p: 'Inversión con SO + adjetivo', tip: 'So profound HAS the impact been = tan profundo ha sido el impacto.' },
    { n: 4, a: 'WAS', alt: [], k: 'was-comparative-clause-passive-ellipsis', p: 'Comparativa con pasiva elidida', tip: 'less dependable than WAS once believed = menos fiable de lo que en su día se creía. Sin sujeto expreso.' },
    { n: 5, a: 'BUT', alt: [], k: 'but-not-only-but-also-correlative', p: 'Correlativa (not only… but also)', tip: 'Not only do witnesses forget, BUT their recollections can also… Cierre de la correlación.' },
    { n: 6, a: 'MUCH', alt: [], k: 'much-much-as-concessive', p: 'Concesiva con MUCH AS', tip: 'MUCH as the profession may resist it = por mucho que la profesión se resista.' },
    { n: 7, a: 'WHICH', alt: [], k: 'which-in-the-absence-of-which', p: 'Relativo con locución preposicional', tip: 'in the absence of WHICH a conviction may be unsafe = en ausencia de las cuales una condena puede ser insegura.' },
    { n: 8, a: 'BE', alt: [], k: 'be-prove-to-be-adjective', p: 'Verbo + infinitivo (prove to be)', tip: 'prove to BE sufficient = resultar ser suficiente.' }
  ]
}

]);
