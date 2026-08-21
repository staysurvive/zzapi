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

	perfmetrics "github.com/QuantumNous/new-api/pkg/perf_metrics"
	"github.com/stretchr/testify/assert"
)

func TestFilterVisiblePerfMetricGroupsHidesUnauthorizedGroups(t *testing.T) {
	groups := []perfmetrics.GroupResult{
		{Group: "default"},
		{Group: "private"},
		{Group: "auto"},
	}

	filtered := filterVisiblePerfMetricGroups(groups, []string{"default", "auto"})

	assert.Len(t, filtered, 2)
	if len(filtered) != 2 {
		return
	}
	assert.Equal(t, []string{"default", "auto"}, []string{
		filtered[0].Group,
		filtered[1].Group,
	})
}
