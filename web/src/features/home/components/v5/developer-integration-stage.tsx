/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { Check, Copy, RefreshCw, TriangleAlert } from 'lucide-react'
import { useMemo, useRef, useState, type ReactNode } from 'react'
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

type CodeLanguage = 'curl' | 'python' | 'node'

const CODE_LANGUAGES: CodeLanguage[] = ['curl', 'python', 'node']

function getCodeLanguageLabel(language: CodeLanguage): string {
  if (language === 'curl') return 'cURL'
  if (language === 'python') return 'Python'
  return 'Node.js'
}

export function DeveloperIntegrationStage(
  props: DeveloperIntegrationStageProps
) {
  const { t } = useTranslation()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [language, setLanguage] = useState<CodeLanguage>('curl')
  const languageTabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const examples = useMemo<Record<CodeLanguage, string> | null>(() => {
    if (props.model?.endpointType !== 'openai' || !props.model.endpointPath) {
      return null
    }

    const baseUrl = props.baseUrl || '<YOUR_BASE_URL>'
    const endpoint = props.model.endpointPath
    const modelName = props.model.modelName
    const url = `${baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const requestBody = {
      model: modelName,
      messages: [{ role: 'user', content: 'Hello' }],
    }
    const shellUrl = `'${url.replaceAll("'", `'"'"'`)}'`
    const shellBody = `'${JSON.stringify(requestBody).replaceAll("'", `'"'"'`)}'`

    return {
      curl: `curl -X POST ${shellUrl} \\
  -H "Authorization: Bearer $ZZAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d ${shellBody}`,
      python: `import os
import requests

response = requests.post(
    ${JSON.stringify(url)},
    headers={
        "Authorization": "Bearer " + os.environ["ZZAPI_KEY"],
        "Content-Type": "application/json",
    },
    json=${JSON.stringify(requestBody)},
)
print(response.json())`,
      node: `const response = await fetch(${JSON.stringify(url)}, {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + process.env.ZZAPI_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(requestBody)}),
})

console.log(await response.json())`,
    }
  }, [props.baseUrl, props.model])

  const code = examples?.[language] ?? null

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
  if (examples) {
    exampleContent = (
      <>
        <div
          className='home-v5-developer__languages'
          role='tablist'
          aria-label={t('Code language')}
        >
          {CODE_LANGUAGES.map((codeLanguage) => {
            const selected = codeLanguage === language
            const tabId = `home-v5-developer-tab-${codeLanguage}`
            return (
              <button
                key={codeLanguage}
                type='button'
                role='tab'
                id={tabId}
                aria-selected={selected}
                aria-controls='home-v5-developer-code-panel'
                tabIndex={selected ? 0 : -1}
                className='home-v5-developer__language'
                data-active={selected ? 'true' : 'false'}
                ref={(node) => {
                  languageTabsRef.current[
                    CODE_LANGUAGES.indexOf(codeLanguage)
                  ] = node
                }}
                onClick={() => setLanguage(codeLanguage)}
                onKeyDown={(event) => {
                  const isArrow =
                    event.key === 'ArrowLeft' || event.key === 'ArrowRight'
                  const isBoundary = event.key === 'Home' || event.key === 'End'
                  if (!isArrow && !isBoundary) {
                    return
                  }
                  event.preventDefault()
                  const currentIndex = CODE_LANGUAGES.indexOf(codeLanguage)
                  let nextIndex = currentIndex
                  if (event.key === 'Home') nextIndex = 0
                  else if (event.key === 'End') {
                    nextIndex = CODE_LANGUAGES.length - 1
                  } else {
                    const direction = event.key === 'ArrowRight' ? 1 : -1
                    nextIndex =
                      (currentIndex + direction + CODE_LANGUAGES.length) %
                      CODE_LANGUAGES.length
                  }
                  setLanguage(CODE_LANGUAGES[nextIndex])
                  languageTabsRef.current[nextIndex]?.focus()
                }}
              >
                {getCodeLanguageLabel(codeLanguage)}
              </button>
            )
          })}
        </div>
        <pre
          id='home-v5-developer-code-panel'
          role='tabpanel'
          aria-label={t('{{language}} example', {
            language: getCodeLanguageLabel(language),
          })}
          aria-labelledby={`home-v5-developer-tab-${language}`}
        >
          <code>{code}</code>
        </pre>
      </>
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
          {examples
            ? t('Call examples')
            : t('Use the route each model reports')}
        </h2>
        <p className='home-v5-stage__description'>
          {examples
            ? t(
                'One OpenAI-compatible entry point, ready to copy in your preferred language.'
              )
            : t('This model does not report an OpenAI chat endpoint.')}
        </p>
      </div>

      <div className='home-v5-developer__surface'>
        <div className='home-v5-developer__toolbar'>
          <span>{t('Call examples')}</span>
          {examples ? (
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
        {examples ? (
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
