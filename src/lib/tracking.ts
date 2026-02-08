// Jadlog Tracking Simulation
// 14-day delivery simulation with progressive updates
// Delivery attempts on days 12, 13, 14

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
  { day: 8, status: 'Em Trânsito', description: 'Objeto aguardando disponibilidade de rota', location: 'Unidade Local Jadlog' },
  { day: 9, status: 'Em Trânsito', description: 'Objeto em separação para entrega', location: 'Unidade Local Jadlog' },
  { day: 10, status: 'Saiu para Entrega', description: 'Objeto saiu para entrega ao destinatário', location: 'Rota de Entrega' },
  { day: 11, status: 'Em Rota', description: 'Objeto em rota de entrega', location: 'Rota de Entrega' },
  { day: 12, status: 'Tentativa de Entrega 1', description: 'Primeira tentativa de entrega - Destinatário ausente', location: 'Endereço do Destinatário' },
  { day: 13, status: 'Tentativa de Entrega 2', description: 'Segunda tentativa de entrega - Destinatário ausente', location: 'Endereço do Destinatário' },
  { day: 14, status: 'Tentativa de Entrega 3', description: 'Terceira tentativa de entrega - Destinatário ausente', location: 'Endereço do Destinatário' },
  { day: 15, status: 'Devolvido ao Remetente', description: 'Objeto devolvido ao remetente após 3 tentativas de entrega', location: 'Centro de Distribuição - SP' },
];

function generateTrackingCode(orderId: string): string {
  const prefix = 'JL';
  const suffix = orderId.slice(0, 8).toUpperCase().replace(/-/g, '');
  return `${prefix}${suffix}BR`;
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Skip Sundays (0 = Sunday)
    if (result.getDay() !== 0) {
      addedDays++;
    }
  }
  
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
  
  // Calculate business days since order (excluding Sundays)
  let businessDaysSinceOrder = 0;
  const tempDate = new Date(orderDate);
  while (tempDate < now) {
    tempDate.setDate(tempDate.getDate() + 1);
    if (tempDate.getDay() !== 0) { // Skip Sundays
      businessDaysSinceOrder++;
    }
  }
  
  const trackingCode = generateTrackingCode(orderId);
  const estimatedDelivery = addBusinessDays(orderDate, 10);
  
  // Only show events up to current business day
  const visibleDays = Math.min(businessDaysSinceOrder, 15);
  
  const events: TrackingEvent[] = [];
  
  for (let i = 0; i <= visibleDays; i++) {
    const step = trackingSteps.find(s => s.day === i);
    if (step) {
      // Use business days for event dates (skip Sundays)
      const eventDate = addBusinessDays(orderDate, i);
      
      // Double-check: skip if eventDate falls on Sunday
      if (eventDate.getDay() === 0) continue;
      
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
  const isReturned = visibleDays >= 15;
  const isDelivered = false; // In this simulation, delivery always fails
  
  // Count delivery attempts (days 12, 13, 14)
  let deliveryAttempts = 0;
  if (visibleDays >= 12) deliveryAttempts = 1;
  if (visibleDays >= 13) deliveryAttempts = 2;
  if (visibleDays >= 14) deliveryAttempts = 3;
  
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
  if (daysSinceOrder < 15) {
    return 'Próxima atualização amanhã';
  }
  return 'Rastreio finalizado';
}
