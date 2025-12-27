import { MessageCircle, Phone, Clock, HelpCircle } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { SUPORTE } from '../utils/constants'

const Suporte = () => {
  const abrirWhatsApp = () => {
    const mensagem = encodeURIComponent(SUPORTE.mensagemPadrao)
    window.open(`${SUPORTE.whatsapp}?text=${mensagem}`, '_blank')
  }

  const ligar = () => {
    window.open(`tel:${SUPORTE.telefone.replace(/\D/g, '')}`, '_self')
  }

  const faq = [
    {
      pergunta: 'Como cadastro um novo prato?',
      resposta: 'Va em Pratos > toque no botao + > preencha nome, categoria, ingredientes e preco de venda.'
    },
    {
      pergunta: 'Como registro uma venda?',
      resposta: 'No Dashboard, toque em "Nova Venda" ou va em Vendas > + > selecione os pratos e forma de pagamento.'
    },
    {
      pergunta: 'O que e o DRE?',
      resposta: 'Demonstrativo de Resultado do Exercicio. Mostra suas receitas, custos e lucro do mes.'
    },
    {
      pergunta: 'Como o preco sugerido e calculado?',
      resposta: 'O sistema soma o custo dos ingredientes e aplica as taxas (Simples, cartao, custos fixos) e margem de lucro desejada.'
    },
    {
      pergunta: 'Posso usar em mais de um celular?',
      resposta: 'Sim! Basta acessar o sistema pelo navegador em qualquer dispositivo. Os dados sincronizam automaticamente.'
    }
  ]

  return (
    <PageContainer>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Precisa de ajuda?
        </h2>
        <p className="text-gray-500">
          Estamos aqui para ajudar voce!
        </p>
      </div>

      {/* Botoes de contato */}
      <div className="space-y-3 mb-8">
        <Button
          onClick={abrirWhatsApp}
          fullWidth
          size="lg"
          variant="success"
          icon={MessageCircle}
          className="!bg-[#25D366] hover:!bg-[#20BD5A]"
        >
          Chamar no WhatsApp
        </Button>

        <Button
          onClick={ligar}
          fullWidth
          size="lg"
          variant="secondary"
          icon={Phone}
        >
          Ligar: {SUPORTE.telefone}
        </Button>
      </div>

      {/* Horario */}
      <Card className="mb-6 flex items-center gap-3 bg-amber-50">
        <Clock size={20} className="text-amber-600" />
        <div>
          <p className="font-medium text-gray-900">Horario de Atendimento</p>
          <p className="text-sm text-gray-600">Segunda a Sexta, 8h as 18h</p>
        </div>
      </Card>

      {/* FAQ */}
      <PageContainer.Section title="Perguntas Frequentes">
        <div className="space-y-3">
          {faq.map((item, idx) => (
            <Card key={idx}>
              <div className="flex items-start gap-3">
                <HelpCircle size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    {item.pergunta}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.resposta}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </PageContainer.Section>

      {/* Versao */}
      <p className="text-center text-sm text-gray-400 mt-8">
        GestaoFacil v1.0.0
      </p>
    </PageContainer>
  )
}

export default Suporte
