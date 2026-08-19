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
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorState } from '@/components/error-state'
import { ProductShell, PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/theme-provider'
import { cn } from '@/lib/utils'

import {
  LoadingSkeleton,
  EmptyState,
  SearchBar,
  PricingTable,
  PricingSidebar,
  PricingToolbar,
  ModelCardGrid,
  ModelDetailsDrawer,
} from './components'
import { EXCLUDED_GROUPS, VIEW_MODES } from './constants'
import { useFilters } from './hooks/use-filters'
import { usePricingData } from './hooks/use-pricing-data'

function PricingRetryButton(props: {
  isFetching: boolean
  onRetry: () => unknown
}) {
  const { t } = useTranslation()

  return (
    <Button
      variant='outline'
      size='sm'
      disabled={props.isFetching}
      aria-busy={props.isFetching}
      className='min-w-20'
      onClick={() => void props.onRetry()}
    >
      {props.isFetching ? t('Loading...') : t('Retry')}
    </Button>
  )
}

function PricingRefreshNotice(props: {
  isFetching: boolean
  onRetry: () => unknown
}) {
  const { t } = useTranslation()

  return (
    <div
      role='status'
      aria-live='polite'
      className='border-border bg-card/90 mx-auto mb-5 flex max-w-4xl items-center justify-between gap-3 rounded-lg border px-3 py-2 shadow-sm'
    >
      <span className='text-muted-foreground text-sm'>
        {t('Refresh failed')}
      </span>
      <PricingRetryButton
        isFetching={props.isFetching}
        onRetry={props.onRetry}
      />
    </div>
  )
}

export function Pricing() {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const [selectedModelName, setSelectedModelName] = useState<string | null>(
    null
  )

  const {
    models,
    vendors,
    groupRatio,
    usableGroup,
    endpointMap,
    autoGroups,
    hasResolvedData,
    isLoading,
    isFetching,
    error,
    refetch,
    priceRate,
    usdExchangeRate,
  } = usePricingData()
  const fatalError = Boolean(error) && !hasResolvedData
  const backgroundError = Boolean(error) && hasResolvedData
  const darkTheme = resolvedTheme === 'dark'
  const posterSource = darkTheme
    ? '/product-brand/model-plaza-poster-background-dark.webp'
    : '/product-brand/model-plaza-poster-background.webp'

  const {
    searchInput,
    sortBy,
    vendorFilter,
    groupFilter,
    quotaTypeFilter,
    endpointTypeFilter,
    tagFilter,
    tokenUnit,
    viewMode,
    showRechargePrice,
    setSearchInput,
    setSortBy,
    setVendorFilter,
    setGroupFilter,
    setQuotaTypeFilter,
    setEndpointTypeFilter,
    setTagFilter,
    setTokenUnit,
    setViewMode,
    setShowRechargePrice,
    filteredModels,
    hasActiveFilters,
    activeFilterCount,
    availableTags,
    clearFilters,
    clearSearch,
  } = useFilters(models || [])

  const handleModelClick = useCallback((modelName: string) => {
    setSelectedModelName(modelName)
  }, [])

  const selectedModel = useMemo(
    () =>
      selectedModelName
        ? (models || []).find(
            (model) => model.model_name === selectedModelName
          ) || null
        : null,
    [models, selectedModelName]
  )

  const availableGroups = useMemo(
    () =>
      Object.keys(usableGroup || {}).filter(
        (g) => !EXCLUDED_GROUPS.includes(g)
      ),
    [usableGroup]
  )

  const handleClearAll = useCallback(() => {
    clearFilters()
    clearSearch()
  }, [clearFilters, clearSearch])

  const renderPricingContent = () => {
    if (filteredModels.length === 0) {
      return (
        <EmptyState
          searchQuery={searchInput}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearAll}
        />
      )
    }

    if (viewMode === VIEW_MODES.CARD) {
      return (
        <ModelCardGrid
          models={filteredModels}
          onModelClick={handleModelClick}
          priceRate={priceRate}
          usdExchangeRate={usdExchangeRate}
          tokenUnit={tokenUnit}
          showRechargePrice={showRechargePrice}
          selectedGroup={groupFilter}
        />
      )
    }

    return (
      <PricingTable
        models={filteredModels}
        priceRate={priceRate}
        usdExchangeRate={usdExchangeRate}
        tokenUnit={tokenUnit}
        showRechargePrice={showRechargePrice}
        selectedGroup={groupFilter}
        onModelClick={handleModelClick}
      />
    )
  }

  if (isLoading && !fatalError) {
    return (
      <PublicLayout showMainContainer={false}>
        <ProductShell surface='public' className='pricing-page-shell'>
          <main
            id='main-content'
            tabIndex={-1}
            aria-busy='true'
            className='pricing-page mx-auto w-full max-w-[1800px] px-3 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 xl:px-8'
          >
            <h1 className='sr-only'>{t('Model Square')}</h1>
            <p role='status' className='sr-only'>
              {t('Loading...')}
            </p>
            <LoadingSkeleton viewMode={viewMode} />
          </main>
        </ProductShell>
      </PublicLayout>
    )
  }

  if (fatalError) {
    return (
      <PublicLayout showMainContainer={false}>
        <ProductShell surface='public' className='pricing-page-shell'>
          <main
            id='main-content'
            tabIndex={-1}
            aria-busy={isFetching}
            className='pricing-page mx-auto w-full max-w-[1800px] px-3 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 xl:px-8'
          >
            <h1 className='sr-only'>{t('Model Square')}</h1>
            <ErrorState
              description={error instanceof Error ? error.message : undefined}
              action={
                <PricingRetryButton isFetching={isFetching} onRetry={refetch} />
              }
            />
          </main>
        </ProductShell>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showMainContainer={false}>
      <ProductShell surface='public' className='pricing-page-shell'>
        <main
          id='main-content'
          tabIndex={-1}
          aria-busy={isFetching}
          className='pricing-page relative'
        >
          <img
            aria-hidden
            src={posterSource}
            alt=''
            className={cn(
              'pricing-poster-background pointer-events-none absolute inset-0 size-full object-cover select-none',
              darkTheme
                ? 'pricing-poster-background-dark'
                : 'pricing-poster-background-light'
            )}
          />
          <div
            aria-hidden
            className='pricing-poster-scrim pointer-events-none absolute inset-0'
          />
          <div className='relative z-10 mx-auto w-full max-w-[1800px] px-3 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 xl:px-8'>
            {backgroundError && (
              <PricingRefreshNotice isFetching={isFetching} onRetry={refetch} />
            )}
            <header className='pricing-page-hero mx-auto mb-7 max-w-4xl pt-2 text-center sm:mb-9 sm:pt-5'>
              <h1 className='text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.1] font-semibold'>
                {t('Model Square')}
              </h1>
              <p className='text-muted-foreground mt-3 text-sm sm:mt-4 sm:text-base'>
                <span aria-hidden className='pricing-status-dot' />
                {t('This site currently has {{count}} models enabled', {
                  count: models?.length || 0,
                })}
              </p>
              <p className='text-muted-foreground/75 mx-auto mt-2 max-w-2xl text-xs leading-relaxed sm:text-sm'>
                {t(
                  'Discover curated AI models, compare pricing and capabilities, and choose the right model for every scenario.'
                )}
              </p>
              <SearchBar
                value={searchInput}
                onChange={setSearchInput}
                onClear={clearSearch}
                placeholder={t(
                  'Search model name, provider, endpoint, or tag...'
                )}
                className='mx-auto mt-4 max-w-2xl sm:mt-6'
              />
            </header>

            <div className='pricing-page-layout grid gap-5 xl:grid-cols-[292px_minmax(0,1fr)]'>
              <PricingSidebar
                quotaTypeFilter={quotaTypeFilter}
                endpointTypeFilter={endpointTypeFilter}
                vendorFilter={vendorFilter}
                groupFilter={groupFilter}
                tagFilter={tagFilter}
                onQuotaTypeChange={setQuotaTypeFilter}
                onEndpointTypeChange={setEndpointTypeFilter}
                onVendorChange={setVendorFilter}
                onGroupChange={setGroupFilter}
                onTagChange={setTagFilter}
                vendors={vendors || []}
                groups={availableGroups}
                groupRatios={groupRatio}
                tags={availableTags}
                models={models || []}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                className='hover-scrollbar sticky top-4 hidden max-h-[calc(100dvh-2rem)] self-start overflow-y-auto xl:block'
              />

              <section
                aria-label={t('Model Square')}
                className='pricing-page-results min-w-0 space-y-4'
              >
                <PricingToolbar
                  filteredCount={filteredModels.length}
                  totalCount={models?.length}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  tokenUnit={tokenUnit}
                  onTokenUnitChange={setTokenUnit}
                  showRechargePrice={showRechargePrice}
                  onRechargePriceChange={setShowRechargePrice}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  quotaTypeFilter={quotaTypeFilter}
                  endpointTypeFilter={endpointTypeFilter}
                  vendorFilter={vendorFilter}
                  groupFilter={groupFilter}
                  tagFilter={tagFilter}
                  onQuotaTypeChange={setQuotaTypeFilter}
                  onEndpointTypeChange={setEndpointTypeFilter}
                  onVendorChange={setVendorFilter}
                  onGroupChange={setGroupFilter}
                  onTagChange={setTagFilter}
                  vendors={vendors || []}
                  groups={availableGroups}
                  groupRatios={groupRatio}
                  tags={availableTags}
                  models={models || []}
                  hasActiveFilters={hasActiveFilters}
                  activeFilterCount={activeFilterCount}
                  onClearFilters={clearFilters}
                />

                {renderPricingContent()}
              </section>
            </div>

            {selectedModel && (
              <ModelDetailsDrawer
                open={Boolean(selectedModel)}
                onOpenChange={(open) => {
                  if (!open) setSelectedModelName(null)
                }}
                model={selectedModel}
                groupRatio={groupRatio || {}}
                usableGroup={usableGroup || {}}
                endpointMap={
                  (endpointMap as Record<
                    string,
                    { path?: string; method?: string }
                  >) || {}
                }
                autoGroups={autoGroups || []}
                priceRate={priceRate ?? 1}
                usdExchangeRate={usdExchangeRate ?? 1}
                tokenUnit={tokenUnit}
                showRechargePrice={showRechargePrice}
              />
            )}
          </div>
        </main>
      </ProductShell>
    </PublicLayout>
  )
}
