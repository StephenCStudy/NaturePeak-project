import React from "react";
import { useParams } from "react-router-dom";

const PostDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Post Detail</h2>
      <p className="text-gray-600">Showing details for post: {id}</p>
    </div>
  );
};

export default PostDetailPage;
