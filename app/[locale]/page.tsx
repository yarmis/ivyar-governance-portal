'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

const MODULES_TRANSLATIONS = {
  us: {
    governance: [
      { title: 'Governance Core', desc: 'Authority, roles, delegation, institutional control', cat: 'governance' },
      { title: 'Program Registry', desc: 'Programs, contracts, ceilings, obligations tracking', cat: 'governance' },
      { title: 'Decision Ledger', desc: 'Immutable approvals, justifications, timestamped actions', cat: 'governance' },
      { title: 'Audit Engine', desc: 'Evidence trails, compliance mapping, OIG-ready exports', cat: 'governance' },
      { title: 'Risk & Safeguards', desc: 'Risk registry, misuse detection, human override', cat: 'governance' },
      { title: 'Transparency Hub', desc: 'Real-time visibility, cross-ministry dashboards', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS Module', desc: 'Human-in-the-loop oversight, decision authorization', cat: 'donor' },
      { title: 'Donor Dashboard', desc: 'Real-time program visibility, KPI tracking, IATI compliance', cat: 'donor' },
      { title: 'MEL & Evidence', desc: 'Indicators, evidence linkage, outcome verification', cat: 'donor' },
      { title: 'Reconstruction', desc: 'Post-conflict recovery, infrastructure rebuild', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI Administrator', desc: 'Ethical AI assistant — human authority enforced', cat: 'intelligence' },
      { title: 'Platform Status', desc: '99.97% uptime, real-time monitoring', cat: 'intelligence' },
    ],
    categories: { governance: 'Governance & Control', donor: 'Donor Oversight', intelligence: 'Intelligence' },
    search: { placeholder: 'Search modules...', results: 'results', noResults: 'No results found' }
  },
  ua: {
    governance: [
      { title: 'Ядро управління', desc: 'Повноваження, ролі, делегування, інституційний контроль', cat: 'governance' },
      { title: 'Реєстр програм', desc: 'Програми, контракти, ліміти, відстеження зобов\'язань', cat: 'governance' },
      { title: 'Реєстр рішень', desc: 'Незмінні затвердження, обґрунтування, дії з позначкою часу', cat: 'governance' },
      { title: 'Модуль аудиту', desc: 'Сліди доказів, відповідність, експорт для OIG', cat: 'governance' },
      { title: 'Ризики та захист', desc: 'Реєстр ризиків, виявлення зловживань, людський контроль', cat: 'governance' },
      { title: 'Центр прозорості', desc: 'Видимість в реальному часі, міжміністерські панелі', cat: 'governance' },
    ],
    donor: [
      { title: 'Модуль HBS', desc: 'Нагляд з людиною в циклі, авторизація рішень', cat: 'donor' },
      { title: 'Панель донорів', desc: 'Видимість програм в реальному часі, відстеження KPI, відповідність IATI', cat: 'donor' },
      { title: 'MEL та докази', desc: 'Індикатори, зв\'язок доказів, перевірка результатів', cat: 'donor' },
      { title: 'Реконструкція', desc: 'Відновлення після конфлікту, відбудова інфраструктури', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI Адміністратор', desc: 'Етичний AI асистент — людський контроль забезпечено', cat: 'intelligence' },
      { title: 'Статус платформи', desc: '99.97% час роботи, моніторинг в реальному часі', cat: 'intelligence' },
    ],
    categories: { governance: 'Управління та контроль', donor: 'Донорський нагляд', intelligence: 'Інтелект' },
    search: { placeholder: 'Пошук модулів...', results: 'результатів', noResults: 'Нічого не знайдено' }
  },
  de: {
    governance: [
      { title: 'Governance-Kern', desc: 'Befugnisse, Rollen, Delegierung, institutionelle Kontrolle', cat: 'governance' },
      { title: 'Programmregister', desc: 'Programme, Verträge, Obergrenzen, Verpflichtungsverfolgung', cat: 'governance' },
      { title: 'Entscheidungsregister', desc: 'Unveränderliche Genehmigungen, Begründungen, zeitgestempelte Aktionen', cat: 'governance' },
      { title: 'Audit-Engine', desc: 'Beweispfade, Compliance-Mapping, OIG-bereite Exporte', cat: 'governance' },
      { title: 'Risiko & Schutz', desc: 'Risikoregister, Missbrauchserkennung, menschliche Überschreibung', cat: 'governance' },
      { title: 'Transparenz-Hub', desc: 'Echtzeit-Sichtbarkeit, ministerienübergreifende Dashboards', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS-Modul', desc: 'Aufsicht mit Mensch in der Schleife, Entscheidungsautorisierung', cat: 'donor' },
      { title: 'Geber-Dashboard', desc: 'Echtzeit-Programmsichtbarkeit, KPI-Tracking, IATI-Konformität', cat: 'donor' },
      { title: 'MEL & Beweise', desc: 'Indikatoren, Beweisverknüpfung, Ergebnisüberprüfung', cat: 'donor' },
      { title: 'Wiederaufbau', desc: 'Nachkonflikt-Wiederherstellung, Infrastrukturaufbau', cat: 'donor' },
    ],
    intelligence: [
      { title: 'KI-Administrator', desc: 'Ethischer KI-Assistent — menschliche Autorität durchgesetzt', cat: 'intelligence' },
      { title: 'Plattformstatus', desc: '99.97% Verfügbarkeit, Echtzeit-Überwachung', cat: 'intelligence' },
    ],
    categories: { governance: 'Governance & Kontrolle', donor: 'Geber-Aufsicht', intelligence: 'Intelligenz' },
    search: { placeholder: 'Module suchen...', results: 'Ergebnisse', noResults: 'Keine Ergebnisse gefunden' }
  },
  fr: {
    governance: [
      { title: 'Noyau de gouvernance', desc: 'Autorité, rôles, délégation, contrôle institutionnel', cat: 'governance' },
      { title: 'Registre des programmes', desc: 'Programmes, contrats, plafonds, suivi des obligations', cat: 'governance' },
      { title: 'Registre des décisions', desc: 'Approbations immuables, justifications, actions horodatées', cat: 'governance' },
      { title: 'Moteur d\'audit', desc: 'Pistes de preuves, cartographie de conformité, exportations prêtes OIG', cat: 'governance' },
      { title: 'Risques et protections', desc: 'Registre des risques, détection d\'abus, remplacement humain', cat: 'governance' },
      { title: 'Hub de transparence', desc: 'Visibilité en temps réel, tableaux de bord interministériels', cat: 'governance' },
    ],
    donor: [
      { title: 'Module HBS', desc: 'Supervision avec humain dans la boucle, autorisation de décision', cat: 'donor' },
      { title: 'Tableau de bord des donateurs', desc: 'Visibilité du programme en temps réel, suivi KPI, conformité IATI', cat: 'donor' },
      { title: 'MEL et preuves', desc: 'Indicateurs, liaison de preuves, vérification des résultats', cat: 'donor' },
      { title: 'Reconstruction', desc: 'Récupération post-conflit, reconstruction d\'infrastructure', cat: 'donor' },
    ],
    intelligence: [
      { title: 'Administrateur IA', desc: 'Assistant IA éthique — autorité humaine appliquée', cat: 'intelligence' },
      { title: 'État de la plateforme', desc: '99.97% de disponibilité, surveillance en temps réel', cat: 'intelligence' },
    ],
    categories: { governance: 'Gouvernance et contrôle', donor: 'Surveillance des donateurs', intelligence: 'Intelligence' },
    search: { placeholder: 'Rechercher des modules...', results: 'résultats', noResults: 'Aucun résultat trouvé' }
  },
  es: {
    governance: [
      { title: 'Núcleo de gobernanza', desc: 'Autoridad, roles, delegación, control institucional', cat: 'governance' },
      { title: 'Registro de programas', desc: 'Programas, contratos, techos, seguimiento de obligaciones', cat: 'governance' },
      { title: 'Registro de decisiones', desc: 'Aprobaciones inmutables, justificaciones, acciones con marca de tiempo', cat: 'governance' },
      { title: 'Motor de auditoría', desc: 'Rastros de evidencia, mapeo de cumplimiento, exportaciones listas para OIG', cat: 'governance' },
      { title: 'Riesgos y salvaguardias', desc: 'Registro de riesgos, detección de uso indebido, anulación humana', cat: 'governance' },
      { title: 'Centro de transparencia', desc: 'Visibilidad en tiempo real, paneles interministeriales', cat: 'governance' },
    ],
    donor: [
      { title: 'Módulo HBS', desc: 'Supervisión con humano en el bucle, autorización de decisión', cat: 'donor' },
      { title: 'Panel de donantes', desc: 'Visibilidad del programa en tiempo real, seguimiento de KPI, cumplimiento IATI', cat: 'donor' },
      { title: 'MEL y evidencia', desc: 'Indicadores, vinculación de evidencia, verificación de resultados', cat: 'donor' },
      { title: 'Reconstrucción', desc: 'Recuperación posconflicto, reconstrucción de infraestructura', cat: 'donor' },
    ],
    intelligence: [
      { title: 'Administrador IA', desc: 'Asistente IA ético — autoridad humana aplicada', cat: 'intelligence' },
      { title: 'Estado de la plataforma', desc: '99.97% de disponibilidad, monitoreo en tiempo real', cat: 'intelligence' },
    ],
    categories: { governance: 'Gobernanza y control', donor: 'Supervisión de donantes', intelligence: 'Inteligencia' },
    search: { placeholder: 'Buscar módulos...', results: 'resultados', noResults: 'No se encontraron resultados' }
  },
  it: {
    governance: [
      { title: 'Nucleo di governance', desc: 'Autorità, ruoli, delegazione, controllo istituzionale', cat: 'governance' },
      { title: 'Registro dei programmi', desc: 'Programmi, contratti, massimali, tracciamento obbligazioni', cat: 'governance' },
      { title: 'Registro delle decisioni', desc: 'Approvazioni immutabili, giustificazioni, azioni con timestamp', cat: 'governance' },
      { title: 'Motore di audit', desc: 'Tracce di prove, mappatura conformità, esportazioni pronte OIG', cat: 'governance' },
      { title: 'Rischi e protezioni', desc: 'Registro rischi, rilevamento abusi, override umano', cat: 'governance' },
      { title: 'Hub di trasparenza', desc: 'Visibilità in tempo reale, dashboard interministeriali', cat: 'governance' },
    ],
    donor: [
      { title: 'Modulo HBS', desc: 'Supervisione con umano nel ciclo, autorizzazione decisionale', cat: 'donor' },
      { title: 'Dashboard donatori', desc: 'Visibilità programma in tempo reale, tracking KPI, conformità IATI', cat: 'donor' },
      { title: 'MEL e prove', desc: 'Indicatori, collegamento prove, verifica risultati', cat: 'donor' },
      { title: 'Ricostruzione', desc: 'Recupero post-conflitto, ricostruzione infrastrutture', cat: 'donor' },
    ],
    intelligence: [
      { title: 'Amministratore IA', desc: 'Assistente IA etico — autorità umana applicata', cat: 'intelligence' },
      { title: 'Stato piattaforma', desc: '99.97% disponibilità, monitoraggio in tempo reale', cat: 'intelligence' },
    ],
    categories: { governance: 'Governance e controllo', donor: 'Supervisione donatori', intelligence: 'Intelligenza' },
    search: { placeholder: 'Cerca moduli...', results: 'risultati', noResults: 'Nessun risultato trovato' }
  },
  pl: {
    governance: [
      { title: 'Rdzeń zarządzania', desc: 'Uprawnienia, role, delegowanie, kontrola instytucjonalna', cat: 'governance' },
      { title: 'Rejestr programów', desc: 'Programy, umowy, pułapy, śledzenie zobowiązań', cat: 'governance' },
      { title: 'Rejestr decyzji', desc: 'Niezmienne zatwierdzenia, uzasadnienia, działania z znacznikiem czasu', cat: 'governance' },
      { title: 'Silnik audytu', desc: 'Ślady dowodów, mapowanie zgodności, eksporty gotowe dla OIG', cat: 'governance' },
      { title: 'Ryzyko i zabezpieczenia', desc: 'Rejestr ryzyk, wykrywanie nadużyć, nadpisanie przez człowieka', cat: 'governance' },
      { title: 'Hub przejrzystości', desc: 'Widoczność w czasie rzeczywistym, pulpity międzyministerialne', cat: 'governance' },
    ],
    donor: [
      { title: 'Moduł HBS', desc: 'Nadzór z człowiekiem w pętli, autoryzacja decyzji', cat: 'donor' },
      { title: 'Panel darczyńców', desc: 'Widoczność programu w czasie rzeczywistym, śledzenie KPI, zgodność IATI', cat: 'donor' },
      { title: 'MEL i dowody', desc: 'Wskaźniki, powiązanie dowodów, weryfikacja wyników', cat: 'donor' },
      { title: 'Odbudowa', desc: 'Odzyskiwanie po konflikcie, przebudowa infrastruktury', cat: 'donor' },
    ],
    intelligence: [
      { title: 'Administrator AI', desc: 'Etyczny asystent AI — wymuszony autorytet ludzki', cat: 'intelligence' },
      { title: 'Status platformy', desc: '99.97% dostępności, monitorowanie w czasie rzeczywistym', cat: 'intelligence' },
    ],
    categories: { governance: 'Zarządzanie i kontrola', donor: 'Nadzór darczyńców', intelligence: 'Inteligencja' },
    search: { placeholder: 'Szukaj modułów...', results: 'wyników', noResults: 'Nie znaleziono wyników' }
  },
  cz: {
    governance: [
      { title: 'Jádro správy', desc: 'Oprávnění, role, delegování, institucionální kontrola', cat: 'governance' },
      { title: 'Registr programů', desc: 'Programy, smlouvy, stropy, sledování závazků', cat: 'governance' },
      { title: 'Registr rozhodnutí', desc: 'Neměnná schválení, zdůvodnění, časově označené akce', cat: 'governance' },
      { title: 'Auditní modul', desc: 'Stopy důkazů, mapování souladu, OIG exporty', cat: 'governance' },
      { title: 'Rizika a záruky', desc: 'Registr rizik, detekce zneužití, lidský zásah', cat: 'governance' },
      { title: 'Centrum transparentnosti', desc: 'Viditelnost v reálném čase, mezimisterské dashboardy', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS modul', desc: 'Dohled s člověkem ve smyčce, autorizace rozhodnutí', cat: 'donor' },
      { title: 'Panel dárců', desc: 'Viditelnost programu v reálném čase, sledování KPI, IATI', cat: 'donor' },
      { title: 'MEL a důkazy', desc: 'Indikátory, propojení důkazů, ověření výsledků', cat: 'donor' },
      { title: 'Rekonstrukce', desc: 'Obnova po konfliktu, přestavba infrastruktury', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI administrátor', desc: 'Etický AI asistent — lidská autorita vynucena', cat: 'intelligence' },
      { title: 'Stav platformy', desc: '99.97% dostupnost, monitorování v reálném čase', cat: 'intelligence' },
    ],
    categories: { governance: 'Správa a kontrola', donor: 'Dohled dárců', intelligence: 'Inteligence' },
    search: { placeholder: 'Hledat moduly...', results: 'výsledků', noResults: 'Žádné výsledky' }
  },
  bg: {
    governance: [
      { title: 'Ядро на управлението', desc: 'Оторизация, роли, делегиране, институционален контрол', cat: 'governance' },
      { title: 'Регистър на програмите', desc: 'Програми, договори, тавани, проследяване на задълженията', cat: 'governance' },
      { title: 'Регистър на решенията', desc: 'Неизменни одобрения, обосновки, действия с времеви печат', cat: 'governance' },
      { title: 'Одитен двигател', desc: 'Следи от доказателства, картографиране на съответствието, OIG експорти', cat: 'governance' },
      { title: 'Рискове и предпазни мерки', desc: 'Регистър на рисковете, откриване на злоупотреба, човешки контрол', cat: 'governance' },
      { title: 'Център за прозрачност', desc: 'Видимост в реално време, междуминистерски табла', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS модул', desc: 'Надзор с човек в цикъла, оторизация на решения', cat: 'donor' },
      { title: 'Табло на донорите', desc: 'Видимост на програмата в реално време, проследяване на KPI, IATI', cat: 'donor' },
      { title: 'MEL и доказателства', desc: 'Индикатори, свързване на доказателства, проверка на резултатите', cat: 'donor' },
      { title: 'Реконструкция', desc: 'Възстановяване след конфликт, възстановяване на инфраструктурата', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI администратор', desc: 'Етичен AI асистент — човешки авторитет наложен', cat: 'intelligence' },
      { title: 'Състояние на платформата', desc: '99.97% достъпност, мониторинг в реално време', cat: 'intelligence' },
    ],
    categories: { governance: 'Управление и контрол', donor: 'Надзор на донорите', intelligence: 'Интелигентност' },
    search: { placeholder: 'Търсене на модули...', results: 'резултата', noResults: 'Няма резултати' }
  },
  rs: {
    governance: [
      { title: 'Језгро управљања', desc: 'Ауторизација, улоге, делегирање, институционална контрола', cat: 'governance' },
      { title: 'Регистар програма', desc: 'Програми, уговори, плафони, праћење обавеза', cat: 'governance' },
      { title: 'Регистар одлука', desc: 'Непроменљива одобрења, образложења, акције са временским печатом', cat: 'governance' },
      { title: 'Ревизијски мотор', desc: 'Трагови доказа, мапирање усклађености, OIG експорти', cat: 'governance' },
      { title: 'Ризици и заштита', desc: 'Регистар ризика, откривање злоупотребе, људска контрола', cat: 'governance' },
      { title: 'Центар транспарентности', desc: 'Видљивост у реалном времену, међуминистарске табле', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS модул', desc: 'Надзор са човеком у петљи, ауторизација одлука', cat: 'donor' },
      { title: 'Табла донатора', desc: 'Видљивост програма у реалном времену, праћење KPI, IATI', cat: 'donor' },
      { title: 'MEL и докази', desc: 'Индикатори, повезивање доказа, верификација резултата', cat: 'donor' },
      { title: 'Реконструкција', desc: 'Опоравак након конфликта, обнова инфраструктуре', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI администратор', desc: 'Етички AI асистент — људски ауторитет наметнут', cat: 'intelligence' },
      { title: 'Статус платформе', desc: '99.97% доступност, праћење у реалном времену', cat: 'intelligence' },
    ],
    categories: { governance: 'Управљање и контрола', donor: 'Надзор донатора', intelligence: 'Интелигенција' },
    search: { placeholder: 'Претрага модула...', results: 'резултата', noResults: 'Нема резултата' }
  },
  al: {
    governance: [
      { title: 'Bërthama e qeverisjes', desc: 'Autorizimi, rolet, delegimi, kontrolli institucional', cat: 'governance' },
      { title: 'Regjistri i programeve', desc: 'Programet, kontratat, tavanët, gjurmimi i detyrimeve', cat: 'governance' },
      { title: 'Regjistri i vendimeve', desc: 'Aprovime të pandryshme, arsyetime, veprime me vulë kohore', cat: 'governance' },
      { title: 'Motori i auditimit', desc: 'Gjurmë provash, hartëzimi i përputhshmërisë, eksportet OIG', cat: 'governance' },
      { title: 'Rreziqet dhe mbrojtjet', desc: 'Regjistri i rreziqeve, zbulimi i keqpërdorimit, kontrolli human', cat: 'governance' },
      { title: 'Qendra e transparencës', desc: 'Dukshmëri në kohë reale, panele ndërministrore', cat: 'governance' },
    ],
    donor: [
      { title: 'Moduli HBS', desc: 'Mbikëqyrje me njeri në lak, autorizim vendimesh', cat: 'donor' },
      { title: 'Paneli i donatorëve', desc: 'Dukshmëria e programit në kohë reale, gjurmimi i KPI, IATI', cat: 'donor' },
      { title: 'MEL dhe prova', desc: 'Tregues, lidhje provash, verifikimi i rezultateve', cat: 'donor' },
      { title: 'Rindërtimi', desc: 'Rikuperimi pas konfliktit, rindërtimi i infrastrukturës', cat: 'donor' },
    ],
    intelligence: [
      { title: 'Administratori AI', desc: 'Asistent AI etik — autoriteti human i zbatuar', cat: 'intelligence' },
      { title: 'Statusi i platformës', desc: '99.97% disponueshmëri, monitorim në kohë reale', cat: 'intelligence' },
    ],
    categories: { governance: 'Qeverisja dhe kontrolli', donor: 'Mbikëqyrja e donatorëve', intelligence: 'Inteligjenca' },
    search: { placeholder: 'Kërko module...', results: 'rezultate', noResults: 'Nuk ka rezultate' }
  },
  lv: {
    governance: [
      { title: 'Pārvaldības kodols', desc: 'Pilnvaras, lomas, deleģēšana, institucionālā kontrole', cat: 'governance' },
      { title: 'Programmu reģistrs', desc: 'Programmas, līgumi, griesti, saistību izsekošana', cat: 'governance' },
      { title: 'Lēmumu reģistrs', desc: 'Nemainīgi apstiprinājumi, pamatojumi, laikā atzīmētas darbības', cat: 'governance' },
      { title: 'Revīzijas dzinējs', desc: 'Pierādījumu pēdas, atbilstības kartēšana, OIG eksporti', cat: 'governance' },
      { title: 'Riski un aizsardzība', desc: 'Risku reģistrs, ļaunprātīgas izmantošanas noteikšana, cilvēka kontrole', cat: 'governance' },
      { title: 'Pārredzamības centrs', desc: 'Redzamība reāllaikā, starpministriju paneļi', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS modulis', desc: 'Uzraudzība ar cilvēku ciklā, lēmumu autorizācija', cat: 'donor' },
      { title: 'Donoru panelis', desc: 'Programmas redzamība reāllaikā, KPI izsekošana, IATI', cat: 'donor' },
      { title: 'MEL un pierādījumi', desc: 'Rādītāji, pierādījumu saistīšana, rezultātu pārbaude', cat: 'donor' },
      { title: 'Rekonstrukcija', desc: 'Atjaunošana pēc konflikta, infrastruktūras atjaunošana', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI administrators', desc: 'Ētisks AI asistents — cilvēka autoritāte izpildīta', cat: 'intelligence' },
      { title: 'Platformas statuss', desc: '99.97% pieejamība, uzraudzība reāllaikā', cat: 'intelligence' },
    ],
    categories: { governance: 'Pārvaldība un kontrole', donor: 'Donoru uzraudzība', intelligence: 'Inteliģence' },
    search: { placeholder: 'Meklēt moduļus...', results: 'rezultāti', noResults: 'Nav rezultātu' }
  },
  lt: {
    governance: [
      { title: 'Valdymo branduolys', desc: 'Įgaliojimai, vaidmenys, delegavimas, institucinė kontrolė', cat: 'governance' },
      { title: 'Programų registras', desc: 'Programos, sutartys, lubos, įsipareigojimų stebėjimas', cat: 'governance' },
      { title: 'Sprendimų registras', desc: 'Nekeičiami patvirtinimai, pagrindimas, laiko žymomis pažymėti veiksmai', cat: 'governance' },
      { title: 'Audito variklis', desc: 'Įrodymų pėdsakai, atitikties žymėjimas, OIG eksportai', cat: 'governance' },
      { title: 'Rizikos ir apsauga', desc: 'Rizikų registras, piktnaudžiavimo nustatymas, žmogaus kontrolė', cat: 'governance' },
      { title: 'Skaidrumo centras', desc: 'Matomumas realiuoju laiku, tarpministriniai skydeliai', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS modulis', desc: 'Priežiūra su žmogumi kilpoje, sprendimų autorizacija', cat: 'donor' },
      { title: 'Donorų skydelis', desc: 'Programos matomumas realiuoju laiku, KPI stebėjimas, IATI', cat: 'donor' },
      { title: 'MEL ir įrodymai', desc: 'Rodikliai, įrodymų susiejimas, rezultatų tikrinimas', cat: 'donor' },
      { title: 'Atstatymas', desc: 'Atkūrimas po konflikto, infrastruktūros atstatymas', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI administratorius', desc: 'Etiškas AI asistentas — žmogaus autoritetas vykdomas', cat: 'intelligence' },
      { title: 'Platformos būsena', desc: '99.97% prieinamumas, stebėjimas realiuoju laiku', cat: 'intelligence' },
    ],
    categories: { governance: 'Valdymas ir kontrolė', donor: 'Donorių priežiūra', intelligence: 'Inteligencija' },
    search: { placeholder: 'Ieškoti modulių...', results: 'rezultatai', noResults: 'Nerasta rezultatų' }
  },
  ee: {
    governance: [
      { title: 'Valitsemise tuum', desc: 'Volitused, rollid, delegeerimine, institutsiooniline kontroll', cat: 'governance' },
      { title: 'Programmide register', desc: 'Programmid, lepingud, laed, kohustuste jälgimine', cat: 'governance' },
      { title: 'Otsuste register', desc: 'Muutumatud kinnitused, põhjendused, ajatembliga tegevused', cat: 'governance' },
      { title: 'Auditi mootor', desc: 'Tõendite jäljed, vastavuse kaardistamine, OIG ekspordid', cat: 'governance' },
      { title: 'Riskid ja kaitsemeetmed', desc: 'Riskide register, kuritarvitamise tuvastamine, inimese kontroll', cat: 'governance' },
      { title: 'Läbipaistvuse keskus', desc: 'Nähtavus reaalajas, ministeeriumi vahelised paneelid', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS moodul', desc: 'Järelevalve inimesega silmuses, otsuste autoriseerimine', cat: 'donor' },
      { title: 'Doonorite paneel', desc: 'Programmi nähtavus reaalajas, KPI jälgimine, IATI', cat: 'donor' },
      { title: 'MEL ja tõendid', desc: 'Näitajad, tõendite sidumine, tulemuste kontrollimine', cat: 'donor' },
      { title: 'Rekonstrueerimine', desc: 'Taastamine pärast konflikti, infrastruktuuri ülesehitamine', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI administraator', desc: 'Eetiline AI abiline — inimese autoriteet jõustatud', cat: 'intelligence' },
      { title: 'Platvormi staatus', desc: '99.97% kättesaadavus, jälgimine reaalajas', cat: 'intelligence' },
    ],
    categories: { governance: 'Valitsemine ja kontroll', donor: 'Doonorite järelevalve', intelligence: 'Intelligentsus' },
    search: { placeholder: 'Otsi mooduleid...', results: 'tulemust', noResults: 'Tulemusi ei leitud' }
  },
};

const baseHero = { 
  hero: { title: 'IVYAR Governance Platform', subtitle: 'Institutional governance infrastructure trusted by leading development institutions', origin: 'Built in the United States • Inspired by Ukraine • Designed for the world' }, 
  nav: { search: 'Search', menu: 'Menu' }, 
  badge: 'NATO-Aligned • World Bank Ready • USAID Compatible', 
  modules: { title: 'Institutional Infrastructure' }, 
  note: { title: 'Advanced operational capabilities available on request', desc: 'Procurement, logistics, emergency services — demonstrated in live pilot sessions' },
  stats: {
    title: 'Trusted by Leading Institutions',
    uptime: { value: '99.97%', label: 'Platform Uptime', sublabel: 'NATO-grade reliability' },
    value: { value: '$115.8M', label: 'Total Project Value', sublabel: '6 active reconstruction projects' },
    jobs: { value: '1,247', label: 'Jobs Created', sublabel: 'Including 121 veterans employed' },
    served: { value: '450K', label: 'People Served', sublabel: 'By restored facilities' }
  },
  cta: {
    title: 'Ready to Modernize Governance Operations?',
    subtitle: 'Join leading institutions using IVYAR for secure, compliant, and ethical digital governance',
    demo: 'Request Demo',
    contact: 'Schedule Call'
  },
  footer: {
    tagline: 'Digital Public Infrastructure for Transparent Governance',
    links: { demo: 'Demo', docs: 'Documentation', contact: 'Contact', privacy: 'Privacy' },
    copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
  }
};

const TRANSLATIONS: Record<string, any> = {
  us: baseHero,
  gb: baseHero,
  eu: baseHero,
  
  ua: { 
    hero: { title: 'Платформа IVYAR', subtitle: 'Інституційна інфраструктура управління, якій довіряють провідні інституції розвитку', origin: 'Створено в США • Натхненно Україною • Призначено для світу' }, 
    nav: { search: 'Пошук', menu: 'Меню' }, 
    badge: 'NATO-сумісний • Готовий для Світового банку • Сумісний з USAID', 
    modules: { title: 'Інституційна інфраструктура' }, 
    note: { title: 'Розширені операційні можливості доступні за запитом', desc: 'Закупівлі, логістика, екстрені служби — демонструються в пілотних сесіях наживо' },
    stats: {
      title: 'Довіра провідних інституцій',
      uptime: { value: '99.97%', label: 'Час роботи платформи', sublabel: 'Надійність рівня NATO' },
      value: { value: '$115.8M', label: 'Загальна вартість проектів', sublabel: '6 активних проектів реконструкції' },
      jobs: { value: '1,247', label: 'Створено робочих місць', sublabel: 'Включно з 121 працевлаштованим ветераном' },
      served: { value: '450K', label: 'Обслуговано людей', sublabel: 'Відновленими об\'єктами' }
    },
    cta: {
      title: 'Готові модернізувати операції управління?',
      subtitle: 'Приєднуйтесь до провідних інституцій, які використовують IVYAR',
      demo: 'Запит демонстрації',
      contact: 'Запланувати дзвінок'
    },
    footer: {
      tagline: 'Цифрова публічна інфраструктура для прозорого управління',
      links: { demo: 'Демо', docs: 'Документація', contact: 'Контакти', privacy: 'Конфіденційність' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  de: { 
    hero: { title: 'IVYAR Plattform', subtitle: 'Institutionelle Governance-Infrastruktur, der führende Entwicklungsinstitutionen vertrauen', origin: 'Gebaut in den USA • Inspiriert von der Ukraine • Entworfen für die Welt' }, 
    nav: { search: 'Suchen', menu: 'Menü' }, 
    badge: 'NATO-konform • Weltbank-bereit • USAID-kompatibel', 
    modules: { title: 'Institutionelle Infrastruktur' }, 
    note: { title: 'Erweiterte operative Fähigkeiten auf Anfrage verfügbar', desc: 'Beschaffung, Logistik, Notfalldienste — in Live-Pilotsitzungen demonstriert' },
    stats: {
      title: 'Vertrauenswürdig bei führenden Institutionen',
      uptime: { value: '99.97%', label: 'Plattform-Verfügbarkeit', sublabel: 'NATO-Grad Zuverlässigkeit' },
      value: { value: '$115.8M', label: 'Gesamtprojektwert', sublabel: '6 aktive Wiederaufbauprojekte' },
      jobs: { value: '1,247', label: 'Geschaffene Arbeitsplätze', sublabel: 'Einschließlich 121 beschäftigter Veteranen' },
      served: { value: '450K', label: 'Betreute Menschen', sublabel: 'Durch restaurierte Einrichtungen' }
    },
    cta: {
      title: 'Bereit, Governance-Operationen zu modernisieren?',
      subtitle: 'Schließen Sie sich führenden Institutionen an, die IVYAR nutzen',
      demo: 'Demo anfordern',
      contact: 'Anruf vereinbaren'
    },
    footer: {
      tagline: 'Digitale öffentliche Infrastruktur für transparente Governance',
      links: { demo: 'Demo', docs: 'Dokumentation', contact: 'Kontakt', privacy: 'Datenschutz' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  fr: { 
    hero: { title: 'Plateforme IVYAR', subtitle: 'Infrastructure de gouvernance institutionnelle approuvée par les principales institutions de développement', origin: 'Construit aux États-Unis • Inspiré par l\'Ukraine • Conçu pour le monde' }, 
    nav: { search: 'Rechercher', menu: 'Menu' }, 
    badge: 'Conforme OTAN • Prêt Banque mondiale • Compatible USAID', 
    modules: { title: 'Infrastructure institutionnelle' }, 
    note: { title: 'Capacités opérationnelles avancées disponibles sur demande', desc: 'Approvisionnement, logistique, services d\'urgence — démontrés en sessions pilotes en direct' },
    stats: {
      title: 'De confiance auprès des principales institutions',
      uptime: { value: '99.97%', label: 'Disponibilité de la plateforme', sublabel: 'Fiabilité de niveau OTAN' },
      value: { value: '$115.8M', label: 'Valeur totale du projet', sublabel: '6 projets de reconstruction actifs' },
      jobs: { value: '1,247', label: 'Emplois créés', sublabel: 'Y compris 121 vétérans employés' },
      served: { value: '450K', label: 'Personnes servies', sublabel: 'Par les installations restaurées' }
    },
    cta: {
      title: 'Prêt à moderniser les opérations de gouvernance?',
      subtitle: 'Rejoignez les principales institutions utilisant IVYAR',
      demo: 'Demander une démo',
      contact: 'Planifier un appel'
    },
    footer: {
      tagline: 'Infrastructure publique numérique pour une gouvernance transparente',
      links: { demo: 'Démo', docs: 'Documentation', contact: 'Contact', privacy: 'Confidentialité' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  es: { 
    hero: { title: 'Plataforma IVYAR', subtitle: 'Infraestructura de gobernanza institucional confiable para las principales instituciones de desarrollo', origin: 'Construido en Estados Unidos • Inspirado por Ucrania • Diseñado para el mundo' }, 
    nav: { search: 'Buscar', menu: 'Menú' }, 
    badge: 'Compatible con OTAN • Listo Banco Mundial • Compatible USAID', 
    modules: { title: 'Infraestructura institucional' }, 
    note: { title: 'Capacidades operativas avanzadas disponibles bajo solicitud', desc: 'Adquisiciones, logística, servicios de emergencia — demostrados en sesiones piloto en vivo' },
    stats: {
      title: 'Confiable por instituciones líderes',
      uptime: { value: '99.97%', label: 'Disponibilidad de la plataforma', sublabel: 'Confiabilidad de grado OTAN' },
      value: { value: '$115.8M', label: 'Valor total del proyecto', sublabel: '6 proyectos de reconstrucción activos' },
      jobs: { value: '1,247', label: 'Empleos creados', sublabel: 'Incluyendo 121 veteranos empleados' },
      served: { value: '450K', label: 'Personas atendidas', sublabel: 'Por instalaciones restauradas' }
    },
    cta: {
      title: '¿Listo para modernizar las operaciones de gobernanza?',
      subtitle: 'Únase a las instituciones líderes que utilizan IVYAR',
      demo: 'Solicitar demo',
      contact: 'Programar llamada'
    },
    footer: {
      tagline: 'Infraestructura pública digital para gobernanza transparente',
      links: { demo: 'Demo', docs: 'Documentación', contact: 'Contacto', privacy: 'Privacidad' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  it: { 
    hero: { title: 'Piattaforma IVYAR', subtitle: 'Infrastruttura di governance istituzionale fidata dalle principali istituzioni di sviluppo', origin: 'Costruito negli Stati Uniti • Ispirato dall\'Ucraina • Progettato per il mondo' }, 
    nav: { search: 'Cerca', menu: 'Menu' }, 
    badge: 'Conforme NATO • Pronto Banca Mondiale • Compatibile USAID', 
    modules: { title: 'Infrastruttura istituzionale' }, 
    note: { title: 'Capacità operative avanzate disponibili su richiesta', desc: 'Appalti, logistica, servizi di emergenza — dimostrati in sessioni pilota dal vivo' },
    stats: {
      title: 'Affidabile dalle principali istituzioni',
      uptime: { value: '99.97%', label: 'Disponibilità della piattaforma', sublabel: 'Affidabilità di livello NATO' },
      value: { value: '$115.8M', label: 'Valore totale del progetto', sublabel: '6 progetti di ricostruzione attivi' },
      jobs: { value: '1,247', label: 'Posti di lavoro creati', sublabel: 'Compresi 121 veterani impiegati' },
      served: { value: '450K', label: 'Persone servite', sublabel: 'Da strutture restaurate' }
    },
    cta: {
      title: 'Pronto a modernizzare le operazioni di governance?',
      subtitle: 'Unisciti alle principali istituzioni che utilizzano IVYAR',
      demo: 'Richiedi demo',
      contact: 'Pianifica chiamata'
    },
    footer: {
      tagline: 'Infrastruttura pubblica digitale per governance trasparente',
      links: { demo: 'Demo', docs: 'Documentazione', contact: 'Contatto', privacy: 'Privacy' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  pl: { 
    hero: { title: 'Platforma IVYAR', subtitle: 'Infrastruktura zarządzania instytucjonalnego zaufana przez wiodące instytucje rozwojowe', origin: 'Zbudowano w USA • Zainspirowano Ukrainą • Zaprojektowano dla świata' }, 
    nav: { search: 'Szukaj', menu: 'Menu' }, 
    badge: 'Zgodny z NATO • Gotowy dla Banku Światowego • Kompatybilny z USAID', 
    modules: { title: 'Infrastruktura instytucjonalna' }, 
    note: { title: 'Zaawansowane możliwości operacyjne dostępne na żądanie', desc: 'Zamówienia, logistyka, usługi ratunkowe — zademonstrowane w sesjach pilotażowych na żywo' },
    stats: {
      title: 'Zaufany przez wiodące instytucje',
      uptime: { value: '99.97%', label: 'Dostępność platformy', sublabel: 'Niezawodność na poziomie NATO' },
      value: { value: '$115.8M', label: 'Całkowita wartość projektu', sublabel: '6 aktywnych projektów odbudowy' },
      jobs: { value: '1,247', label: 'Utworzone miejsca pracy', sublabel: 'W tym 121 zatrudnionych weteranów' },
      served: { value: '450K', label: 'Obsłużone osoby', sublabel: 'Przez odnowione obiekty' }
    },
    cta: {
      title: 'Gotowy do modernizacji operacji zarządzania?',
      subtitle: 'Dołącz do wiodących instytucji korzystających z IVYAR',
      demo: 'Poproś o demo',
      contact: 'Zaplanuj rozmowę'
    },
    footer: {
      tagline: 'Cyfrowa infrastruktura publiczna dla przejrzystego zarządzania',
      links: { demo: 'Demo', docs: 'Dokumentacja', contact: 'Kontakt', privacy: 'Prywatność' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  cz: { 
    hero: { title: 'Platforma IVYAR', subtitle: 'Institucionální infrastruktura řízení důvěryhodná předními rozvojovými institucemi', origin: 'Postaveno v USA • Inspirováno Ukrajinou • Navrženo pro svět' }, 
    nav: { search: 'Hledat', menu: 'Menu' }, 
    badge: 'Kompatibilní s NATO • Připraveno pro Světovou banku • Kompatibilní s USAID', 
    modules: { title: 'Institucionální infrastruktura' }, 
    note: { title: 'Pokročilé operační schopnosti k dispozici na vyžádání', desc: 'Nákupy, logistika, záchranné služby — demonstrovány v živých pilotních sezeních' },
    stats: {
      title: 'Důvěryhodné předními institucemi',
      uptime: { value: '99.97%', label: 'Dostupnost platformy', sublabel: 'Spolehlivost stupně NATO' },
      value: { value: '$115.8M', label: 'Celková hodnota projektu', sublabel: '6 aktivních projektů rekonstrukce' },
      jobs: { value: '1,247', label: 'Vytvořená pracovní místa', sublabel: 'Včetně 121 zaměstnaných veteránů' },
      served: { value: '450K', label: 'Obsluhovaných lidí', sublabel: 'Obnoveným zařízením' }
    },
    cta: {
      title: 'Připraveni modernizovat operace řízení?',
      subtitle: 'Připojte se k předním institucím používajícím IVYAR',
      demo: 'Požádat o demo',
      contact: 'Naplánovat hovor'
    },
    footer: {
      tagline: 'Digitální veřejná infrastruktura pro transparentní správu',
      links: { demo: 'Demo', docs: 'Dokumentace', contact: 'Kontakt', privacy: 'Soukromí' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  bg: { 
    hero: { title: 'Платформа IVYAR', subtitle: 'Институционална инфраструктура за управление, на която се доверяват водещи институции за развитие', origin: 'Изградено в САЩ • Вдъхновено от Украйна • Проектирано за света' }, 
    nav: { search: 'Търсене', menu: 'Меню' }, 
    badge: 'Съвместимо с НАТО • Готово за Световната банка • Съвместимо с USAID', 
    modules: { title: 'Институционална инфраструктура' }, 
    note: { title: 'Разширени оперативни възможности при поискване', desc: 'Доставки, логистика, спешни услуги — демонстрирани в пилотни сесии на живо' },
    stats: {
      title: 'Доверена от водещи институции',
      uptime: { value: '99.97%', label: 'Достъпност на платформата', sublabel: 'Надеждност от степен на НАТО' },
      value: { value: '$115.8M', label: 'Обща стойност на проекта', sublabel: '6 активни проекта за реконструкция' },
      jobs: { value: '1,247', label: 'Създадени работни места', sublabel: 'Включително 121 наети ветерани' },
      served: { value: '450K', label: 'Обслужени хора', sublabel: 'От възстановени съоръжения' }
    },
    cta: {
      title: 'Готови ли сте да модернизирате операциите по управлението?',
      subtitle: 'Присъединете се към водещите институции, използващи IVYAR',
      demo: 'Заявка за демо',
      contact: 'Планиране на разговор'
    },
    footer: {
      tagline: 'Цифрова публична инфраструктура за прозрачно управление',
      links: { demo: 'Демо', docs: 'Документация', contact: 'Контакт', privacy: 'Поверителност' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  rs: { 
    hero: { title: 'Платформа IVYAR', subtitle: 'Институционална инфраструктура управљања којој верују водеће развојне институције', origin: 'Изграђено у САД • Инспирисано Украјином • Дизајнирано за свет' }, 
    nav: { search: 'Претрага', menu: 'Мени' }, 
    badge: 'Компатибилан са НАТО • Спреман за Светску банку • Компатибилан са USAID', 
    modules: { title: 'Институционална инфраструктура' }, 
    note: { title: 'Напредне оперативне могућности доступне на захтев', desc: 'Набавке, логистика, хитне службе — демонстрирано у пилот сесијама уживо' },
    stats: {
      title: 'Поуздан од стране водећих институција',
      uptime: { value: '99.97%', label: 'Доступност платформе', sublabel: 'Поузданост НАТО нивоа' },
      value: { value: '$115.8M', label: 'Укупна вредност пројекта', sublabel: '6 активних пројеката реконструкције' },
      jobs: { value: '1,247', label: 'Отворених радних места', sublabel: 'Укључујући 121 запосленог ветерана' },
      served: { value: '450K', label: 'Опслужених људи', sublabel: 'Обновљеним објектима' }
    },
    cta: {
      title: 'Спремни за модернизацију операција управљања?',
      subtitle: 'Придружите се водећим институцијама које користе IVYAR',
      demo: 'Захтев за демо',
      contact: 'Заказивање позива'
    },
    footer: {
      tagline: 'Дигитална јавна инфраструктура за транспарентно управљање',
      links: { demo: 'Демо', docs: 'Документација', contact: 'Контакт', privacy: 'Приватност' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  al: { 
    hero: { title: 'Platforma IVYAR', subtitle: 'Infrastrukturë institucionale e qeverisjes e besuar nga institucionet kryesore të zhvillimit', origin: 'Ndërtuar në SHBA • I frymëzuar nga Ukraina • Projektuar për botën' }, 
    nav: { search: 'Kërko', menu: 'Meny' }, 
    badge: 'I përputhshëm me NATO • Gati për Bankën Botërore • I përputhshëm me USAID', 
    modules: { title: 'Infrastrukturë institucionale' }, 
    note: { title: 'Aftësi operacionale të avancuara të disponueshme me kërkesë', desc: 'Prokurimi, logjistika, shërbime emergjente — të demonstruara në sesione pilote drejtpërdrejt' },
    stats: {
      title: 'I besuar nga institucionet kryesore',
      uptime: { value: '99.97%', label: 'Disponueshmëria e platformës', sublabel: 'Besueshmëri e nivelit të NATO-s' },
      value: { value: '$115.8M', label: 'Vlera totale e projektit', sublabel: '6 projekte aktive rindërtimi' },
      jobs: { value: '1,247', label: 'Vende pune të krijuara', sublabel: 'Duke përfshirë 121 veteranë të punësuar' },
      served: { value: '450K', label: 'Njerëz të shërbyer', sublabel: 'Nga objektet e restauruara' }
    },
    cta: {
      title: 'Gati për të modernizuar operacionet e qeverisjes?',
      subtitle: 'Bashkohuni me institucionet kryesore që përdorin IVYAR',
      demo: 'Kërkoni Demo',
      contact: 'Planifikoni thirrje'
    },
    footer: {
      tagline: 'Infrastrukturë publike digjitale për qeverisje transparente',
      links: { demo: 'Demo', docs: 'Dokumentacion', contact: 'Kontakt', privacy: 'Privatësi' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  lv: { 
    hero: { title: 'IVYAR platforma', subtitle: 'Institucionālā pārvaldības infrastruktūra, kurai uzticas vadošās attīstības institūcijas', origin: 'Uzbūvēts ASV • Iedvesmots no Ukrainas • Izstrādāts pasaulei' }, 
    nav: { search: 'Meklēt', menu: 'Izvēlne' }, 
    badge: 'Saderīgs ar NATO • Gatavs Pasaules bankai • Saderīgs ar USAID', 
    modules: { title: 'Institucionālā infrastruktūra' }, 
    note: { title: 'Paplašinātas darbības iespējas pieejamas pēc pieprasījuma', desc: 'Iepirkumi, loģistika, ārkārtas dienesti — demonstrēti pilotprojektu sesijās tiešraidē' },
    stats: {
      title: 'Uzticama vadošajām institūcijām',
      uptime: { value: '99.97%', label: 'Platformas pieejamība', sublabel: 'NATO līmeņa uzticamība' },
      value: { value: '$115.8M', label: 'Kopējā projekta vērtība', sublabel: '6 aktīvi rekonstrukcijas projekti' },
      jobs: { value: '1,247', label: 'Izveidotas darbavietas', sublabel: 'Ieskaitot 121 nodarbinātu veterānu' },
      served: { value: '450K', label: 'Apkalpoti cilvēki', sublabel: 'Ar atjaunotām iekārtām' }
    },
    cta: {
      title: 'Gatavi modernizēt pārvaldības darbības?',
      subtitle: 'Pievienojieties vadošajām institūcijām, kas izmanto IVYAR',
      demo: 'Pieprasīt demo',
      contact: 'Ieplānot zvanu'
    },
    footer: {
      tagline: 'Digitālā publiskā infrastruktūra pārredzamai pārvaldībai',
      links: { demo: 'Demo', docs: 'Dokumentācija', contact: 'Kontakti', privacy: 'Privātums' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  lt: { 
    hero: { title: 'IVYAR platforma', subtitle: 'Institucinė valdymo infrastruktūra, kuria pasitiki pirmaujančios vystymosi institucijos', origin: 'Pastatyta JAV • Įkvėpta Ukrainos • Sukurta pasauliui' }, 
    nav: { search: 'Ieškoti', menu: 'Meniu' }, 
    badge: 'Suderinamas su NATO • Pasirengęs Pasaulio bankui • Suderinamas su USAID', 
    modules: { title: 'Institucinė infrastruktūra' }, 
    note: { title: 'Išplėstinės veiklos galimybės prieinamos pagal užklausą', desc: 'Pirkimai, logistika, skubios tarnybos — pademonstruota bandomosiose sesijose tiesiogiai' },
    stats: {
      title: 'Patikima pirmaujančių institucijų',
      uptime: { value: '99.97%', label: 'Platformos prieinamumas', sublabel: 'NATO lygio patikimumas' },
      value: { value: '$115.8M', label: 'Bendra projekto vertė', sublabel: '6 aktyvūs rekonstrukcijos projektai' },
      jobs: { value: '1,247', label: 'Sukurta darbo vietų', sublabel: 'Įskaitant 121 įdarbintą veteraną' },
      served: { value: '450K', label: 'Aptarnauta žmonių', sublabel: 'Atnaujintomis įrenginiais' }
    },
    cta: {
      title: 'Pasiruošę modernizuoti valdymo operacijas?',
      subtitle: 'Prisijunkite prie pirmaujančių institucijų, naudojančių IVYAR',
      demo: 'Prašyti demo',
      contact: 'Planuoti skambutį'
    },
    footer: {
      tagline: 'Skaitmeninė viešoji infrastruktūra skaidriam valdymui',
      links: { demo: 'Demo', docs: 'Dokumentacija', contact: 'Kontaktai', privacy: 'Privatumas' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  ee: { 
    hero: { title: 'IVYAR platvorm', subtitle: 'Institutsiooniline valitsemise infrastruktuur, millele usaldavad juhtivad arenginstituutid', origin: 'Ehitatud USA-s • Inspireeritud Ukrainast • Loodud maailmale' }, 
    nav: { search: 'Otsi', menu: 'Menüü' }, 
    badge: 'NATO-ga ühilduv • Valmis Maailmapangale • USAID-iga ühilduv', 
    modules: { title: 'Institutsiooniline infrastruktuur' }, 
    note: { title: 'Täiustatud tegevusvõimalused saadaval taotluse korral', desc: 'Hanked, logistika, hädaabiteenused — näidatud pilootseansidel otse-eetris' },
    stats: {
      title: 'Usaldusväärne juhtivate institutsioonide poolt',
      uptime: { value: '99.97%', label: 'Platvormi kättesaadavus', sublabel: 'NATO taseme usaldusväärsus' },
      value: { value: '$115.8M', label: 'Projekti koguväärtus', sublabel: '6 aktiivset rekonstrueerimisprojekti' },
      jobs: { value: '1,247', label: 'Loodud töökohad', sublabel: 'Sealhulgas 121 tööle võetud veterani' },
      served: { value: '450K', label: 'Teenindatud inimesi', sublabel: 'Taastatud rajatistega' }
    },
    cta: {
      title: 'Valmis valitsemise operatsioone moderniseerima?',
      subtitle: 'Liituge juhtivate institutsioonidega, kes kasutavad IVYAR-i',
      demo: 'Taotle demo',
      contact: 'Planeeri kõne'
    },
    footer: {
      tagline: 'Digitaalne avalik infrastruktuur läbipaistvaks valitsemiseks',
      links: { demo: 'Demo', docs: 'Dokumentatsioon', contact: 'Kontaktid', privacy: 'Privaatsus' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
};

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark class="bg-[#3A8DFF]/30 text-[#3A8DFF] rounded px-1">${part}</mark>`
      : part
  ).join('');
};

const catColors = {
  governance: { bg: 'from-[#3A8DFF]/10 to-[#3A8DFF]/5', badge: 'bg-[#3A8DFF]/20 text-[#3A8DFF]' },
  donor: { bg: 'from-[#4CD3C2]/10 to-[#4CD3C2]/5', badge: 'bg-[#4CD3C2]/20 text-[#4CD3C2]' },
  intelligence: { bg: 'from-[#3CCB7F]/10 to-[#3CCB7F]/5', badge: 'bg-[#3CCB7F]/20 text-[#3CCB7F]' },
};

export default function HomePage() {
  const pathname = usePathname();
  const params = useParams();
  
  const locale = pathname?.split('/')[1] || params?.locale || 'us';
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const langRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[locale] || baseHero;
  const tm = MODULES_TRANSLATIONS[locale as keyof typeof MODULES_TRANSLATIONS] || MODULES_TRANSLATIONS.us;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { 
        e.preventDefault(); 
        setSearchOpen(true);
      }
      if (e.key === 'Escape') { 
        setSearchOpen(false); 
        setLangOpen(false); 
        setSelectedModule(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const allModules = [...tm.governance, ...tm.donor, ...tm.intelligence];
  const searchResults = searchQuery.trim()
    ? allModules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allModules;

  const availableLocales = locales.filter(l => 
    TRANSLATIONS[l.code] || MODULES_TRANSLATIONS[l.code as keyof typeof MODULES_TRANSLATIONS]
  );

  const currentLang = availableLocales.find(l => l.code === locale) || availableLocales[0];

  const handleModuleClick = (module: any) => {
    setSelectedModule(module);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-white">
      <nav className="sticky top-0 z-40 bg-[#0B0D0E]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#3A8DFF] to-[#4CD3C2] flex items-center justify-center font-bold text-sm sm:text-base">IV</div>
            <span className="font-bold text-lg sm:text-xl">IVYAR</span>
          </a>
          
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              <span>🔍</span><span>{t.nav.search}</span><span className="text-xs text-white/40">⌘K</span>
            </button>
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                {currentLang.flag} {locale.toUpperCase()} ▼
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#1A1D1F] border border-white/10 rounded-lg p-2 min-w-[200px] max-h-[400px] overflow-y-auto z-50 shadow-2xl">
                  {availableLocales.slice(0, 14).map(lang => (
                    <a 
                      key={lang.code} 
                      href={`/${lang.code}`} 
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-white/10 text-left transition-all ${locale === lang.code ? 'bg-[#3A8DFF]/20 text-[#3A8DFF]' : ''}`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <span className="text-xl">🔍</span>
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0B0D0E]">
            <div className="px-4 py-4 space-y-2">
              <div className="text-xs text-white/40 mb-2">{t.nav.menu}</div>
              {availableLocales.slice(0, 14).map(lang => (
                <a 
                  key={lang.code} 
                  href={`/${lang.code}`} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all ${locale === lang.code ? 'bg-[#3A8DFF]/20 text-[#3A8DFF]' : ''}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#3A8DFF]/10 border border-[#3A8DFF]/30 rounded-full text-[#4CD3C2] text-xs sm:text-sm font-semibold mb-4 sm:mb-6">{t.badge}</div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-[#3A8DFF] bg-clip-text text-transparent px-4">{t.hero.title}</h1>
        <p className="text-base sm:text-xl text-white/60 mb-3 sm:mb-4 max-w-3xl mx-auto px-4">{t.hero.subtitle}</p>
        <p className="text-xs sm:text-sm text-white/40 mb-8 sm:mb-12 px-4">{t.hero.origin}</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12 px-4">{t.stats.title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[t.stats.uptime, t.stats.value, t.stats.jobs, t.stats.served].map((stat, i) => (
            <div key={i} className="p-5 sm:p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#3A8DFF] to-[#4CD3C2] bg-clip-text text-transparent mb-2">{stat.value}</div>
              <div className="font-semibold text-white/90 mb-1 text-sm sm:text-base">{stat.label}</div>
              <div className="text-xs sm:text-sm text-white/50">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 px-4">{t.modules.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {allModules.slice(0, 6).map((m, i) => (
            <button 
              key={i} 
              onClick={() => handleModuleClick(m)}
              className={`p-5 sm:p-6 bg-gradient-to-br ${catColors[m.cat as keyof typeof catColors].bg} border border-white/10 rounded-xl hover:border-white/20 transition-all text-left w-full cursor-pointer active:scale-[0.98]`}
            >
              <h4 className="font-semibold text-base sm:text-lg mb-2">{m.title}</h4>
              <p className="text-white/60 text-sm">{m.desc}</p>
            </button>
          ))}
        </div>
        <div className="text-center p-5 sm:p-6 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-white/80 text-sm sm:text-base"><strong>{t.note.title}</strong></p>
          <p className="text-white/40 text-xs sm:text-sm mt-1">{t.note.desc}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-[#3A8DFF]/10 to-[#4CD3C2]/10 border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">{t.cta.title}</h2>
          <p className="text-base sm:text-xl text-white/60 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">{t.cta.subtitle}</p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-col sm:flex-row px-4">
            <a href="/demo" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#3A8DFF] rounded-lg hover:bg-[#2E7FED] transition-all font-semibold shadow-lg text-center active:scale-[0.98]">
              {t.cta.demo} →
            </a>
            <a href="/contact" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all font-semibold text-center active:scale-[0.98]">
              {t.cta.contact}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#3A8DFF] to-[#4CD3C2] flex items-center justify-center font-bold text-sm sm:text-base">IV</div>
              <div className="text-center md:text-left">
                <div className="font-bold text-sm sm:text-base">IVYAR</div>
                <div className="text-xs sm:text-sm text-white/40">{t.footer.tagline}</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/60">
              <a href="/demo" className="hover:text-white transition-all">{t.footer.links.demo}</a>
              <a href="/docs" className="hover:text-white transition-all">{t.footer.links.docs}</a>
              <a href="/contact" className="hover:text-white transition-all">{t.footer.links.contact}</a>
              <a href="/privacy" className="hover:text-white transition-all">{t.footer.links.privacy}</a>
            </div>
          </div>
          <div className="text-center text-xs sm:text-sm text-white/40 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5">
            {t.footer.copyright}
          </div>
        </div>
      </footer>

      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-20 sm:pt-32 px-4" onClick={() => setSearchOpen(false)}>
          <div className="bg-[#1A1D1F] border border-white/10 rounded-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center gap-3">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder={tm.search.placeholder} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="flex-1 bg-transparent text-white outline-none text-sm sm:text-base" 
                autoFocus 
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white">✕</button>}
            </div>
            {searchQuery && <div className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-white/40 border-b border-white/10">{searchResults.length} {tm.search.results}</div>}
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto p-2">
              {searchResults.length === 0 && searchQuery ? (
                <div className="p-6 sm:p-8 text-center text-white/40 text-sm">{tm.search.noResults}</div>
              ) : (
                searchResults.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => handleModuleClick(m)}
                    className="w-full text-left p-3 sm:p-4 hover:bg-white/5 rounded-lg cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <div className="font-semibold text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: highlightText(m.title, searchQuery) }} />
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${catColors[m.cat as keyof typeof catColors].badge}`}>
                        {tm.categories[m.cat as keyof typeof tm.categories]}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-white/60" dangerouslySetInnerHTML={{ __html: highlightText(m.desc, searchQuery) }} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedModule && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedModule(null)}>
          <div className={`bg-gradient-to-br ${catColors[selectedModule.cat as keyof typeof catColors].bg} border-2 border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <span className={`inline-block px-3 py-1 text-xs rounded-full ${catColors[selectedModule.cat as keyof typeof catColors].badge} mb-3`}>
                  {tm.categories[selectedModule.cat as keyof typeof tm.categories]}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">{selectedModule.title}</h2>
              </div>
              <button onClick={() => setSelectedModule(null)} className="text-white/40 hover:text-white text-2xl shrink-0">✕</button>
            </div>
            <p className="text-white/80 text-base sm:text-lg mb-6">{selectedModule.desc}</p>
            <button onClick={() => setSelectedModule(null)} className="w-full sm:w-auto px-6 py-3 bg-[#3A8DFF] rounded-lg hover:bg-[#2E7FED] transition-all active:scale-[0.98]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
