import axios from "axios";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useStore, Book } from "@/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  // DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { GiBookPile } from "react-icons/gi";

export const BookSearch = () => {
  const { books, addBook } = useStore((state) => state);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // phan trang gioi han so luong ket qua hien thi
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 100;

  type SearchResult = {
    docs: Book[];
    numFound: number; //so luong ket qua tim dc
  };

  const searchBooks = async (page: number = 1) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`
      );
      // phan hoi ket qua
      setResults(response.data.docs);
      setTotalResults(response.data.numFound);
      setCurrentPage(page);
    } catch (error) {
      // bao loi
      console.error("Error fetching OpenLibary API data", error);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      searchBooks();
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      searchBooks(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
      searchBooks(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  //CN tim kiem
  const SearchInput = (
    <div className="flex flex-col items-center gap-3 px-4 py-3 sm:flex-row">
      <div className="relative w-full sm:max-w-xs">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Tìm sách..."
        />
      </div>
      <Button
        className="max-sm:w-full sm:max-w-xs"
        onClick={() => searchBooks()}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
            Đang tìm...
          </>
        ) : (
          "Tìm kiếm"
        )}
      </Button>
    </div>
  );
  // hien ket qua tim kiem
  const SearchResults = (
    <div
      className="block max-h-[200px] overflow-y-auto sm:max-h-[300px] 
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 
        [&::-webkit-scrollbar-track]:bg-gray-100
        dark:[&::-webkit-scrollbar-track]:bg-slate-700
        [&::-webkit-scrollbar]:w-2"
    >
      {query.length > 0 && results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sách</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead className="hidden sm:table-cell">
                Năm xuất bản
              </TableHead>
              <TableHead className="hidden sm:table-cell">Số trang</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {results.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {book.first_publish_year}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {book.number_of_pages_median || "-"}
                </TableCell>
                {/* them sach vao ds doc */}
                <TableCell>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      addBook({
                        ...book,
                        status: "backlog",
                      });
                    }}
                    disabled={books.some((b) => b.key === book.key)}
                  >
                    <GiBookPile className="size-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex max-h-60 items-center justify-center p-16">
          <p className="text-gray-600 dark:text-gray-400">Hãy tìm sách mới!</p>
        </div>
      )}
    </div>
  );

  //phan trang tim kiem
  const SearchPagination = (
    <div
      className="flex w-full flex-col items-center gap-3 border-t px-6 py-4
          sm:flex-row sm:justify-between"
    >
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalResults > 0 ? (
            <>
              Đang hiện{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {startIndex} - {endIndex}
              </span>{" "}
              trong{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {totalResults}
              </span>{" "}
              kết quả đã tìm được
            </>
          ) : (
            "Tìm thấy 0 kết quả"
          )}
        </p>
      </div>
      {/* nut chuyen trang */}
      <div className="inline-flex gap-x-2">
        <Button
          variant="outline"
          onClick={handlePreviousClick}
          disabled={currentPage <= 1 || isLoading}
        >
          {/* Trang trước */}
          <SlArrowLeft className="size-4"></SlArrowLeft>
        </Button>
        <Button
          variant="outline"
          onClick={handleNextClick}
          disabled={
            currentPage >= Math.ceil(totalResults / resultsPerPage) || isLoading
          }
        >
          {/* Trang sau */}
          <SlArrowRight className="size-4"></SlArrowRight>
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Thêm sách mới</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Thêm Sách Mới</DialogTitle>
            <DialogDescription>
              Hãy tìm kiếm theo tên sách, tác giả hoặc ISBN.
            </DialogDescription>
            {SearchInput}
          </DialogHeader>
          {SearchResults}
          <DialogFooter>{SearchPagination}</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Thêm sách mới</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Thêm sách mới</DrawerTitle>
          <DrawerDescription>Tìm kiếm</DrawerDescription>
          {SearchInput}
        </DrawerHeader>
        {SearchResults}
        <DrawerFooter>{SearchPagination}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
