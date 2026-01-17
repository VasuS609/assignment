import { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { DataTablePageEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import type { Table, ApiResponse } from '../types/TableData';
import { usePersistentSelection } from '../hooks/usePersistentSelection';
import { RowSelectionOverlay } from './RowSelection';

const ROWS_PER_PAGE = 20;

export default function ArtworkTable() {
  const [data, setData] = useState<Table[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { setAllRowsOnPage, getSelectedIdsForPage } = usePersistentSelection();

  // Fetch data for a specific page
  const fetchPage = async (page: number) => {
    setLoading(true);
    try {
      // ⚠️ Fixed: removed extra spaces in URL
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${ROWS_PER_PAGE}`);
      const result: ApiResponse = await res.json();
      setData(result.data);
      setTotalRecords(result.pagination.total_object);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch artworks:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load first page when component mounts
  useEffect(() => {
    fetchPage(1);
  }, []);

  // Get currently selected rows (for DataTable display)
  const selectedRows = useMemo(() => {
    const selectedIds = getSelectedIdsForPage(currentPage);
    return data.filter(item => selectedIds.has(item.id));
  }, [data, currentPage, getSelectedIdsForPage]);

  // Handle pagination (when user clicks next/prev page)
  const handlePageChange = (event: DataTablePageEvent) => {
    const newPage = (event.page ?? 0) + 1; // PrimeReact uses 0-based index
    fetchPage(newPage);
  };

  // Handle "Select N rows" from overlay
  const handleCustomSelect = async (targetCount: number) => {
    let remaining = targetCount;
    let page = currentPage;

    while (remaining > 0) {
      let pageData: Table[] = [];

      if (page === currentPage) {
        pageData = data; // Use already-loaded data
      } else {
        // Fetch new page
        try {
          const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${ROWS_PER_PAGE}`);
          const result: ApiResponse = await res.json();
          pageData = result.data;
          if (pageData.length === 0) break; // No more data
        } catch (err) {
          console.error(`Failed to fetch page ${page}:`, err);
          break;
        }
      }

      // Select as many as we can from this page
      const canSelect = Math.min(remaining, pageData.length);
      const idsToSelect = pageData.slice(0, canSelect).map(a => a.id);
      setAllRowsOnPage(page, idsToSelect, true);

      remaining -= canSelect;

      // Stop if we've selected enough or reached end of data
      if (remaining <= 0 || pageData.length < ROWS_PER_PAGE) break;

      page++;
    }

    // If we left the current page, reload it to show updated selections
    if (page !== currentPage) {
      fetchPage(currentPage);
    }
  };

  // Handle checkbox selections in the table
  const handleSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Table[]>) => {
    const selectedItems = event.value || [];
    const selectedIds = selectedItems.map(item => item.id);
    setAllRowsOnPage(currentPage, selectedIds, true);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Button to open "Select N rows" popup */}
      <RowSelectionOverlay onSelect={handleCustomSelect} />

      {/* Data Table */}
      <DataTable
        value={data}
        dataKey="id"
        paginator
        rows={ROWS_PER_PAGE}
        totalRecords={totalRecords}
        lazy
        onPage={handlePageChange}
        first={(currentPage - 1) * ROWS_PER_PAGE}
        selection={selectedRows}
        onSelectionChange={handleSelectionChange}
        selectionMode="multiple"
        loading={loading}
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" style={{ width: '3rem' }} />
        <Column field="title" header="Title" sortable />
        <Column field="place_of_origin" header="Origin" sortable />
        <Column field="artist_display" header="Artist" style={{ minWidth: '200px' }} />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Year" sortable />
        <Column field="date_end" header="End Year" sortable />
      </DataTable>
    </div>
  );
}