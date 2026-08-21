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
import { Check, Copy, RefreshCw, TriangleAlert } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  HomepageDataState,
  HomepageModelSignal,
} from '../../lib/homepage-v5-data'
import { SignalSpine } from './signal-spine'
import { StageState } from './stage-state'

interface DeveloperIntegrationStageProps {
  baseUrl: string
  model: HomepageModelSignal | null
  state: HomepageDataState
}

export function DeveloperIntegrationStage(
  props: DeveloperIntegrationStageProps
) {
  const { t } = useTranslation()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const code = useMemo(() => {
    if (props.model?.endpointType !== 'openai' || !props.model.endpointPath) {
      return null
    }
    const baseUrl = props.baseUrl || '<YOUR_BASE_URL>'
    const endpoint = props.model.endpointPath
    const modelName = props.model.modelName
    const url = `${baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const body = JSON.stringify({
      model: modelName,
      messages: [{ role: 'user', content: 'Hello' }],
    })
    const shellQuote = (value: string) => `'${value.replaceAll("'", `'"'"'`)}'`

    return `curl -X POST ${shellQuote(url)} \\
  -H "Authorization: Bearer $ZZAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d ${shellQuote(body)}`
  }, [props.baseUrl, props.model])

  async function copyCode() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
    } catch {
      setCopiedCode(null)
    }
  }

  const copied = code !== null && copiedCode === code
  let exampleContent: ReactNode
  if (code) {
    exampleContent = (
      <pre aria-label={t('OpenAI-compatible cURL example')}>
        <code>{code}</code>
      </pre>
    )
  } else if (props.model) {
    exampleContent = (
      <div className='home-v5-developer__unavailable' role='status'>
        <TriangleAlert aria-hidden='true' />
        <div>
          <h3>{t('Compatible request example unavailable')}</h3>
          <p>{t('Choose a model that reports an OpenAI chat endpoint.')}</p>
        </div>
      </div>
    )
  } else {
    exampleContent = <StageState state={props.state} />
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
          {code
            ? t('Change the model ID, keep the integration path')
            : t('Use the route each model reports')}
        </h2>
        <p className='home-v5-stage__description'>
          {code
            ? t(
                'Use one OpenAI-compatible request shape across configured models.'
              )
            : t('This model does not report an OpenAI chat endpoint.')}
        </p>
      </div>

      <div className='home-v5-developer__surface'>
        <div className='home-v5-developer__toolbar'>
          <span>{t('cURL')}</span>
          {code ? (
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
          ) : null}
        </div>
        {exampleContent}
        <p className='sr-only' aria-live='polite'>
          {copied ? t('Code copied') : ''}
        </p>
        {code ? (
          <div className='home-v5-developer__switch-note'>
            <RefreshCw aria-hidden='true' />
            <div>
              <strong>{t('Switch model')}</strong>
              <p>
                {t(
                  'Replace only the model ID to use another configured model.'
                )}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
