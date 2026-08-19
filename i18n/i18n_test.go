package i18n

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSupportedLanguages(t *testing.T) {
	assert.Equal(t, []string{LangZhCN, LangEn}, SupportedLanguages())
}

func TestIsSupported(t *testing.T) {
	tests := []struct {
		name      string
		language  string
		supported bool
	}{
		{name: "simplified Chinese", language: "zh-CN", supported: true},
		{name: "bare Chinese", language: "zh", supported: true},
		{name: "legacy Taiwan Chinese", language: "zh-TW", supported: true},
		{name: "legacy traditional Chinese", language: "zh-Hant", supported: true},
		{name: "legacy Hong Kong Chinese", language: "zh-HK", supported: true},
		{name: "legacy underscore Chinese", language: "zh_TW", supported: true},
		{name: "English", language: "en", supported: true},
		{name: "regional English", language: "en-US", supported: true},
		{name: "French", language: "fr", supported: false},
		{name: "Japanese", language: "ja", supported: false},
		{name: "prefix only", language: "english", supported: false},
		{name: "empty", language: "", supported: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.supported, IsSupported(tt.language))
		})
	}
}

func TestParseAcceptLanguage(t *testing.T) {
	tests := []struct {
		name   string
		header string
		want   string
	}{
		{name: "empty", header: "", want: LangEn},
		{name: "English region", header: "en-US", want: LangEn},
		{name: "simplified Chinese", header: "zh-CN", want: LangZhCN},
		{name: "Taiwan Chinese becomes simplified", header: "zh-TW", want: LangZhCN},
		{name: "traditional Chinese becomes simplified", header: "zh-Hant", want: LangZhCN},
		{name: "Hong Kong Chinese becomes simplified", header: "zh-HK", want: LangZhCN},
		{name: "quality order", header: "en;q=0.7, zh-Hant;q=0.9", want: LangZhCN},
		{name: "skip unsupported preference", header: "fr-FR, zh-HK;q=0.8, en;q=0.7", want: LangZhCN},
		{name: "unsupported languages", header: "fr-FR, ja;q=0.8", want: LangEn},
		{name: "zero quality Chinese", header: "zh;q=0, en;q=0.5", want: LangEn},
		{name: "malformed header", header: "not a language;broken", want: LangEn},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, ParseAcceptLanguage(tt.header))
		})
	}
}

func TestTranslateUsesTwoLanguageFallback(t *testing.T) {
	require.NoError(t, Init())

	assert.Equal(t, "无效的参数", Translate(LangZhCN, MsgInvalidParams))
	assert.Equal(t, "无效的参数", Translate("zh-TW", MsgInvalidParams))
	assert.Equal(t, "无效的参数", Translate("zh-Hant", MsgInvalidParams))
	assert.Equal(t, "Invalid parameters", Translate(LangEn, MsgInvalidParams))
	assert.Equal(t, "Invalid parameters", Translate("fr-FR", MsgInvalidParams))
	assert.Equal(t, "missing.translation.key", Translate(LangZhCN, "missing.translation.key"))
}
