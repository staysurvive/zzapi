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
package controller

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNormalizeLocaleKeepsOnlyChineseAndEnglish(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		want    string
		support bool
	}{
		{name: "english", input: "en", want: "en", support: true},
		{name: "regional english", input: "en-US", want: "en", support: true},
		{name: "chinese", input: "zh", want: "zh", support: true},
		{name: "simplified chinese", input: "zh-CN", want: "zh", support: true},
		{name: "legacy traditional chinese", input: "zh-TW", want: "zh", support: true},
		{name: "legacy japanese", input: "ja", want: "", support: false},
		{name: "unsupported french", input: "fr", want: "", support: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, supported := normalizeLocale(tt.input)
			assert.Equal(t, tt.want, got)
			assert.Equal(t, tt.support, supported)
		})
	}
}

func TestNormalizeSyncLocaleFallsBackToEnglish(t *testing.T) {
	assert.Equal(t, "en", normalizeSyncLocale("ja"))
	assert.Equal(t, "en", normalizeSyncLocale("fr-FR"))
	assert.Equal(t, "en", normalizeSyncLocale(""))
	assert.Equal(t, "zh", normalizeSyncLocale("zhCN"))
}

func TestGetUpstreamURLsUsesCanonicalAndLegacyPaths(t *testing.T) {
	t.Setenv("SYNC_UPSTREAM_BASE", "https://metadata.example/base/")

	modelsURL, vendorsURL := getUpstreamURLs("fr")
	assert.Equal(t, "https://metadata.example/base/api/newapi/models.json", modelsURL)
	assert.Equal(t, "https://metadata.example/base/api/newapi/vendors.json", vendorsURL)

	t.Setenv("SYNC_UPSTREAM_BASE", "")

	modelsURL, vendorsURL = getUpstreamURLs("zh-TW")
	assert.Equal(t, "https://basellm.github.io/llm-metadata/api/i18n/zh/newapi/models.json", modelsURL)
	assert.Equal(t, "https://basellm.github.io/llm-metadata/api/i18n/zh/newapi/vendors.json", vendorsURL)
}
