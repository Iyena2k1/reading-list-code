import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore, Book } from "@/store";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";

import {
  GiBookPile,
  GiBookshelf,
  GiBookmarklet,
  // GiBurningBook,
} from "react-icons/gi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookSearch } from "./BookSearch";

export const BookList = () => {
  const { books, removeBook, moveBook, reorderBooks } = useStore(
    (state) => state
  );

  const moveToList = (book: Book, targetList: Book["status"]) => {
    moveBook(book, targetList);
  };

  const renderBookItem = (book: Book, index: number, listType: string) => (
    <Card
      key={index}
      // tao khung vien cho ds
      className="rounded-none first:mt-0 first:rounded-t-lg
    last:rounded-b-lg"
    >
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>{book.author_name}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" onClick={() => removeBook(book)}>
              Remove
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xóa khỏi danh sách</TooltipContent>
        </Tooltip>
        <div className="inline-flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => moveToList(book, "inProgress")}
                disabled={listType === "inProgress"}
              >
                <GiBookmarklet className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lưu vào danh sách "Đang Đọc"</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => moveToList(book, "backlog")}
                disabled={listType === "backlog"}
              >
                <GiBookPile className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lưu vào danh sách "Đọc Sau"</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => moveToList(book, "done")}
                disabled={listType === "done"}
              >
                <GiBookshelf className="size-5 pb-0.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lưu vào danh sách "Đã Đọc"</TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );

  //keo tha sach
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const listType = result.source.droppableId as Book["status"];

    reorderBooks(listType, sourceIndex, destinationIndex);
  };

  const renderDraggableBookList = (listType: Book["status"]) => {
    const filteredBooks = books.filter((book) => book.status === listType);
    return (
      <StrictModeDroppable droppableId={listType}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {filteredBooks.map((book, index) => (
              <Draggable key={book.key} draggableId={book.key} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="my-2"
                  >
                    <div {...provided.dragHandleProps}>
                      {renderBookItem(book, index, listType)}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {/* thêm dòng dưới để khi kéo thả các ds dưới
            không bị đẩy lên trên */}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    );
  };

  return (
    <div className="space-y-8 p-4">
      <div
        className="flex gap-2 max-sm:flex-col sm:items-center 
      sm:justify-between"
      >
        <h2 className="mb-4 text-2x1 font-bold">Danh Sách Theo Dõi</h2>
        <div className="h-full">
          <BookSearch />
        </div>
      </div>

      <h3 className="my-2 flex items-end gap-2 text-x1 font-semibold">
        Danh Sách Đang Đọc
        <GiBookmarklet className="size-6" />
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="rounded-lg border bg-muted p-4">
          {books.filter((book) => book.status === "inProgress").length > 0 ? (
            renderDraggableBookList("inProgress")
          ) : (
            <div className="p-4">
              <p className="text-primary">A rolling stone gathers no moss</p>
            </div>
          )}
        </div>
      </DragDropContext>
      <h3 className="my-2 flex items-end gap-2 text-x1 font-semibold">
        Danh Sách Đọc Sau
        <GiBookPile className="size-7" />
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="rounded-lg border bg-muted p-4">
          {books.filter((book) => book.status === "backlog").length > 0 ? (
            renderDraggableBookList("backlog")
          ) : (
            <div className="p-4">
              <p className="text-primary">
                Look before, or you'll find yourself behind
              </p>
            </div>
          )}
        </div>
      </DragDropContext>
      <h3 className="my-2 flex items-end gap-2 text-x1 font-semibold">
        Danh Sách Đã Đọc
        <GiBookshelf className="size-7 pb-0.5" />
      </h3>
      <div className="rounded-lg border bg-muted p-4">
        {books.filter((book) => book.status === "done").length > 0 ? (
          <>
            {books
              .filter((book) => book.status === "done")
              .map((book, index) => renderBookItem(book, index, "done"))}
          </>
        ) : (
          <div className="p-4">
            <p className="text-primary">Well done is better than well said</p>
          </div>
        )}
      </div>
    </div>
  );
};
