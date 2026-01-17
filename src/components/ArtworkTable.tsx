import { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { DataTablePageEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import type { Table, ApiResponse } from '../types/TableData';
import { usePersistentSelection } from '../hooks/usePersistentSelection';

const ROWS_PER_PAGE = 12;

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
    fetchPage(currentPage);
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

  
  // Handle checkbox selections in the table
  const handleSelectionChange = (event: DataTableSelectionMultipleChangeEvent<Table[]>) => {
    const selectedItems = event.value || [];
    const selectedIds = selectedItems.map(item => item.id);
    setAllRowsOnPage(currentPage, selectedIds, true);
  };

  return (
    <div className="">
   
      <h4>Selected: <span className='text-blue-500'> {selectedRows.length} </span> rows</h4>
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
      >
        <Column selectionMode="multiple" style={{ width: '3rem' }} />
        <Column field="title" header="Title" sortable />
        <Column field="place_of_origin" header="Origin" sortable />
        <Column field="artist_display" header="Artist" style={{ minWidth: '200px' }} />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" sortable />
        <Column field="date_end" header="End Date" sortable />
      </DataTable>
    </div>
  );
}