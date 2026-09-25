import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

import { template as bookingConfirmation } from './booking-confirmation'
import { template as bookingInternalNotification } from './booking-internal-notification'
import { template as appointmentFound } from './appointment-found'
import { template as appointmentFoundInternal } from './appointment-found-internal'
import { template as searchNotFoundInternal } from './search-not-found-internal'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': bookingConfirmation,
  'booking-internal-notification': bookingInternalNotification,
  'appointment-found': appointmentFound,
  'appointment-found-internal': appointmentFoundInternal,
  'search-not-found-internal': searchNotFoundInternal,
}
