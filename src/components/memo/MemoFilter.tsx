import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import { useFilterStore } from "@/store/filter"
import { useShortcutStore } from '@/store/shortcut'

import { getTextWithMemoType } from "@/helper/filter"

import Icon from "@/components/Icon"

import "@/components/css/memo-filter.less"

const MemoFilter = () => {
  const location = useLocation();
  const filterStore = useFilterStore();
  const shortcutStore = useShortcutStore();
  const filter = filterStore.state;
  const { tag: tagQuery, duration, type: memoType, text: textQuery, shortcutId, visibility } = filter;
  const shortcut = shortcutId ? shortcutStore.getShortcutById(shortcutId) : null;
  const showFilter = Boolean(tagQuery || (duration && duration.from < duration.to) || memoType || textQuery || shortcut || visibility);

  // 路由发生变化
  useEffect(() => {
    filterStore.clearFilter();
  }, [location]);

  return (
    <div className={`filter-query-container ${showFilter ? "" : "!hidden"}`}>
      <span className="mx-2 text-gray-400">{"filter"}:</span>
      {/* 快捷键过滤器 */}
      <div
        className={"filter-item-container " + (shortcut ? "" : "!hidden")}
        onClick={() => {
          filterStore.setMemoShortcut(undefined);
        }}
      >
      <Icon.Target className="icon-text" /> {shortcut?.title}
      </div>
      {/* 标签过滤器 */}
      <div
        className={"filter-item-container " + (tagQuery ? "" : "!hidden")}
        onClick={() => {
          filterStore.setTagFilter(undefined);
        }}
      >
        <Icon.Tag className="icon-text" /> {tagQuery}
      </div>
      {/* Memo类型过滤器 */}
      <div
        className={"filter-item-container " + (memoType ? "" : "!hidden")}
        onClick={() => {
          filterStore.setMemoTypeFilter(undefined);
        }}
      >
        <Icon.Box className="icon-text" /> {getTextWithMemoType(memoType as MemoSpecType)}
      </div>
      {/* 可见性过滤器 */}
      <div
        className={"filter-item-container " + (visibility ? "" : "!hidden")}
        onClick={() => {
          filterStore.setMemoVisibilityFilter(undefined);
        }}
      >
        <Icon.Eye className="icon-text" /> {visibility}
      </div>
      {/* 到期过滤器 */}
      {duration && duration.from < duration.to ? (
        <div
          className="filter-item-container"
          onClick={() => {
            filterStore.setFromAndToFilter();
          }}
        >
          <Icon.Calendar className="icon-text" />
          {"period"}
          {/* {t("filter-period", {
            from: getDateString(duration.from),
            to: getDateString(duration.to),
            interpolation: { escapeValue: false },
          })} */}
        </div>
      ) : null}
      {/* 文本搜索过滤器 */}
      <div
        className={"filter-item-container " + (textQuery ? "" : "!hidden")}
        onClick={() => {
          filterStore.setTextFilter(undefined);
        }}
      >
        <Icon.Search className="icon-text" /> {textQuery}
      </div>
    </div>
  );
};

export default MemoFilter
