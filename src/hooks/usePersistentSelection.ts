import { useState } from "react";

type SelectionState = Map<number, Set<number>>;

export const usePersistentSelection = () => {
  const [selections, setSelections] = useState<SelectionState>(new Map());

  const   getSelectedIdsForPage = (page: number) => selections.get(page) ?? new Set<number>();

  const updateSelection = (page: number, ids: Set<number>) => {
    setSelections(prev => {
      const next = new Map(prev);
      if (ids.size === 0) {
        next.delete(page); 
      } else {
        next.set(page, new Set(ids));
      }
      return next;
    });
  };
  const isSelected = (page: number, id: number) => getSelectedIdsForPage(page).has(id);

  const toggleRow = (page: number, id: number, checked: boolean) => {
    const current = getSelectedIdsForPage(page);
    const next = new Set(current);
    if (checked) next.add(id);
    else next.delete(id);
    updateSelection(page, next);
  };

  const setAllRowsOnPage = (page: number, allIds: number[], checked: boolean) => {
    updateSelection(page, checked ? new Set(allIds) : new Set());
  };

  return {
    selections,
    getSelectedIdsForPage,
    isSelected,
    toggleRow,
    setAllRowsOnPage,
  };
};