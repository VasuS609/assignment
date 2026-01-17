
export interface Table{
id:number;
title:string;
place_of_origin:string;
artist_display:string;
inscription:string;
date_start:number;
date_end:number;
}

export interface Pagination {
currentPage:number;
totalPages:number;
totalEnteries:number;
total_object:number;
per_page:number;
}

export interface ApiResponse{
data:Table[];
pagination:Pagination;
}