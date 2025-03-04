import { useState } from "react";
import { Avatar, Button } from "antd";
import { ThumbsUp, Star, Plus } from "lucide-react";

const ProductReviews = ({
  reviews,
  productId,
  averageRating,
  totalReviews,
}) => {
  const [helpful, setHelpful] = useState([]);
  const [filter, setFilter] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  // Tính toán số lượng đánh giá theo từng sao
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  // Lọc và sắp xếp đánh giá
  const filteredReviews = reviews.filter(
    (review) => filter === null || review.rating === filter
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.helpfulCount - a.helpfulCount;
    }
  });

  // Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

      {/* Tổng quan đánh giá */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Điểm trung bình */}
        <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg transition-transform hover:scale-105">
          <h3 className="text-lg font-medium mb-2">Average Rating</h3>
          <div className="text-5xl font-bold text-primary mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center space-x-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(averageRating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {totalReviews} reviews
          </div>
        </div>

        {/* Phân phối đánh giá */}
        <div className="col-span-1 md:col-span-2 p-4 bg-primary-50/50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating] || 0;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center">
                  <button
                    onClick={() => setFilter(filter === rating ? null : rating)}
                    className={`flex items-center space-x-2 min-w-[60px] text-sm ${
                      filter === rating
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>{rating}</span>
                    <Star
                      size={12}
                      className={
                        filter === rating
                          ? "fill-primary text-primary"
                          : "fill-gray-400 text-muted-foreground"
                      }
                    />
                  </button>
                  <div className="flex-1 mx-3 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full w-3xl rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bộ lọc */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter(null)}
                className={`text-xs h-8 ${
                  filter === null ? "bg-primary/10 border-primary/30" : ""
                }`}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter(filter === rating ? null : rating)}
                  className={`text-xs h-8 ${
                    filter === rating ? "bg-primary/10 border-primary/30" : ""
                  }`}
                >
                  {rating}★
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <Separator className="mb-6" /> */}

      {/* Danh sách đánh giá */}
      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div
              key={review.id}
              className="animate-fade-in rounded-lg p-4 hover:bg-muted/10 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={review.userAvatar}
                    alt={review.userName}
                    className="h-10 w-10 border"
                  ></Avatar>
                  <div className="ml-2">
                    <h4 className="font-medium">{review.userName}</h4>
                    <div className="flex items-center space-x-1 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </div>
              </div>

              <div className="mt-3 text-sm">{review.comment}</div>

              {/* <Separator className="mt-6" /> */}
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No reviews match your current filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter(null)}
              className="mt-2"
            >
              Clear Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
