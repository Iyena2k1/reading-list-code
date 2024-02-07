import { create } from "zustand";

export type Book = {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: number;
  number_of_pages_median: number | null;
  status: "done" | "inProgress" | "backlog";
};

interface BookState {
  books: Book[];
}

interface BookStore extends BookState {
  addBook: (newBook: Book) => void;
  removeBook: (bookToRemove: Book) => void;
  moveBook: (bookToMove: Book, newStatus: Book["status"]) => void;
  loadBooksFromLocalStorage: () => void;
  reorderBooks: (
    listType: Book["status"],
    startIndex: number,
    endIndex: number
  ) => void;
}

const initialBooks: Book[] = [
  {
    key: "/works/OL262758W",
    title: "The Hobbit",
    author_name: ["J.R.R. Tolkien"],
    first_publish_year: 1937,
    number_of_pages_median: 312,
    status: "inProgress",
  },
  {
    key: "/works/OL14933414W",
    title: "The Fellowship of the Ring",
    author_name: ["J.R.R. Tolkien"],
    first_publish_year: 1954,
    number_of_pages_median: 496,
    status: "backlog",
  },
  {
    key: "/works/OL27479W",
    title: "The Two Towers",
    author_name: ["J.R.R. Tolkien"],
    first_publish_year: 1954,
    number_of_pages_median: 440,
    status: "done",
  },
];

export const useStore = create<BookStore>((set) => ({
  books: [],

  addBook: (newBook) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = [
        ...state.books,
        {
          key: newBook.key,
          title: newBook.title,
          author_name: newBook.author_name,
          first_publish_year: newBook.first_publish_year,
          number_of_pages_median: newBook.number_of_pages_median || null,
          status: newBook.status || "backlog",
        },
      ];

      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),
  removeBook: (bookToRemove) =>
    set((state: BookState) => {
      if (
        window.confirm(
          "Bạn có chắc chắn muốn xóa sách này khỏi danh sách không?"
        )
      ) {
        const updatedBooks = state.books.filter(
          (book) => book.key !== bookToRemove.key
        );
        localStorage.setItem("readingList", JSON.stringify(updatedBooks));

        return { books: updatedBooks };
      }
      return state;
    }),
  moveBook: (bookToMove, newStatus) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = state.books.map((book) =>
        book.key === bookToMove.key ? { ...book, status: newStatus } : book
      );
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),
  reorderBooks: (
    listType: Book["status"],
    startIndex: number,
    endIndex: number
  ) =>
    set((state: BookState) => {
      const filteredBooks = state.books.filter(
        (book) => book.status === listType
      );
      const [reorderedBooks] = filteredBooks.splice(startIndex, 1);

      filteredBooks.splice(endIndex, 0, reorderedBooks);

      const updatedBooks = state.books.map((book) =>
        book.status === listType ? filteredBooks.shift() || book : book
      );
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),
  loadBooksFromLocalStorage: () => {
    const storedBooks = localStorage.getItem("readingList");
    if (storedBooks) {
      set({ books: JSON.parse(storedBooks) });
    } else {
      set({ books: initialBooks });
    }
  },
}));
