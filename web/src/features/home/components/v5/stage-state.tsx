/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { LockKeyhole, RadioTower, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { HomepageDataState } from '../../lib/homepage-v5-data'

interface StageStateProps {
  state: HomepageDataState
  compact?: boolean
}

export function StageState(props: StageStateProps) {
  const { t } = useTranslation()

  let title = t('Live catalog unavailable')
  let description = t(
    'The integration path remains available while live catalog data recovers.'
  )
  let Icon = TriangleAlert

  if (props.state === 'loading') {
    title = t('Loading current catalog')
    description = t('Reading the catalog without blocking this page.')
    Icon = RadioTower
  } else if (props.state === 'empty') {
    title = t('Catalog not currently published')
    description = t('No public model metadata is available right now.')
    Icon = RadioTower
  } else if (props.state === 'auth-required') {
    title = t('Sign in to view current catalog')
    description = t(
      'This deployment limits catalog visibility to signed-in users.'
    )
    Icon = LockKeyhole
  } else if (props.state === 'disabled') {
    title = t('Public catalog is disabled')
    description = t(
      'OpenAI-compatible routing remains a deployment capability.'
    )
    Icon = LockKeyhole
  }

  return (
    <div
      className='home-v5-stage-state'
      data-compact={props.compact ? 'true' : 'false'}
      data-state={props.state}
      role={props.state === 'error' ? 'status' : undefined}
      aria-live={props.state === 'loading' ? 'polite' : undefined}
    >
      <Icon aria-hidden='true' className='home-v5-stage-state__icon' />
      <div>
        <p className='home-v5-stage-state__title'>{title}</p>
        <p className='home-v5-stage-state__description'>{description}</p>
      </div>
    </div>
  )
}
