/**
 * Terms.Law Live Chat Widget - Premium Attorney Edition
 * Streamlined, click-driven experience - minimal typing required
 * Supports English, Russian, and Spanish
 */

(function() {
  'use strict';

  const API_BASE = 'https://template-generator-aob3.vercel.app/api/telegram-chat';
  const PHOTO_URL = 'https://template.terms.law/chat-widget/sergei_small.jpg';

  let isOpen = false;
  let currentStatus = 'away';
  let chatStarted = false;
  let visitorId = localStorage.getItem('termslaw_chat_id') || generateId();
  let visitorName = '';
  let visitorEmail = '';
  let visitorTopic = '';
  let visitorSubtopic = '';
  let lastMessageTimestamp = 0;
  let pollInterval = null;
  let step = 0; // 0: topic, 1: subtopic, 2: chat
  let currentLang = localStorage.getItem('termslaw_lang') || 'en';

  localStorage.setItem('termslaw_chat_id', visitorId);

  // Language translations
  const translations = {
    en: {
      tipText: 'Chat with Sergei',
      statusOnline: 'Available now',
      statusAvailable: 'Quick response',
      statusAway: 'Usually replies in hours',
      licensed: 'Licensed',
      realPerson: 'Real Person',
      private: 'Confidential',
      helpQuestion: 'What can I help you with?',
      clickHint: 'Click to continue — no sign-up needed',
      back: 'Back',
      situationHint: 'What best describes your situation?',
      typeMessage: 'Type a message...',
      awayNotice: "I'm away but will see your message soon",
      availableNotice: "I'm around and will respond shortly",
      connectionError: 'Connection error. Please try again.',
      greeting: (topic, subtopic, isAway) => {
        const away = isAway ? "I'm not at my desk right now, but I'll see your message and get back to you soon.\n\n" : '';
        const prompts = {
          'Unpaid invoice': `${away}Unpaid invoice — I can help with that. To see if a demand letter makes sense:\n\n• How much are you owed?\n• How long has it been overdue?\n• Is the debtor a person or a company?\n• Have you tried contacting them already?`,
          'Contractor issue': `${away}Contractor problems are frustrating. To understand your situation:\n\n• Did they not finish the work, or was it done poorly?\n• How much did you pay vs. what was agreed?\n• Do you have a written contract?\n• What outcome are you hoping for — refund, completion, or both?`,
          'Security deposit': `${away}Security deposit disputes are common. Help me understand:\n\n• How much is the deposit?\n• When did you move out?\n• Did the landlord provide an itemized deduction list?\n• Do you have move-in/move-out photos?`,
          'Refund needed': `${away}Let's see if I can help get your money back:\n\n• What did you purchase and from whom?\n• How much are you trying to recover?\n• Why are you requesting a refund?\n• Have you already asked them for a refund?`,
          'Other debt': `${away}Tell me about the debt situation:\n\n• How much is owed to you?\n• Who owes it (person or business)?\n• How did the debt arise?\n• Do you have documentation?`,
          'Review before signing': `${away}Smart to get a review before signing. Tell me:\n\n• What type of contract is it?\n• Who's the other party?\n• Any specific clauses you're concerned about?\n• When do you need to sign by?`,
          'Draft new contract': `${away}I can help draft a contract. What do I need to know:\n\n• What's the purpose of the contract?\n• Who are the parties involved?\n• What are the key terms you need included?\n• Any specific protections you're looking for?`,
          'Exit/terminate contract': `${away}Contract exit can be tricky. Tell me:\n\n• What type of contract is it?\n• Why do you want out?\n• Does the contract have a termination clause?\n• Are there penalties for early termination?`,
          'Negotiate terms': `${away}Happy to help with negotiation. I need to know:\n\n• What type of contract?\n• Which terms are you trying to change?\n• What's your leverage or bargaining position?\n• What's your ideal outcome?`,
          'NDA needed': `${away}NDAs are essential for protecting confidential info:\n\n• What's the context — hiring, partnership, investor?\n• One-way or mutual NDA?\n• What information needs protection?\n• How long should confidentiality last?`,
          'Form an LLC': `${away}LLC formation — great choice for liability protection:\n\n• What state are you forming in?\n• What type of business?\n• Single member or multiple owners?\n• Do you need an Operating Agreement?`,
          'Form a Corporation': `${away}Corporation setup — let's get the details:\n\n• Delaware, California, or another state?\n• C-Corp or S-Corp election?\n• How many founders/shareholders?\n• Are you raising outside investment?`,
          'Partnership agreement': `${away}Partnership agreements prevent future disputes:\n\n• How many partners?\n• What's each person contributing (money, work, IP)?\n• How will profits/losses be split?\n• What happens if someone wants out?`,
          'Operating agreement': `${away}Operating agreements are crucial even for single-member LLCs:\n\n• Is this for a new or existing LLC?\n• How many members?\n• How will decisions be made?\n• Any special profit-sharing arrangements?`,
          'Equity/ownership split': `${away}Equity splits can make or break partnerships:\n\n• How many co-founders/partners?\n• What's each person's contribution?\n• Will there be vesting?\n• Who's putting in money vs. sweat equity?`,
          'Register trademark': `${away}Trademark registration protects your brand:\n\n• What do you want to trademark (name, logo, slogan)?\n• What goods/services will it cover?\n• Have you searched if it's available?\n• Are you already using it in commerce?`,
          'Copyright issue': `${away}Copyright matters can be complex:\n\n• What was created (software, content, art, music)?\n• Are you the creator or dealing with infringement?\n• Is registration needed or enforcement?\n• What's the timeline?`,
          'Someone copied me': `${away}IP theft is serious. Help me understand:\n\n• What did they copy (brand, content, product)?\n• Do you have proof of your original creation?\n• Who's the infringer?\n• What outcome do you want — takedown, compensation?`,
          'Received C&D letter': `${away}Receiving a cease & desist can be stressful:\n\n• Who sent it and what are they claiming?\n• Do you think their claim has merit?\n• What's the deadline to respond?\n• Can you share the letter with me?`,
          'License my IP': `${away}IP licensing can generate revenue:\n\n• What IP do you want to license?\n• Exclusive or non-exclusive?\n• Who's the potential licensee?\n• What compensation structure are you thinking?`,
          'Partner/co-founder issue': `${away}Co-founder disputes need careful handling:\n\n• What's the core disagreement?\n• Is there an existing partnership/operating agreement?\n• What's the ownership split?\n• Are you looking to resolve or separate?`,
          'Customer dispute': `${away}Customer disputes can hurt business if unresolved:\n\n• What's the customer claiming?\n• How much money is involved?\n• Do you have contracts/documentation?\n• Have they threatened legal action?`,
          'Vendor problem': `${away}Vendor issues can disrupt operations:\n\n• What did the vendor fail to deliver?\n• Is there a contract in place?\n• How much money is at stake?\n• What resolution are you seeking?`,
          'Employment matter': `${away}Employment issues require careful navigation:\n\n• Are you the employer or employee?\n• What's the issue (termination, wages, discrimination)?\n• Is there an employment contract?\n• What state are you in?`,
          'Lawsuit threat': `${away}Lawsuit threats need prompt attention:\n\n• Who's threatening to sue and why?\n• Have you received formal legal papers?\n• What's their claimed damages?\n• Do you have insurance that might cover this?`,
          'General question': `${away}Happy to help with your legal question:\n\n• What area of law does it involve?\n• Is this for personal or business purposes?\n• Any deadlines I should know about?\n• What's your main concern?`,
          'Not sure what I need': `${away}No problem — let's figure it out together:\n\n• What's the situation you're dealing with?\n• Is it business or personal?\n• Is there a problem to solve or something to set up?\n• Any urgency or deadlines?`,
          'Need a referral': `${away}I'm happy to point you in the right direction:\n\n• What type of legal help do you need?\n• What's your location?\n• Is this for business or personal matters?\n• Any budget constraints?`,
          'Quick consultation': `${away}Sure, let's chat:\n\n• What's on your mind?\n• Business or personal matter?\n• Any time sensitivity?\n• What would be most helpful to know?`
        };
        return prompts[subtopic] || `${away}Tell me more about your **${topic}** situation and what you're hoping to accomplish.`;
      }
    },
    ru: {
      tipText: 'Чат с Сергеем',
      statusOnline: 'Онлайн',
      statusAvailable: 'Скоро отвечу',
      statusAway: 'Обычно отвечаю в течение часов',
      licensed: 'Лицензия',
      realPerson: 'Живой человек',
      private: 'Конфиденциально',
      helpQuestion: 'Чем могу помочь?',
      clickHint: 'Нажмите чтобы продолжить — регистрация не нужна',
      back: 'Назад',
      situationHint: 'Что лучше описывает вашу ситуацию?',
      typeMessage: 'Введите сообщение...',
      awayNotice: 'Я сейчас отошёл, но скоро увижу ваше сообщение',
      availableNotice: 'Я рядом и скоро отвечу',
      connectionError: 'Ошибка соединения. Попробуйте ещё раз.',
      greeting: (topic, subtopic, isAway) => {
        const away = isAway ? "Я сейчас не у компьютера, но скоро увижу ваше сообщение.\n\n" : '';
        const prompts = {
          'Неоплаченный счёт': `${away}Неоплаченный счёт — могу помочь. Чтобы понять ситуацию:\n\n• Какая сумма?\n• Как давно просрочено?\n• Должник — физлицо или компания?\n• Вы уже пытались связаться с ними?`,
          'Проблема с подрядчиком': `${away}Проблемы с подрядчиками — частая ситуация:\n\n• Работа не завершена или сделана плохо?\n• Сколько заплатили vs. договорились?\n• Есть письменный договор?\n• Чего хотите — возврат денег или завершение работы?`,
          'Залоговый депозит': `${away}Споры по депозитам — распространённая проблема:\n\n• Какая сумма депозита?\n• Когда съехали?\n• Арендодатель предоставил список удержаний?\n• Есть фото при заезде/выезде?`,
          'Нужен возврат': `${away}Попробуем вернуть ваши деньги:\n\n• Что и у кого купили?\n• Какую сумму хотите вернуть?\n• Почему требуете возврат?\n• Уже обращались к продавцу?`,
          'Другой долг': `${away}Расскажите о долге:\n\n• Какая сумма?\n• Кто должен (человек или компания)?\n• Как возник долг?\n• Есть документы?`,
          'Проверить перед подписанием': `${away}Правильно, что проверяете перед подписанием:\n\n• Что за договор?\n• Кто вторая сторона?\n• Какие пункты беспокоят?\n• Когда нужно подписать?`,
          'Составить новый договор': `${away}Помогу составить договор. Расскажите:\n\n• Для чего нужен договор?\n• Кто стороны?\n• Какие ключевые условия?\n• Какие защиты нужны?`,
          'Расторгнуть договор': `${away}Выход из договора требует осторожности:\n\n• Что за договор?\n• Почему хотите выйти?\n• Есть пункт о расторжении?\n• Какие штрафы за досрочное расторжение?`,
          'Согласовать условия': `${away}Помогу с переговорами:\n\n• Что за договор?\n• Какие условия хотите изменить?\n• Какова ваша позиция?\n• Какой идеальный результат?`,
          'Нужен NDA': `${away}NDA защищает конфиденциальную информацию:\n\n• Контекст — найм, партнёрство, инвестор?\n• Односторонний или взаимный NDA?\n• Что нужно защитить?\n• На какой срок?`,
          'Создать LLC': `${away}LLC — хороший выбор для защиты:\n\n• В каком штате регистрируете?\n• Какой бизнес?\n• Один владелец или несколько?\n• Нужно Operating Agreement?`,
          'Создать корпорацию': `${away}Регистрация корпорации:\n\n• Delaware, California или другой штат?\n• C-Corp или S-Corp?\n• Сколько учредителей?\n• Планируете привлекать инвестиции?`,
          'Партнёрское соглашение': `${away}Партнёрское соглашение предотвращает споры:\n\n• Сколько партнёров?\n• Кто что вносит (деньги, работа, IP)?\n• Как делится прибыль/убытки?\n• Что если кто-то захочет выйти?`,
          'Операционное соглашение': `${away}Operating Agreement важен даже для одного владельца:\n\n• Для новой или существующей LLC?\n• Сколько участников?\n• Как принимаются решения?\n• Особые условия по прибыли?`,
          'Распределение долей': `${away}Распределение долей — важный вопрос:\n\n• Сколько со-основателей?\n• Кто что вносит?\n• Будет ли вестинг?\n• Кто вкладывает деньги vs. труд?`,
          'Регистрация товарного знака': `${away}Товарный знак защищает бренд:\n\n• Что регистрируете (название, лого, слоган)?\n• Для каких товаров/услуг?\n• Проверяли доступность?\n• Уже используете в бизнесе?`,
          'Вопрос авторских прав': `${away}Авторские права — сложная тема:\n\n• Что создано (софт, контент, арт, музыка)?\n• Вы автор или столкнулись с нарушением?\n• Нужна регистрация или защита?\n• Какие сроки?`,
          'Кто-то скопировал меня': `${away}Кража IP — серьёзно:\n\n• Что скопировали (бренд, контент, продукт)?\n• Есть доказательства вашего авторства?\n• Кто нарушитель?\n• Чего хотите — удаление, компенсацию?`,
          'Получил C&D письмо': `${away}C&D письмо — стрессовая ситуация:\n\n• Кто отправил и что требует?\n• Считаете ли претензию обоснованной?\n• Какой срок ответа?\n• Можете показать письмо?`,
          'Лицензирование': `${away}Лицензирование IP может приносить доход:\n\n• Что хотите лицензировать?\n• Эксклюзивно или нет?\n• Кто потенциальный лицензиат?\n• Какая модель оплаты?`,
          'Проблема с партнёром': `${away}Споры с партнёрами требуют осторожности:\n\n• В чём суть разногласий?\n• Есть партнёрское соглашение?\n• Какое распределение долей?\n• Хотите решить или разойтись?`,
          'Спор с клиентом': `${away}Споры с клиентами могут навредить бизнесу:\n\n• Что требует клиент?\n• Какая сумма?\n• Есть договоры/документы?\n• Угрожают судом?`,
          'Проблема с поставщиком': `${away}Проблемы с поставщиками нарушают работу:\n\n• Что поставщик не выполнил?\n• Есть договор?\n• Какая сумма?\n• Какое решение ищете?`,
          'Трудовой вопрос': `${away}Трудовые вопросы требуют осторожности:\n\n• Вы работодатель или работник?\n• В чём проблема (увольнение, зарплата, дискриминация)?\n• Есть трудовой договор?\n• Какой штат?`,
          'Угроза иска': `${away}Угрозы судом требуют внимания:\n\n• Кто угрожает и почему?\n• Получили официальные документы?\n• Какие требования?\n• Есть страховка?`,
          'Общий вопрос': `${away}Рад помочь с вашим вопросом:\n\n• Какая область права?\n• Личный или бизнес вопрос?\n• Есть сроки?\n• Что больше всего беспокоит?`,
          'Не уверен что нужно': `${away}Давайте разберёмся вместе:\n\n• Какая ситуация?\n• Бизнес или личное?\n• Нужно решить проблему или что-то оформить?\n• Есть срочность?`,
          'Нужна рекомендация': `${away}Подскажу нужное направление:\n\n• Какая юридическая помощь нужна?\n• Где находитесь?\n• Бизнес или личное?\n• Есть бюджет?`,
          'Быстрая консультация': `${away}Конечно, поговорим:\n\n• Что на уме?\n• Бизнес или личное?\n• Есть срочность?\n• Что было бы полезно узнать?`
        };
        return prompts[subtopic] || `${away}Расскажите подробнее о вашей ситуации с **${topic}**.`;
      }
    },
    es: {
      tipText: 'Chatea con Sergei',
      statusOnline: 'Disponible ahora',
      statusAvailable: 'Respuesta rápida',
      statusAway: 'Suele responder en horas',
      licensed: 'Licenciado',
      realPerson: 'Persona real',
      private: 'Privado',
      helpQuestion: '¿En qué puedo ayudarte?',
      clickHint: 'Haz clic para continuar — sin registro',
      back: 'Atrás',
      situationHint: '¿Qué describe mejor tu situación?',
      typeMessage: 'Escribe un mensaje...',
      awayNotice: 'No estoy ahora, pero veré tu mensaje pronto',
      availableNotice: 'Estoy cerca y responderé pronto',
      connectionError: 'Error de conexión. Inténtalo de nuevo.',
      greeting: (topic, subtopic, isAway) => {
        const away = isAway ? "No estoy en mi escritorio ahora, pero veré tu mensaje pronto.\n\n" : '';
        const prompts = {
          'Factura impaga': `${away}Factura impaga — puedo ayudar. Para entender tu situación:\n\n• ¿Cuánto te deben?\n• ¿Hace cuánto está vencida?\n• ¿El deudor es persona o empresa?\n• ¿Ya intentaste contactarlos?`,
          'Problema con contratista': `${away}Problemas con contratistas son frustrantes:\n\n• ¿No terminó el trabajo o lo hizo mal?\n• ¿Cuánto pagaste vs. lo acordado?\n• ¿Tienes contrato escrito?\n• ¿Qué buscas — reembolso, que termine, o ambos?`,
          'Depósito de seguridad': `${away}Disputas de depósito son comunes:\n\n• ¿Cuánto es el depósito?\n• ¿Cuándo te mudaste?\n• ¿El arrendador dio lista de deducciones?\n• ¿Tienes fotos de entrada/salida?`,
          'Necesito reembolso': `${away}Veamos si puedo ayudarte a recuperar tu dinero:\n\n• ¿Qué compraste y a quién?\n• ¿Cuánto quieres recuperar?\n• ¿Por qué pides reembolso?\n• ¿Ya lo pediste al vendedor?`,
          'Otra deuda': `${away}Cuéntame sobre la deuda:\n\n• ¿Cuánto te deben?\n• ¿Quién debe (persona o empresa)?\n• ¿Cómo surgió la deuda?\n• ¿Tienes documentación?`,
          'Revisar antes de firmar': `${away}Bien pensado revisar antes de firmar:\n\n• ¿Qué tipo de contrato es?\n• ¿Quién es la otra parte?\n• ¿Alguna cláusula te preocupa?\n• ¿Cuándo debes firmarlo?`,
          'Redactar nuevo contrato': `${away}Puedo ayudar a redactar un contrato:\n\n• ¿Para qué es el contrato?\n• ¿Quiénes son las partes?\n• ¿Cuáles son los términos clave?\n• ¿Qué protecciones necesitas?`,
          'Terminar contrato': `${away}Salir de un contrato requiere cuidado:\n\n• ¿Qué tipo de contrato es?\n• ¿Por qué quieres salir?\n• ¿Tiene cláusula de terminación?\n• ¿Hay penalidades por terminar antes?`,
          'Negociar términos': `${away}Puedo ayudar con la negociación:\n\n• ¿Qué tipo de contrato?\n• ¿Qué términos quieres cambiar?\n• ¿Cuál es tu posición de negociación?\n• ¿Cuál sería el resultado ideal?`,
          'Necesito NDA': `${away}Los NDA protegen información confidencial:\n\n• ¿Contexto — contratación, sociedad, inversor?\n• ¿NDA unilateral o mutuo?\n• ¿Qué información hay que proteger?\n• ¿Por cuánto tiempo?`,
          'Formar una LLC': `${away}LLC — buena opción para protección:\n\n• ¿En qué estado la formarás?\n• ¿Qué tipo de negocio?\n• ¿Un dueño o varios?\n• ¿Necesitas Operating Agreement?`,
          'Formar una corporación': `${away}Formación de corporación:\n\n• ¿Delaware, California u otro estado?\n• ¿C-Corp o S-Corp?\n• ¿Cuántos fundadores/accionistas?\n• ¿Planeas buscar inversión?`,
          'Acuerdo de socios': `${away}Acuerdos de socios previenen disputas:\n\n• ¿Cuántos socios?\n• ¿Qué aporta cada uno (dinero, trabajo, IP)?\n• ¿Cómo se dividen ganancias/pérdidas?\n• ¿Qué pasa si alguien quiere salir?`,
          'Acuerdo operativo': `${away}Operating Agreement es crucial incluso para un solo dueño:\n\n• ¿Es para LLC nueva o existente?\n• ¿Cuántos miembros?\n• ¿Cómo se toman decisiones?\n• ¿Arreglos especiales de ganancias?`,
          'División de acciones': `${away}División de equity puede hacer o romper sociedades:\n\n• ¿Cuántos co-fundadores?\n• ¿Qué aporta cada uno?\n• ¿Habrá vesting?\n• ¿Quién pone dinero vs. trabajo?`,
          'Registrar marca': `${away}Registro de marca protege tu brand:\n\n• ¿Qué quieres registrar (nombre, logo, slogan)?\n• ¿Para qué productos/servicios?\n• ¿Verificaste si está disponible?\n• ¿Ya la usas en comercio?`,
          'Tema de derechos de autor': `${away}Derechos de autor pueden ser complejos:\n\n• ¿Qué se creó (software, contenido, arte, música)?\n• ¿Eres el creador o enfrentas infracción?\n• ¿Necesitas registro o protección?\n• ¿Cuál es el plazo?`,
          'Alguien me copió': `${away}Robo de IP es serio:\n\n• ¿Qué copiaron (marca, contenido, producto)?\n• ¿Tienes prueba de tu creación original?\n• ¿Quién es el infractor?\n• ¿Qué quieres — que lo quiten, compensación?`,
          'Recibí carta de cese': `${away}Recibir un cease & desist es estresante:\n\n• ¿Quién lo envió y qué reclaman?\n• ¿Crees que tienen razón?\n• ¿Cuál es el plazo para responder?\n• ¿Puedes compartir la carta?`,
          'Licenciar mi PI': `${away}Licenciar PI puede generar ingresos:\n\n• ¿Qué PI quieres licenciar?\n• ¿Exclusiva o no exclusiva?\n• ¿Quién es el posible licenciatario?\n• ¿Qué estructura de pago piensas?`,
          'Problema con socio': `${away}Disputas con socios requieren cuidado:\n\n• ¿Cuál es el desacuerdo principal?\n• ¿Hay acuerdo de sociedad existente?\n• ¿Cuál es la división de ownership?\n• ¿Buscas resolver o separarte?`,
          'Disputa con cliente': `${away}Disputas con clientes pueden dañar el negocio:\n\n• ¿Qué reclama el cliente?\n• ¿Cuánto dinero está involucrado?\n• ¿Tienes contratos/documentación?\n• ¿Han amenazado con demanda?`,
          'Problema con proveedor': `${away}Problemas con proveedores interrumpen operaciones:\n\n• ¿Qué no entregó el proveedor?\n• ¿Hay contrato?\n• ¿Cuánto dinero está en juego?\n• ¿Qué solución buscas?`,
          'Asunto laboral': `${away}Temas laborales requieren navegación cuidadosa:\n\n• ¿Eres empleador o empleado?\n• ¿Cuál es el problema (despido, salarios, discriminación)?\n• ¿Hay contrato de trabajo?\n• ¿En qué estado estás?`,
          'Amenaza de demanda': `${away}Amenazas de demanda requieren atención:\n\n• ¿Quién amenaza y por qué?\n• ¿Recibiste documentos legales formales?\n• ¿Cuáles son los daños reclamados?\n• ¿Tienes seguro que cubra esto?`,
          'Pregunta general': `${away}Con gusto ayudo con tu pregunta:\n\n• ¿Qué área del derecho involucra?\n• ¿Es personal o de negocios?\n• ¿Hay plazos que deba saber?\n• ¿Cuál es tu principal preocupación?`,
          'No sé qué necesito': `${away}No hay problema — descubrámoslo juntos:\n\n• ¿Cuál es la situación?\n• ¿Es negocio o personal?\n• ¿Hay problema que resolver o algo que configurar?\n• ¿Hay urgencia?`,
          'Necesito referencia': `${away}Con gusto te oriento:\n\n• ¿Qué tipo de ayuda legal necesitas?\n• ¿Dónde estás ubicado?\n• ¿Es para negocios o personal?\n• ¿Hay limitaciones de presupuesto?`,
          'Consulta rápida': `${away}Claro, hablemos:\n\n• ¿Qué tienes en mente?\n• ¿Negocio o personal?\n• ¿Hay urgencia?\n• ¿Qué sería más útil saber?`
        };
        return prompts[subtopic] || `${away}Cuéntame más sobre tu situación con **${topic}**.`;
      }
    }
  };

  // Get current translation
  const t = () => translations[currentLang];

  // Streamlined practice areas with click-through subtopics (multilingual)
  const topicsData = {
    en: {
      demand: {
        icon: '📝',
        label: 'Demand Letter',
        desc: 'Collect money owed',
        subtopics: ['Unpaid invoice', 'Contractor issue', 'Security deposit', 'Refund needed', 'Other debt']
      },
      contract: {
        icon: '📄',
        label: 'Contract',
        desc: 'Review or draft',
        subtopics: ['Review before signing', 'Draft new contract', 'Exit/terminate contract', 'Negotiate terms', 'NDA needed']
      },
      startup: {
        icon: '🚀',
        label: 'Business Formation',
        desc: 'LLC, Corp, Partnership',
        subtopics: ['Form an LLC', 'Form a Corporation', 'Partnership agreement', 'Operating agreement', 'Equity/ownership split']
      },
      ip: {
        icon: '💡',
        label: 'IP & Trademark',
        desc: 'Protect your brand',
        subtopics: ['Register trademark', 'Copyright issue', 'Someone copied me', 'Received C&D letter', 'License my IP']
      },
      dispute: {
        icon: '⚖️',
        label: 'Business Dispute',
        desc: 'Resolve conflicts',
        subtopics: ['Partner/co-founder issue', 'Customer dispute', 'Vendor problem', 'Employment matter', 'Lawsuit threat']
      },
      other: {
        icon: '💬',
        label: 'Something Else',
        desc: 'Other legal help',
        subtopics: ['General question', 'Not sure what I need', 'Need a referral', 'Quick consultation']
      }
    },
    ru: {
      demand: {
        icon: '📝',
        label: 'Претензионное письмо',
        desc: 'Взыскание долга',
        subtopics: ['Неоплаченный счёт', 'Проблема с подрядчиком', 'Залоговый депозит', 'Нужен возврат', 'Другой долг']
      },
      contract: {
        icon: '📄',
        label: 'Договор',
        desc: 'Проверка или составление',
        subtopics: ['Проверить перед подписанием', 'Составить новый договор', 'Расторгнуть договор', 'Согласовать условия', 'Нужен NDA']
      },
      startup: {
        icon: '🚀',
        label: 'Регистрация бизнеса',
        desc: 'LLC, Корпорация, Партнёрство',
        subtopics: ['Создать LLC', 'Создать корпорацию', 'Партнёрское соглашение', 'Операционное соглашение', 'Распределение долей']
      },
      ip: {
        icon: '💡',
        label: 'Интеллектуальная собственность',
        desc: 'Защита бренда',
        subtopics: ['Регистрация товарного знака', 'Вопрос авторских прав', 'Кто-то скопировал меня', 'Получил C&D письмо', 'Лицензирование']
      },
      dispute: {
        icon: '⚖️',
        label: 'Бизнес-спор',
        desc: 'Разрешение конфликтов',
        subtopics: ['Проблема с партнёром', 'Спор с клиентом', 'Проблема с поставщиком', 'Трудовой вопрос', 'Угроза иска']
      },
      other: {
        icon: '💬',
        label: 'Другое',
        desc: 'Другая юридическая помощь',
        subtopics: ['Общий вопрос', 'Не уверен что нужно', 'Нужна рекомендация', 'Быстрая консультация']
      }
    },
    es: {
      demand: {
        icon: '📝',
        label: 'Carta de demanda',
        desc: 'Cobrar deuda',
        subtopics: ['Factura impaga', 'Problema con contratista', 'Depósito de seguridad', 'Necesito reembolso', 'Otra deuda']
      },
      contract: {
        icon: '📄',
        label: 'Contrato',
        desc: 'Revisar o redactar',
        subtopics: ['Revisar antes de firmar', 'Redactar nuevo contrato', 'Terminar contrato', 'Negociar términos', 'Necesito NDA']
      },
      startup: {
        icon: '🚀',
        label: 'Formación de empresa',
        desc: 'LLC, Corp, Sociedad',
        subtopics: ['Formar una LLC', 'Formar una corporación', 'Acuerdo de socios', 'Acuerdo operativo', 'División de acciones']
      },
      ip: {
        icon: '💡',
        label: 'Propiedad intelectual',
        desc: 'Protege tu marca',
        subtopics: ['Registrar marca', 'Tema de derechos de autor', 'Alguien me copió', 'Recibí carta de cese', 'Licenciar mi PI']
      },
      dispute: {
        icon: '⚖️',
        label: 'Disputa comercial',
        desc: 'Resolver conflictos',
        subtopics: ['Problema con socio', 'Disputa con cliente', 'Problema con proveedor', 'Asunto laboral', 'Amenaza de demanda']
      },
      other: {
        icon: '💬',
        label: 'Otro tema',
        desc: 'Otra ayuda legal',
        subtopics: ['Pregunta general', 'No sé qué necesito', 'Necesito referencia', 'Consulta rápida']
      }
    }
  };

  // Get topics for current language
  const topics = () => topicsData[currentLang];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .tl * { box-sizing: border-box; margin: 0; padding: 0; }

    .tl-fab {
      position: fixed; bottom: 24px; right: 24px;
      width: 70px; height: 70px; border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 4px solid white;
      cursor: pointer;
      box-shadow: 0 6px 24px rgba(0,0,0,0.25);
      transition: all 0.3s ease;
      z-index: 999999;
    }
    .tl-fab:hover { transform: scale(1.08); }
    .tl-fab.open { transform: scale(0.9); opacity: 0.5; }

    .tl-fab-status {
      position: absolute; bottom: 2px; right: 2px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #6b7280; border: 3px solid white;
    }
    .tl-fab-status.online { background: #22c55e; animation: pulse 2s infinite; }
    .tl-fab-status.available { background: #eab308; }
    @keyframes pulse { 50% { transform: scale(1.2); } }

    .tl-tip {
      position: absolute; right: 82px; top: 50%; transform: translateY(-50%);
      background: #1a1a2e; color: white;
      padding: 10px 16px; border-radius: 10px;
      font: 500 14px Inter, sans-serif;
      white-space: nowrap; opacity: 0; visibility: hidden;
      transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .tl-tip::after {
      content: ''; position: absolute; right: -8px; top: 50%;
      transform: translateY(-50%);
      border: 8px solid transparent; border-left-color: #1a1a2e;
    }
    .tl-fab:hover .tl-tip { opacity: 1; visibility: visible; }
    .tl-fab.open .tl-tip { display: none; }

    .tl-win {
      position: fixed; bottom: 110px; right: 24px;
      width: 380px; max-width: calc(100vw - 48px);
      background: white; border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      overflow: hidden; z-index: 999998;
      opacity: 0; visibility: hidden;
      transform: translateY(16px) scale(0.96);
      transition: all 0.3s ease;
      font-family: Inter, -apple-system, sans-serif;
    }
    .tl-win.open { opacity: 1; visibility: visible; transform: none; }

    .tl-head {
      background: linear-gradient(135deg, #1a1a2e, #2d3a5a);
      color: white; padding: 16px 20px;
      display: flex; align-items: center; gap: 14px;
    }
    .tl-head-photo {
      width: 52px; height: 52px; border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 2px solid rgba(255,255,255,0.2);
      position: relative; flex-shrink: 0;
    }
    .tl-head-dot {
      position: absolute; bottom: 0; right: 0;
      width: 14px; height: 14px; border-radius: 50%;
      background: #6b7280; border: 2px solid #1a1a2e;
    }
    .tl-head-dot.online { background: #22c55e; }
    .tl-head-dot.available { background: #eab308; }
    .tl-head-info { flex: 1; }
    .tl-head-name { font-size: 17px; font-weight: 600; }
    .tl-head-sub { font-size: 12px; opacity: 0.7; margin-top: 2px; }
    .tl-head-sub a { color: inherit; text-decoration: none; }
    .tl-head-sub a:hover { text-decoration: underline; }
    .tl-head-status { font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 6px; }
    .tl-head-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #6b7280; }
    .tl-head-status-dot.online { background: #4ade80; }
    .tl-head-status-dot.available { background: #fbbf24; }
    .tl-close {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: none;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .tl-close:hover { background: rgba(255,255,255,0.2); }
    .tl-close svg { width: 14px; height: 14px; fill: white; }

    .tl-body { background: #f8fafc; max-height: 450px; overflow-y: auto; }

    /* Trust strip */
    .tl-trust {
      display: flex; justify-content: center; gap: 16px;
      padding: 10px; background: white;
      border-bottom: 1px solid #eee;
      font-size: 11px; color: #666;
    }
    .tl-trust span { display: flex; align-items: center; gap: 4px; }
    .tl-trust svg { width: 12px; height: 12px; }
    .tl-trust .g svg { fill: #22c55e; }
    .tl-trust .b svg { fill: #3b82f6; }
    .tl-trust .p svg { fill: #8b5cf6; }

    /* Step content */
    .tl-step { padding: 20px; animation: fadeUp 0.3s ease; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } }

    .tl-q {
      text-align: center; margin-bottom: 16px;
      font-size: 15px; color: #333; font-weight: 500;
    }
    .tl-hint {
      text-align: center; font-size: 12px; color: #888;
      margin-bottom: 16px;
    }

    /* Topic grid */
    .tl-topics {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
    }
    .tl-topic {
      background: white; border: 2px solid #e5e7eb;
      border-radius: 12px; padding: 14px 10px;
      cursor: pointer; text-align: center;
      transition: all 0.2s ease;
    }
    .tl-topic:hover {
      border-color: #1a1a2e; transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    }
    .tl-topic-icon { font-size: 24px; margin-bottom: 6px; }
    .tl-topic-label { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .tl-topic-desc { font-size: 11px; color: #888; margin-top: 2px; }

    /* Subtopic list */
    .tl-subs { display: flex; flex-direction: column; gap: 8px; }
    .tl-sub {
      background: white; border: 2px solid #e5e7eb;
      border-radius: 10px; padding: 14px 16px;
      cursor: pointer; font-size: 14px; color: #333;
      transition: all 0.2s ease; text-align: left;
      display: flex; align-items: center; gap: 10px;
    }
    .tl-sub:hover { border-color: #1a1a2e; background: #f8fafc; }
    .tl-sub::before {
      content: '→'; color: #1a1a2e; font-weight: bold;
    }

    .tl-back {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #666; cursor: pointer;
      margin-bottom: 16px; padding: 6px 0;
    }
    .tl-back:hover { color: #1a1a2e; }
    .tl-back svg { width: 14px; height: 14px; fill: currentColor; }

    .tl-chat-back {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #666; cursor: pointer;
      padding: 10px 16px; background: #f8fafc;
      border-bottom: 1px solid #eee;
    }
    .tl-chat-back:hover { color: #1a1a2e; background: #f1f5f9; }
    .tl-chat-back svg { width: 14px; height: 14px; fill: currentColor; }

    /* Chat view */
    .tl-chat { display: flex; flex-direction: column; height: 420px; }
    .tl-msgs {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      background: linear-gradient(#f8fafc, white);
    }
    .tl-msg { display: flex; gap: 10px; animation: fadeUp 0.3s ease; }
    .tl-msg.v { flex-direction: row-reverse; }
    .tl-msg-ava {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    }
    .tl-msg.s .tl-msg-ava {
      background: url('${PHOTO_URL}') center/cover;
      border: 2px solid #e5e7eb;
    }
    .tl-msg.v .tl-msg-ava {
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 600; font-size: 12px;
    }
    .tl-msg-bub {
      max-width: 75%; padding: 10px 14px;
      border-radius: 16px; font-size: 14px; line-height: 1.5;
    }
    .tl-msg.s .tl-msg-bub {
      background: white; border: 1px solid #e5e7eb;
      border-bottom-left-radius: 4px;
    }
    .tl-msg.v .tl-msg-bub {
      background: linear-gradient(135deg, #1a1a2e, #2d3a5a);
      color: white; border-bottom-right-radius: 4px;
    }
    .tl-msg-sys { text-align: center; font-size: 12px; color: #999; }

    .tl-notice {
      padding: 10px 16px; font-size: 12px;
      display: flex; align-items: center; gap: 8px;
    }
    .tl-notice svg { width: 14px; height: 14px; flex-shrink: 0; }
    .tl-notice.away { background: #fef9c3; color: #92400e; }
    .tl-notice.away svg { fill: #ca8a04; }
    .tl-notice.available { background: #f0fdf4; color: #166534; }
    .tl-notice.available svg { fill: #22c55e; }

    .tl-input-bar {
      padding: 12px 16px; background: white;
      border-top: 1px solid #eee;
      display: flex; gap: 10px;
    }
    .tl-chat-in {
      flex: 1; padding: 12px 16px;
      border: 2px solid #e5e7eb; border-radius: 24px;
      font: 14px Inter; outline: none;
    }
    .tl-chat-in:focus { border-color: #1a1a2e; }
    .tl-send {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #1a1a2e, #2d3a5a);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .tl-send:hover { transform: scale(1.05); }
    .tl-send svg { width: 18px; height: 18px; fill: white; margin-left: 2px; }

    .tl-foot {
      padding: 8px; text-align: center;
      font-size: 10px; color: #aaa; background: #fafafa;
    }
    .tl-foot a { color: #888; text-decoration: none; }

    /* Language toggle */
    .tl-lang {
      display: flex; justify-content: center; gap: 8px;
      padding: 8px; background: #f8fafc;
      border-bottom: 1px solid #eee;
    }
    .tl-lang-btn {
      width: 32px; height: 22px; border-radius: 4px;
      border: 2px solid transparent; cursor: pointer;
      background-size: cover; background-position: center;
      opacity: 0.6; transition: all 0.2s ease;
    }
    .tl-lang-btn:hover { opacity: 0.9; transform: scale(1.1); }
    .tl-lang-btn.active { opacity: 1; border-color: #1a1a2e; transform: scale(1.1); }
    .tl-lang-btn.en {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><rect fill="%23002868" width="60" height="30"/><g fill="%23fff"><rect width="60" height="3.5" y="3.5"/><rect width="60" height="3.5" y="10.5"/><rect width="60" height="3.5" y="17.5"/><rect width="60" height="3.5" y="24.5"/></g><rect fill="%23bf0a30" width="60" height="3.5" y="7"/><rect fill="%23bf0a30" width="60" height="3.5" y="14"/><rect fill="%23bf0a30" width="60" height="3.5" y="21"/><rect fill="%23002868" width="24" height="16"/></svg>');
    }
    .tl-lang-btn.ru {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><rect fill="%23fff" width="9" height="3"/><rect fill="%230039a6" y="2" width="9" height="2"/><rect fill="%23d52b1e" y="4" width="9" height="2"/></svg>');
    }
    .tl-lang-btn.es {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect fill="%23006847" width="1" height="2"/><rect fill="%23fff" x="1" width="1" height="2"/><rect fill="%23ce1126" x="2" width="1" height="2"/></svg>');
    }

    @media (max-width: 480px) {
      .tl-win { bottom: 0; right: 0; left: 0; width: 100%; max-width: 100%; border-radius: 20px 20px 0 0; }
      .tl-fab { bottom: 16px; right: 16px; width: 60px; height: 60px; }
      .tl-tip { display: none; }
      .tl-chat { height: calc(100vh - 200px); }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Calendly
  if (!window.Calendly) {
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }

  const widget = document.createElement('div');
  widget.className = 'tl';
  widget.id = 'tlChat';
  document.body.appendChild(widget);

  let messages = [];

  function render() {
    const tr = t();
    const statusText = currentStatus === 'online' ? tr.statusOnline :
                       currentStatus === 'available' ? tr.statusAvailable : tr.statusAway;

    widget.innerHTML = `
      <button class="tl-fab ${isOpen ? 'open' : ''}" id="fab">
        <span class="tl-fab-status ${currentStatus}"></span>
        <span class="tl-tip">${tr.tipText}</span>
      </button>
      <div class="tl-win ${isOpen ? 'open' : ''}">
        <div class="tl-head">
          <div class="tl-head-photo"><span class="tl-head-dot ${currentStatus}"></span></div>
          <div class="tl-head-info">
            <div class="tl-head-name">Sergei Tokmakov</div>
            <div class="tl-head-sub">Business Attorney · <a href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/279869" target="_blank">CA Bar #279869</a></div>
            <div class="tl-head-status">
              <span class="tl-head-status-dot ${currentStatus}"></span>
              ${statusText}
            </div>
          </div>
          <button class="tl-close" id="close">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="tl-body">
          ${!chatStarted ? renderSteps() : renderChat()}
        </div>
        <div class="tl-foot">Direct chat by <a href="https://terms.law" target="_blank">Terms.Law</a></div>
      </div>
    `;
    attachEvents();
  }

  function renderSteps() {
    if (step === 0) return renderTopics();
    if (step === 1) return renderSubtopics();
    return '';
  }

  function renderTopics() {
    const tr = t();
    const topicsList = topics();
    return `
      <div class="tl-lang">
        <button class="tl-lang-btn en ${currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English"></button>
        <button class="tl-lang-btn ru ${currentLang === 'ru' ? 'active' : ''}" data-lang="ru" title="Русский"></button>
        <button class="tl-lang-btn es ${currentLang === 'es' ? 'active' : ''}" data-lang="es" title="Español"></button>
      </div>
      <div class="tl-trust">
        <span class="g"><svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg> ${tr.licensed}</span>
        <span class="b"><svg viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg> ${tr.realPerson}</span>
        <span class="p"><svg viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg> ${tr.private}</span>
      </div>
      <div class="tl-step">
        <div class="tl-q">${tr.helpQuestion}</div>
        <div class="tl-hint">${tr.clickHint}</div>
        <div class="tl-topics">
          ${Object.entries(topicsList).map(([k, tp]) => `
            <div class="tl-topic" data-topic="${k}">
              <div class="tl-topic-icon">${tp.icon}</div>
              <div class="tl-topic-label">${tp.label}</div>
              <div class="tl-topic-desc">${tp.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderSubtopics() {
    const tr = t();
    const topicData = topics()[visitorTopic];
    return `
      <div class="tl-step">
        <div class="tl-back" id="back">
          <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          ${tr.back}
        </div>
        <div class="tl-q">${topicData.icon} ${topicData.label}</div>
        <div class="tl-hint">${tr.situationHint}</div>
        <div class="tl-subs">
          ${topicData.subtopics.map(s => `<div class="tl-sub" data-sub="${s}">${s}</div>`).join('')}
        </div>
      </div>
    `;
  }

  function renderChat() {
    const tr = t();
    let notice = '';
    if (currentStatus === 'away') {
      notice = `<div class="tl-notice away">
        <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 101.414-1.414L11 9.586V6z"/></svg>
        ${tr.awayNotice}${visitorEmail ? '. ' + visitorEmail : ''}
      </div>`;
    } else if (currentStatus === 'available') {
      notice = `<div class="tl-notice available">
        <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
        ${tr.availableNotice}
      </div>`;
    }

    // Show back button only if no messages have been sent yet
    const canGoBack = messages.length <= 1;
    const backBtn = canGoBack ? `
      <div class="tl-chat-back" id="chatBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        ${tr.back}
      </div>
    ` : '';

    return `
      <div class="tl-chat">
        ${backBtn}
        ${notice}
        <div class="tl-msgs" id="msgs"></div>
        <div class="tl-input-bar">
          <input class="tl-chat-in" id="chatIn" placeholder="${tr.typeMessage}">
          <button class="tl-send" id="sendBtn">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const fab = document.getElementById('fab');
    const close = document.getElementById('close');
    if (fab) fab.onclick = () => { isOpen = !isOpen; render(); };
    if (close) close.onclick = () => { isOpen = false; render(); };

    // Language toggle
    document.querySelectorAll('.tl-lang-btn').forEach(el => {
      el.onclick = () => {
        currentLang = el.dataset.lang;
        localStorage.setItem('termslaw_lang', currentLang);
        render();
      };
    });

    // Topic cards
    document.querySelectorAll('.tl-topic').forEach(el => {
      el.onclick = () => {
        visitorTopic = el.dataset.topic;
        step = 1;
        render();
      };
    });

    // Back button
    const back = document.getElementById('back');
    if (back) back.onclick = () => { step = 0; render(); };

    // Subtopic selection - starts chat immediately
    document.querySelectorAll('.tl-sub').forEach(el => {
      el.onclick = () => {
        visitorSubtopic = el.dataset.sub;
        startChat();
      };
    });

    // Chat back button - go back to subtopic selection
    const chatBack = document.getElementById('chatBack');
    if (chatBack) chatBack.onclick = () => {
      chatStarted = false;
      messages = [];
      step = 1;
      render();
    };

    // Chat
    const chatIn = document.getElementById('chatIn');
    const sendBtn = document.getElementById('sendBtn');
    if (chatIn) {
      chatIn.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
      setTimeout(() => chatIn.focus(), 100);
    }
    if (sendBtn) sendBtn.onclick = sendMessage;

    // Render messages
    if (chatStarted) {
      const msgs = document.getElementById('msgs');
      if (msgs) messages.forEach(m => appendMsg(m.text, m.from));
    }
  }

  function startChat() {
    chatStarted = true;
    step = 2;
    render();

    const tr = t();
    const topicData = topics()[visitorTopic];
    const isAway = currentStatus !== 'online';
    const greeting = tr.greeting(topicData.label, visitorSubtopic, isAway);

    setTimeout(() => addMessage(greeting, 's'), 400);
    startPolling();
  }

  function addMessage(text, from) {
    messages.push({ text, from, ts: Date.now() });
    appendMsg(text, from);
    if (from !== 'sys') lastMessageTimestamp = Date.now();
  }

  function appendMsg(text, from) {
    const msgs = document.getElementById('msgs');
    if (!msgs) return;

    const div = document.createElement('div');
    if (from === 'sys') {
      div.className = 'tl-msg-sys';
      div.textContent = text;
    } else {
      div.className = `tl-msg ${from}`;
      div.innerHTML = `
        <div class="tl-msg-ava">${from === 'v' ? '?' : ''}</div>
        <div class="tl-msg-bub">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
      `;
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function sendMessage() {
    const chatIn = document.getElementById('chatIn');
    if (!chatIn) return;
    const text = chatIn.value.trim();
    if (!text) return;

    chatIn.value = '';
    addMessage(text, 'v');

    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send', visitorId, visitorName, visitorEmail, visitorTopic,
          message: `[${visitorSubtopic}] ${text}`,
          page: window.location.href
        })
      });
    } catch (e) {
      addMessage(t().connectionError, 'sys');
    }
  }

  function startPolling() {
    if (pollInterval) return;
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}?action=getMessages&visitorId=${visitorId}&since=${lastMessageTimestamp}`);
        const data = await res.json();
        currentStatus = data.status || (data.online ? 'online' : 'away');
        if (data.messages) {
          data.messages.forEach(msg => {
            if (msg.from === 'sergei') addMessage(msg.text, 's');
            if (msg.timestamp > lastMessageTimestamp) lastMessageTimestamp = msg.timestamp;
          });
        }
      } catch (e) {}
    }, 3000);
  }

  async function checkStatus() {
    try {
      const res = await fetch(`${API_BASE}?action=status`);
      const data = await res.json();
      currentStatus = data.status || (data.online ? 'online' : 'away');
      render();
    } catch (e) { currentStatus = 'away'; }
  }

  function generateId() {
    return 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  checkStatus();
  setInterval(checkStatus, 30000);
  render();

})();
