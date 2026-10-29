import type { ScriptCategoria } from './types';

export const scriptsVeicular: ScriptCategoria[] = [
  {
    "categoria": "Adesão e Vistoria Prévia",
    "itens": [
      {
        "titulo": "Primeiro contato / cotação",
        "texto": "Olá! Seja bem-vindo(a) à [Nome da Associação]. Sou o assistente virtual e estou aqui para te ajudar. Para iniciarmos sua cotação, preciso de algumas informações: nome completo, CPF, modelo e ano do veículo. Pode me informar?"
      },
      {
        "titulo": "Apresentação do mutualismo",
        "texto": "Diferente das seguradoras tradicionais, nossa associação funciona pelo sistema de mutualismo: os custos dos sinistros são divididos entre todos os membros. Isso garante mensalidades muito mais acessíveis. Quer saber o valor para o seu veículo?"
      },
      {
        "titulo": "Envio da cotação",
        "texto": "Sua cotação está pronta! Para o [Modelo/Ano do veículo], o valor da taxa de adesão é R$ [Valor] e a mensalidade estimada é R$ [Valor]. Essa mensalidade pode variar conforme o rateio mensal. Gostaria de prosseguir com a adesão?"
      },
      {
        "titulo": "Agendamento da vistoria",
        "texto": "Ótimo! O próximo passo é realizar a vistoria prévia do veículo. Um inspetor irá avaliar e fotografar o estado atual do carro para registrar avarias pré-existentes. Qual é o melhor dia e horário para você? Atendemos de [dias] das [horário]."
      },
      {
        "titulo": "Confirmação da vistoria",
        "texto": "Vistoria confirmada! [Data] às [Horário] no endereço [Local] ou em sua residência. Certifique-se de que o veículo esteja limpo e disponível. O inspetor levará aproximadamente [tempo] minutos. Qualquer dúvida, é só chamar!"
      },
      {
        "titulo": "Resultado da vistoria",
        "texto": "A vistoria do seu veículo foi concluída com sucesso! O laudo e as fotos foram registrados em nosso sistema. Agora basta assinar o contrato e realizar o pagamento da taxa de adesão para ativar sua proteção. Vou te enviar os próximos passos."
      },
      {
        "titulo": "Ativação do contrato",
        "texto": "🎉 Parabéns, [Nome]! Seu veículo [Modelo/Placa] está oficialmente protegido pela [Nome da Associação]. A proteção já está ativa. Guarde nosso contato para emergências: [número]. Seja bem-vindo(a) à nossa família!"
      },
      {
        "titulo": "Dúvida sobre consulta de crédito",
        "texto": "Ótima notícia: não realizamos consulta ao SPC/Serasa! Nossa análise é baseada exclusivamente no valor do veículo, e não no histórico de crédito do associado. Isso facilita muito a adesão. Quer iniciar sua cotação?"
      }
    ],
    "sub": "Da cotação à ativação do contrato"
  },
  {
    "categoria": "Assistência 24 Horas",
    "itens": [
      {
        "titulo": "Acionamento de assistência",
        "texto": "Olá! Para acionar a assistência 24h, preciso de algumas informações rápidas: nome completo, número de associado, localização atual (cidade e ponto de referência) e qual é o problema com o veículo. Pode me informar?"
      },
      {
        "titulo": "Confirmação do acionamento",
        "texto": "Acionamento registrado! Estamos despachando um prestador de serviço para seu local. O tempo estimado de chegada é de [XX] minutos. Você receberá o contato do prestador em breve. Fique em local seguro e aguarde!"
      },
      {
        "titulo": "Serviço de guincho",
        "texto": "Entendido! Vamos acionar o guincho para seu veículo. Para isso, confirme: endereço de origem e destino (oficina credenciada ou endereço de sua preferência dentro do raio de [XX] km coberto pelo seu plano). Pode confirmar os endereços?"
      },
      {
        "titulo": "Pane elétrica ou mecânica",
        "texto": "Para pane elétrica ou mecânica, estamos enviando um mecânico de prontidão ao seu local. Serviços cobertos: carga de bateria, troca de pneu, falta de combustível e panes leves. Se o problema não puder ser resolvido no local, acionamos o guincho automaticamente."
      },
      {
        "titulo": "Serviço de chaveiro",
        "texto": "Sem problema! Vamos acionar um chaveiro para te atender. Para agilizar, confirme seu endereço completo e um ponto de referência. O prestador chegará em aproximadamente [XX] minutos e apresentará identificação ao chegar."
      },
      {
        "titulo": "Acompanhamento do serviço",
        "texto": "O prestador [Nome] está a caminho e chegará em aproximadamente [XX] minutos. Contato dele: [telefone]. Caso precise de mais alguma coisa ou o serviço atrase, entre em contato diretamente por aqui. Estamos acompanhando tudo!"
      },
      {
        "titulo": "Conclusão da assistência",
        "texto": "Ótimo! O serviço foi concluído. Esperamos que tudo tenha corrido bem. Como você avalia o atendimento recebido hoje? De 1 a 5, sendo 5 excelente. Sua avaliação nos ajuda a melhorar a qualidade dos nossos prestadores!"
      }
    ],
    "sub": "Urgências e panes na estrada"
  },
  {
    "categoria": "Abertura e Regulação de Sinistro",
    "itens": [
      {
        "titulo": "Abertura de sinistro",
        "texto": "Lamentamos o ocorrido, [Nome]. Para darmos início ao processo de sinistro, precisamos dos seguintes documentos: Boletim de Ocorrência (B.O.), CNH, documento do veículo (CRLV) e fotos dos danos. Pode nos enviar por aqui?"
      },
      {
        "titulo": "Confirmação de protocolo",
        "texto": "Documentos recebidos! Seu sinistro foi registrado com o protocolo nº [Número]. A partir de agora, nossa equipe de regulação iniciará a análise do caso. O prazo de retorno é de até [X] dias úteis. Qualquer novidade, avisaremos por aqui."
      },
      {
        "titulo": "Sindicância em andamento",
        "texto": "Olá, [Nome]! Informamos que o processo de sindicância do seu sinistro (protocolo [Número]) está em andamento. Nossa equipe está verificando todos os documentos e informações. Entraremos em contato assim que tivermos uma atualização."
      },
      {
        "titulo": "Documentação pendente",
        "texto": "Olá, [Nome]! Para dar continuidade ao seu sinistro, precisamos do(s) seguinte(s) documento(s) ainda pendente(s): [lista de documentos]. Por favor, envie o mais breve possível para não haver atrasos no seu processo."
      },
      {
        "titulo": "Pagamento da cota de participação",
        "texto": "Boa notícia! Seu sinistro foi aprovado. Para liberarmos os reparos, é necessário o pagamento da sua cota de participação no valor de R$ [Valor]. Segue o boleto/PIX para pagamento. Após a confirmação, agendaremos o veículo na oficina credenciada."
      },
      {
        "titulo": "Envio para oficina credenciada",
        "texto": "Pagamento confirmado! Seu veículo foi direcionado para a oficina [Nome da Oficina], localizada em [Endereço]. Contato da oficina: [telefone]. O prazo estimado para orçamento e início dos reparos é de [X] dias úteis."
      },
      {
        "titulo": "Sinistro de roubo ou furto",
        "texto": "Lamentamos muito o ocorrido, [Nome]. Para sinistros de roubo ou furto, além do B.O., precisamos: declaração de próprio punho relatando o ocorrido, chaves do veículo (todas as cópias) e comprovante de transferência do veículo para a associação. Pode nos enviar?"
      },
      {
        "titulo": "Danos a terceiros",
        "texto": "Para sinistros com danos a terceiros, precisamos dos dados completos do terceiro envolvido (nome, CPF, contato, placa do veículo) e do B.O. registrado. Nossa equipe entrará em contato com o terceiro para dar início ao processo de regulação."
      }
    ],
    "sub": "Colisões, roubos, furtos e danos"
  },
  {
    "categoria": "Resolução e Rateio de Custos",
    "itens": [
      {
        "titulo": "Aprovação do orçamento",
        "texto": "Olá, [Nome]! O orçamento dos reparos do seu veículo foi aprovado pela nossa equipe técnica. A oficina já está autorizada a iniciar os serviços. O prazo estimado para conclusão é de [X] dias úteis. Avisaremos quando estiver pronto!"
      },
      {
        "titulo": "Veículo pronto para retirada",
        "texto": "Ótimas notícias, [Nome]! Seu veículo [Modelo/Placa] está pronto para retirada na oficina [Nome] — [Endereço]. Horário de funcionamento: [horário]. Por favor, leve um documento de identidade. Qualquer dúvida, é só chamar!"
      },
      {
        "titulo": "Perda total do veículo",
        "texto": "Olá, [Nome]. Após análise técnica, seu veículo foi caracterizado como perda total. O valor de indenização será calculado com base na tabela FIPE do mês vigente: R$ [Valor]. Para darmos início ao pagamento, precisamos dos documentos de transferência. Podemos prosseguir?"
      },
      {
        "titulo": "Agendamento da indenização",
        "texto": "O pagamento da indenização referente ao seu sinistro (protocolo [Número]) foi agendado para [Data]. O valor de R$ [Valor] será creditado na conta [Banco] — Agência [Número] — Conta [Número]. Confirma os dados bancários?"
      },
      {
        "titulo": "Aviso de rateio mensal",
        "texto": "Olá, [Nome]! Informamos que o rateio referente ao mês de [Mês] foi calculado. O valor total de sinistros do período foi dividido entre todos os associados. Sua cota de rateio é R$ [Valor] e será incluída na mensalidade do próximo boleto."
      },
      {
        "titulo": "Boleto de mensalidade",
        "texto": "Olá, [Nome]! Segue o boleto de mensalidade referente ao mês de [Mês]: R$ [Valor]. Vencimento: [Data]. Você pode pagar via PIX: [chave] ou pelo código de barras: [código]. Em caso de dúvidas sobre o valor, é só perguntar!"
      },
      {
        "titulo": "Encerramento e satisfação",
        "texto": "Olá, [Nome]! Seu sinistro (protocolo [Número]) foi concluído com sucesso. Esperamos que tudo tenha corrido bem. Como você avalia nosso atendimento durante esse processo? De 1 a 5, sendo 5 excelente. Sua opinião é muito importante para nós!"
      }
    ],
    "sub": "Reparos, indenizações e mensalidade"
  }
];
