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
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { HomepageModelSignal } from '../../lib/homepage-v5-data'
import { SignalSpine } from './signal-spine'

interface DeveloperIntegrationStageProps {
  baseUrl: string
  model: HomepageModelSignal | null
}

export function DeveloperIntegrationStage(
  props: DeveloperIntegrationStageProps
) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const code = useMemo(() => {
    const baseUrl = props.baseUrl || '<YOUR_BASE_URL>'
    const endpoint = props.model?.endpointPath ?? '/v1/chat/completions'
    const modelName = props.model?.modelName ?? '<MODEL_ID>'
    const url = `${baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    return `curl -X POST ${url} \\
  -H "Authorization: Bearer $ZZAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelName}",
    "messages": [{ "role": "user", "content": "Hello" }]
  }'`
  }, [props.baseUrl, props.model])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      className='home-v5-stage home-v5-developer'
      data-home-v5-stage='developer-integration'
      aria-labelledby='home-v5-developer-title'
    >
      <SignalSpine branch='right' node='ring' />
      <div className='home-v5-stage__intro'>
        <p className='home-v5-stage__eyebrow'>{t('Developer experience')}</p>
        <h2 id='home-v5-developer-title'>
          {t('Change the model ID, keep the integration path')}
        </h2>
        <p className='home-v5-stage__description'>
          {t(
            'Use one OpenAI-compatible request shape across configured models.'
          )}
        </p>
      </div>

      <div className='home-v5-developer__surface'>
        <div className='home-v5-developer__toolbar'>
          <span>{t('cURL')}</span>
          <button
            type='button'
            className='home-v5-developer__copy'
            onClick={copyCode}
            aria-label={copied ? t('Code copied') : t('Copy code')}
          >
            {copied ? (
              <Check aria-hidden='true' />
            ) : (
              <Copy aria-hidden='true' />
            )}
          </button>
        </div>
        <pre aria-label={t('OpenAI-compatible cURL example')}>
          <code>{code}</code>
        </pre>
        <p className='sr-only' aria-live='polite'>
          {copied ? t('Code copied') : ''}
        </p>
        <div className='home-v5-developer__switch-note'>
          <RefreshCw aria-hidden='true' />
          <div>
            <strong>{t('Switch model')}</strong>
            <p>
              {t('Replace only the model ID to use another configured model.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
