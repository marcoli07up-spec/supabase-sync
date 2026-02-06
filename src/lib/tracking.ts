// Jadlog Tracking Simulation
// 12-day delivery simulation with progressive updates

export interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
  completed: boolean;
}

export interface TrackingInfo {
  carrier: string;
  trackingCode: string;
  estimatedDelivery: string;
  currentStatus: string;
  events: TrackingEvent[];
  isDelivered: boolean;
  isReturned: boolean;
  deliveryAttempts: number;
}

const trackingSteps: { day: number; status: string; description: string; location: string }[] = [
  { day: 0, status: 'Pedido Recebido', description: 'Pedido confirmado e em preparação', location: 'Centro de Distribuição - SP' },
  { day: 1, status: 'Coletado', description: 'Objeto coletado pela transportadora', location: 'Centro de Distribuição - SP' },
  { day: 2, status: 'Em Trânsito', description: 'Objeto em trânsito para centro de distribuição', location: 'Rodovia Presidente Dutra - SP' },
  { day: 3, status: 'Em Trânsito', description: 'Objeto chegou ao centro de distribuição regional', location: 'CD Jadlog Regional' },
  { day: 4, status: 'Em Trânsito', description: 'Objeto em transferência entre unidades', location: 'CD Jadlog Intermediário' },
  { day: 5, status: 'Em Trânsito', description: 'Objeto saiu para a unidade de destino', location: 'Hub Jadlog' },
  { day: 6, status: 'Em Trânsito', description: 'Objeto chegou à cidade de destino', location: 'Unidade Local Jadlog' },
  { day: 7, status: 'Em Trânsito', description: 'Objeto em roteirização para entrega', location: 'Unidade Local Jadlog' },
  { day: 8, status: 'Saiu para Entrega', description: 'Objeto saiu para entrega ao destinatário', location: 'Rota de Entrega' },
  { day: 9, status: 'Tentativa de Entrega 1', description: 'Primeira tentativa de entrega - Destinatário ausente', location: 'Endereço do Destinatário' },
  { day: 10, status: 'Tentativa de Entrega 2', description: 'Segunda tentativa de entrega - Destinatário ausente', location: 'Endereço do Destinatário' },
  { day: 11, status: 'Tentativa de Entrega 3', description: 'Terceira tentativa de entrega - Destinatário ausente', location: 'Endereço do Destinatário' },
  { day: 12, status: 'Devolvido ao Remetente', description: 'Objeto devolvido ao remetente após 3 tentativas de entrega', location: 'Centro de Distribuição - SP' },
];

function generateTrackingCode(orderId: string): string {
  const prefix = 'JL';
  const suffix = orderId.slice(0, 8).toUpperCase().replace(/-/g, '');
  return `${prefix}${suffix}BR`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatTrackingDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTrackingTime(date: Date, hourOffset: number): string {
  const d = new Date(date);
  d.setHours(8 + hourOffset, Math.floor(Math.random() * 60), 0);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTrackingInfo(orderId: string, orderCreatedAt: string): TrackingInfo {
  const orderDate = new Date(orderCreatedAt);
  const now = new Date();
  const daysSinceOrder = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const trackingCode = generateTrackingCode(orderId);
  const estimatedDelivery = addDays(orderDate, 8);
  
  // Only show events up to current day
  const visibleDays = Math.min(daysSinceOrder, 12);
  
  const events: TrackingEvent[] = [];
  
  for (let i = 0; i <= visibleDays; i++) {
    const step = trackingSteps.find(s => s.day === i);
    if (step) {
      const eventDate = addDays(orderDate, i);
      events.push({
        date: formatTrackingDate(eventDate),
        time: formatTrackingTime(eventDate, i % 10),
        location: step.location,
        status: step.status,
        description: step.description,
        completed: true,
      });
    }
  }
  
  // Reverse to show most recent first
  events.reverse();
  
  const latestEvent = events[0];
  const isReturned = visibleDays >= 12;
  const isDelivered = false; // In this simulation, delivery always fails
  
  // Count delivery attempts
  let deliveryAttempts = 0;
  if (visibleDays >= 9) deliveryAttempts = 1;
  if (visibleDays >= 10) deliveryAttempts = 2;
  if (visibleDays >= 11) deliveryAttempts = 3;
  
  return {
    carrier: 'Jadlog',
    trackingCode,
    estimatedDelivery: formatTrackingDate(estimatedDelivery),
    currentStatus: latestEvent?.status || 'Aguardando',
    events,
    isDelivered,
    isReturned,
    deliveryAttempts,
  };
}

export function getNextUpdateMessage(daysSinceOrder: number): string {
  if (daysSinceOrder < 12) {
    return 'Próxima atualização amanhã';
  }
  return 'Rastreio finalizado';
}
