# 📊 Type-Safe Paginated DataTable with Persistent Row Selection (React + TypeScript)

A fully type-safe, server-driven paginated DataTable with persistent row selection across pages.

Most table libraries (including PrimeReact) lose selected rows when navigating between pages.  
This implementation solves that using a custom hook with optimized data structures.

---

## 🚀 Features

- ✅ Fully type-safe API handling  
- 📄 Server-side pagination  
- 🔁 Persistent row selection across pages  
- ☑️ Single & multiple row selection  
- 📌 Page-level Select All  
- ⚡ High performance using `Set` and `Map`  
- 🧠 Clean separation of logic and UI  

---

## 🗂 Project Structure

```txt
src/
│
├── types/
│   └── interface.ts
│
├── hooks/
│   └── usePersistentSelection.ts
│
├── components/
│   └── ArtWorkTable.tsx
📐 Type System
types/interface.ts
Defines all required fields displayed in the DataTable.

export interface DataField {
  id: string;
  title: string;
  artist: string;
  year: number;
  category: string;
}

```


🧩 Main Component — ArtWorkTable.tsx
Responsible for:

Fetching paginated data
Managing current page state
Rendering the DataTable
Handling row selection
Managing paginator & counts

🔄 Page Loading
Triggered on:

Component mount

Page change

await fetchData(currentPage, rowsPerPage);
📄 Pagination Index Fix
PrimeReact → zero-based
API → one-based

setCurrentPage(newPage + 1);
Prevents off-by-one errors.

