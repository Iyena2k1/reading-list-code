import { useEffect } from "react";
import { BookList } from "./components/BookList";
import { useStore } from "./store";
import { Layout } from "./components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";

export const App = () => {
  //tao mang hien thi nhung cuon sach
  const { loadBooksFromLocalStorage } = useStore((state) => state);

  useEffect(() => {
    //hien nhung cuon sach dc luu
    loadBooksFromLocalStorage;
  }, [loadBooksFromLocalStorage]);

  return (
    <div className="container mx-auto">
      <Layout>
        <TooltipProvider>
          <BookList />
        </TooltipProvider>
      </Layout>
    </div>
  );
};

export default App;
