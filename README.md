### Building DataTable

1. Types/interface.ts
  1. Data field to display -> all the required field given in the assignment
  2. Pagination -> all the required field shown in the assignment via video
  3. ApiResponse (uses Data Field and Pagination)
 
 # need
 1. Typesafety
 2. no field remain unfilled


2. ArtWorkTable.tsx
  1. It is the main file where all code get curated
  2. It's work is to maintain table data, page number, and paginator
  3. The main component of this page is 
    a. how page behaves on loading
    b. how page behaves on page change
    c. how we can select multiple/single row
    d. counts, pagination
  
  # Components:
  1. Load Page
  it is the async function which awaits to fetch api using rows per page
  then set data to correct field
  it load page when component starts

  2. Page Change
  it's doing zero based indexing
  set currentpage as newpage +=1;

  3. Data Table
  returning column with data
  paginator + current page / enteries

3. usePersistentHook
 it's a custom hoom
-> It Remembers which row does user selected on each page, even when he navigate away and comes back 
Keeps track of which items (by ID) are selected on each page
Uses a Map where each page number points to a Set of selected IDs

getSelectedIdsForPage - Gets all selected IDs for a specific page
isSelected - Checks if a specific item is selected on a page
toggleRow - Selects or unselects a single item (checkbox behavior)
setAllRowsOnPage - Selects or unselects all items on a page (select-all checkbox)
updateSelection - Updates the selection state and cleans up empty pages


## Major Challenges faced
1.  By default, most table libraries (including PrimeReact) only track selection for the currently visible rows. When you paginate, previous selections are lost.
- I've made separate hook

2. Storing and filtering thousands of selected IDs can cause re-renders or memory issues.
- I've used Set<number> 

3. Select All Behavior Ambiguity