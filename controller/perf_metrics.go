package controller

import (
	"net/http"
	"strconv"

	"github.com/QuantumNous/new-api/model"
	perfmetrics "github.com/QuantumNous/new-api/pkg/perf_metrics"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/setting/ratio_setting"

	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
)

func GetPerfMetricsSummary(c *gin.Context) {
	hours := 24
	if rawHours := c.Query("hours"); rawHours != "" {
		if parsed, err := strconv.Atoi(rawHours); err == nil {
			hours = parsed
		}
	}

	result, err := perfmetrics.QuerySummaryAll(hours, visiblePerfMetricGroups(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

func GetPerfMetrics(c *gin.Context) {
	modelName := c.Query("model")
	if modelName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "model is required",
		})
		return
	}

	hours := 24
	if rawHours := c.Query("hours"); rawHours != "" {
		if parsed, err := strconv.Atoi(rawHours); err == nil {
			hours = parsed
		}
	}

	result, err := perfmetrics.Query(perfmetrics.QueryParams{
		Model: modelName,
		Group: c.Query("group"),
		Hours: hours,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	result.Groups = filterVisiblePerfMetricGroups(result.Groups, visiblePerfMetricGroups(c))

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

func visiblePerfMetricGroups(c *gin.Context) []string {
	activeGroups := lo.Keys(ratio_setting.GetGroupRatioCopy())
	if _, authenticated := c.Get("id"); !authenticated {
		return append(activeGroups, "auto")
	}

	userID := c.GetInt("id")
	if userID <= 0 {
		return []string{}
	}
	userGroup, err := model.GetUserGroup(userID, false)
	if err != nil {
		return []string{}
	}
	usableGroups := service.GetUserUsableGroups(userGroup)
	visible := make([]string, 0, len(activeGroups)+1)
	for _, group := range activeGroups {
		if _, ok := usableGroups[group]; ok {
			visible = append(visible, group)
		}
	}
	if _, ok := usableGroups["auto"]; ok {
		visible = append(visible, "auto")
	}
	return visible
}

func filterVisiblePerfMetricGroups(groups []perfmetrics.GroupResult, visible []string) []perfmetrics.GroupResult {
	allowed := make(map[string]struct{}, len(visible))
	for _, group := range visible {
		allowed[group] = struct{}{}
	}
	return lo.Filter(groups, func(g perfmetrics.GroupResult, _ int) bool {
		_, ok := allowed[g.Group]
		return ok
	})
}
