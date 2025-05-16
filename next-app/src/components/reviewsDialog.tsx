import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Review from "./review";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination";
import { City } from "@/utils/types/city";

interface IReviewsDialogProps {
  city: City;
}

function ReviewsDialog({ city }: IReviewsDialogProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 2;

  const totalPages = Math.ceil((city.reviews?.length || 0) / reviewsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedReviews = city.reviews?.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Voir les avis</Button>
      </DialogTrigger>
      <DialogContent className="overflow-scroll h-[calc(100vh-100px)] w-[80%] sm:max-w-none">
        <DialogHeader>
          <DialogTitle>
            Avis sur la ville de {`${city.cityName} - ${city.postalCode}`}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full justify-between py-5">
          <div className="overflow-y-auto space-y-3">
            {paginatedReviews?.map((review, index) => (
              <Review key={index} {...review} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 0 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={i === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages - 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewsDialog;
