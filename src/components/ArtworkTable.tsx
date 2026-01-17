// ArtworkTable.tsx
import { useState, useEffect, useMemo } from 'react';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import type { Artwork } from '../types/TableData';
import { usePersistentSelection } from '../hooks/usePersistentSelection'; // ✅

const ROWS_PER_PAGE = 12;

export default function ArtworkTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [loading, setLoading] = useState(true);

  // ✅ Use the persistent hook
  const { getSelectedIdsForPage, setAllRowsOnPage } = usePersistentSelection();

  // Load data for 1-based page
  const loadPage = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${ROWS_PER_PAGE}`);
      const result = await res.json();
      setArtworks(result.data);
      setTotal(result.pagination.total);
    } catch (err) {
      console.error(err);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  // ✅ Get selected rows for CURRENT page (1-based)
  const selectedRows = useMemo(() => {
    const oneBasedPage = currentPage + 1;
    const selectedIds = getSelectedIdsForPage(oneBasedPage);
    return artworks.filter(item => selectedIds.has(item.id));
  }, [artworks, currentPage, getSelectedIdsForPage]);

  const onPageChange = (e: any) => {
    const newPage = e.page; // 0-based
    setCurrentPage(newPage);
    loadPage(newPage + 1);
  };

  const onSelectionChange = (e: any) => {
    const selectedItems = e.value || [];
    const ids = selectedItems.map((item: Artwork) => item.id);
    const oneBasedPage = currentPage + 1;
    // ✅ Save selection for this page
    setAllRowsOnPage(oneBasedPage, ids, true);
  };

  const selectedCount = selectedRows.length;

  return (
    <div className="p-4">
      <h4 className="mb-3">
        Selected: <span className="text-blue-500">{selectedCount}</span> rows
      </h4>

      <DataTable
        value={artworks}
        dataKey="id"
        paginator
        rows={ROWS_PER_PAGE}
        totalRecords={total}
        lazy
        first={currentPage * ROWS_PER_PAGE}
        onPage={onPageChange}
        selectionMode="multiple"
        selection={selectedRows} // ✅ Must be derived from hook
        onSelectionChange={onSelectionChange}
        loading={loading}
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column selectionMode="multiple" style={{ width: '3rem' }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" style={{ minWidth: '200px' }} />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
}