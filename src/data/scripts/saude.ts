import type { ScriptCategoria } from './types';

export const scriptsSaude: ScriptCategoria[] = [
  {
    "categoria": "Primeiro Contato",
    "itens": [
      {
        "titulo": "Boas-vindas",
        "texto": "Olá! Seja bem-vindo(a) à [Nome da Clínica]. Sou o assistente virtual e estou aqui para te ajudar. Como posso te atender hoje?"
      },
      {
        "titulo": "Fora do horário",
        "texto": "Olá! Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Você pode agendar sua consulta por aqui mesmo e nossa equipe entrará em contato. Qual é o seu nome?"
      },
      {
        "titulo": "Primeira consulta",
        "texto": "Que ótimo que você entrou em contato! Para agendar sua primeira consulta, preciso de: nome completo, data de nascimento e qual especialidade você precisa. Pode me informar?"
      },
      {
        "titulo": "Veio por indicação",
        "texto": "Que bom saber que foi indicado(a)! Ficamos felizes com isso. Para darmos sequência ao seu atendimento, qual é o seu nome e o que você precisa?"
      }
    ],
    "sub": "Recepção e boas-vindas"
  },
  {
    "categoria": "Agendamento",
    "itens": [
      {
        "titulo": "Solicitar agendamento",
        "texto": "Claro! Vou verificar a disponibilidade para você. Qual especialidade ou médico(a) você precisa? Tem alguma preferência de dia ou horário?"
      },
      {
        "titulo": "Confirmação de consulta",
        "texto": "Sua consulta está confirmada! [Data] às [Horário] com o(a) Dr(a). [Nome]. Lembre-se de trazer documento de identidade e cartão do convênio, se houver. Qualquer dúvida, é só chamar!"
      },
      {
        "titulo": "Lembrete 24h antes",
        "texto": "Olá, [Nome]! Lembrando que você tem consulta amanhã, [Data], às [Horário], com o(a) Dr(a). [Nome]. Confirma sua presença?"
      },
      {
        "titulo": "Lembrete no dia",
        "texto": "Bom dia, [Nome]! Hoje é o dia da sua consulta com o(a) Dr(a). [Nome] às [Horário]. Estamos te esperando! Precisa de alguma informação sobre como chegar?"
      },
      {
        "titulo": "Lista de espera",
        "texto": "No momento não temos horários disponíveis para essa data, mas posso te colocar em nossa lista de espera. Se surgir um cancelamento, entramos em contato imediatamente. Deseja?"
      }
    ],
    "sub": "Consultas e horários"
  },
  {
    "categoria": "Cancelamento e Reagendamento",
    "itens": [
      {
        "titulo": "Cancelamento pelo paciente",
        "texto": "Entendemos! Para cancelar sua consulta, preciso confirmar: é a consulta do dia [Data] às [Horário] com o(a) Dr(a). [Nome]? Gostaria de já reagendar para outra data?"
      },
      {
        "titulo": "Reagendamento",
        "texto": "Sem problemas! Vou verificar os próximos horários disponíveis com o(a) Dr(a). [Nome]. Tem preferência de dia da semana ou período (manhã/tarde)?"
      },
      {
        "titulo": "Cancelamento pela clínica",
        "texto": "Olá, [Nome]. Precisamos informar que a consulta do dia [Data] precisou ser remarcada. Pedimos desculpas pelo transtorno. Já temos um novo horário disponível: [Data] às [Horário]. Funciona para você?"
      },
      {
        "titulo": "Não compareceu",
        "texto": "Olá, [Nome]! Notamos que você não pôde comparecer à consulta de hoje. Ficamos à disposição para reagendar quando for conveniente. Como posso te ajudar?"
      }
    ],
    "sub": "Alterações de consulta"
  },
  {
    "categoria": "Convênio e Pagamento",
    "itens": [
      {
        "titulo": "Convênios aceitos",
        "texto": "Trabalhamos com os seguintes convênios: [lista]. Caso você não tenha convênio, também atendemos de forma particular. Gostaria de saber mais sobre os valores?"
      },
      {
        "titulo": "Verificação de cobertura",
        "texto": "Para verificar a cobertura do seu convênio, preciso do número da sua carteirinha e nome do plano. Pode me informar? Verifico a autorização para você."
      },
      {
        "titulo": "Valores particulares",
        "texto": "O valor da consulta particular com o(a) Dr(a). [Nome] é de R$ [Valor]. Aceitamos cartão de crédito, débito, Pix e dinheiro. Gostaria de agendar?"
      },
      {
        "titulo": "Pagamento confirmado",
        "texto": "Pagamento confirmado! Seu agendamento está garantido. Você receberá a confirmação por aqui. Qualquer dúvida, estamos à disposição!"
      }
    ],
    "sub": "Planos e valores"
  },
  {
    "categoria": "Exames e Procedimentos",
    "itens": [
      {
        "titulo": "Solicitar exame",
        "texto": "Para agendar seu exame, preciso saber: qual exame foi solicitado e você tem pedido médico? Com essas informações consigo verificar a disponibilidade e o preparo necessário."
      },
      {
        "titulo": "Preparo para exame",
        "texto": "Para o exame de [Nome do Exame], é necessário: [instruções de preparo]. É muito importante seguir essas orientações para garantir um resultado preciso. Alguma dúvida?"
      },
      {
        "titulo": "Resultado disponível",
        "texto": "Seu resultado já está disponível! Você pode retirar presencialmente ou receber por e-mail. Qual opção prefere? Lembre-se que a interpretação deve ser feita com seu médico."
      },
      {
        "titulo": "Telemedicina",
        "texto": "Sim, oferecemos consultas por telemedicina! É uma ótima opção para retornos ou situações que não exijam exame físico. O valor é R$ [Valor] e o acesso é por link enviado no dia. Gostaria de agendar?"
      }
    ],
    "sub": "Pedidos, preparo e resultados"
  },
  {
    "categoria": "Pós-Consulta e Follow-up",
    "itens": [
      {
        "titulo": "Pós-consulta",
        "texto": "Olá, [Nome]! Esperamos que sua consulta tenha sido ótima. Como você está se sentindo? Se tiver qualquer dúvida sobre as orientações do(a) Dr(a). [Nome], estamos aqui para ajudar."
      },
      {
        "titulo": "Receita e retorno",
        "texto": "Sua receita e as orientações médicas serão enviadas por e-mail em breve. O(A) Dr(a). [Nome] recomenda retorno em [Prazo]. Gostaria de já agendar?"
      },
      {
        "titulo": "Pesquisa de satisfação",
        "texto": "Sua opinião é muito importante para nós! Como você avalia o atendimento que recebeu hoje? De 1 a 5, sendo 5 excelente. Sua resposta nos ajuda a melhorar cada vez mais."
      },
      {
        "titulo": "Orientação pré-procedimento",
        "texto": "Olá, [Nome]! Seu procedimento está agendado para [Data] às [Horário]. Algumas orientações importantes: [lista de orientações]. Qualquer dúvida, entre em contato. Te esperamos!"
      }
    ],
    "sub": "Acompanhamento do paciente"
  },
  {
    "categoria": "Dúvidas Frequentes",
    "itens": [
      {
        "titulo": "Localização",
        "texto": "Estamos localizados em [Endereço completo]. Referência: [ponto de referência]. Funcionamos de [dias] das [horário]. Precisando de ajuda para chegar, é só perguntar!"
      },
      {
        "titulo": "Documentos necessários",
        "texto": "Para sua consulta, traga: documento de identidade com foto, cartão do convênio (se houver), pedido médico (se for encaminhamento) e exames anteriores relacionados."
      },
      {
        "titulo": "Estacionamento",
        "texto": "Temos estacionamento [gratuito/conveniado] para nossos pacientes. [Instruções de acesso]. Caso venha de transporte público, o ponto mais próximo é [nome do ponto]."
      },
      {
        "titulo": "Urgência",
        "texto": "Entendemos a urgência! Para emergências, recomendamos o pronto-socorro mais próximo. Para encaixe urgente na clínica, me conte a situação para verificarmos a melhor opção!"
      },
      {
        "titulo": "Falar com médico",
        "texto": "Para falar diretamente com o(a) Dr(a). [Nome] sobre sua consulta, o canal adequado é por aqui ou pelo e-mail [email]. Para urgências médicas, ligue [telefone]."
      }
    ],
    "sub": "FAQ do dia a dia"
  }
];
