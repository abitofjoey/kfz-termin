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
import { template as searchEmailLimit } from './search-email-limit'
import { template as searchErrorInternal } from './search-error-internal'
import { template as searchEmailChanged } from './search-email-changed'
import { template as searchEmailChangedInternal } from './search-email-changed-internal'
import { template as searchNotFound } from './search-not-found'
import { template as searchRebookOffer } from './search-rebook-offer'
import { template as searchRebookConfirmed } from './search-rebook-confirmed'
import { template as searchRebookInternal } from './search-rebook-internal'
import { template as piDownInternal } from './pi-down-internal'
import { template as piRecoveredInternal } from './pi-recovered-internal'
import { template as bookingNotPickedUpInternal } from './booking-not-picked-up-internal'
import { template as bookingStuckInternal } from './booking-stuck-internal'
import { template as withdrawalReceived } from './withdrawal-received'
import { template as withdrawalInternal } from './withdrawal-internal'
import { template as withdrawnFound } from './withdrawn-found'
import { template as withdrawnFoundInternal } from './withdrawn-found-internal'
import { template as searchDatesUpdated } from './search-dates-updated'
import { template as searchDatesUpdatedInternal } from './search-dates-updated-internal'
import { template as searchDailyStatus } from './search-daily-status'
import { template as dailyStatusPiInternal } from './daily-status-pi-internal'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': bookingConfirmation,
  'booking-internal-notification': bookingInternalNotification,
  'appointment-found': appointmentFound,
  'appointment-found-internal': appointmentFoundInternal,
  'search-not-found-internal': searchNotFoundInternal,
  'search-email-limit': searchEmailLimit,
  'search-error-internal': searchErrorInternal,
  'search-email-changed': searchEmailChanged,
  'search-email-changed-internal': searchEmailChangedInternal,
  'search-not-found': searchNotFound,
  'search-rebook-offer': searchRebookOffer,
  'search-rebook-confirmed': searchRebookConfirmed,
  'search-rebook-internal': searchRebookInternal,
  'pi-down-internal': piDownInternal,
  'pi-recovered-internal': piRecoveredInternal,
  'booking-not-picked-up-internal': bookingNotPickedUpInternal,
  'booking-stuck-internal': bookingStuckInternal,
  'withdrawal-received': withdrawalReceived,
  'withdrawal-internal': withdrawalInternal,
  'withdrawn-found': withdrawnFound,
  'withdrawn-found-internal': withdrawnFoundInternal,
  'search-dates-updated': searchDatesUpdated,
  'search-dates-updated-internal': searchDatesUpdatedInternal,
  'search-daily-status': searchDailyStatus,
  'daily-status-pi-internal': dailyStatusPiInternal,
}
