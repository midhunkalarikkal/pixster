import PropTypes from "prop-types";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import { Heart, MessageCircleMore } from "lucide-react";

const PostGrid = ({ posts }) => {

  if(!posts) {
    return (
      <PostsSkeleton />
    )
  }
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 p-[2px] gap-1">
        {posts.map((post) => (
          <div
          key={post._id}
          className="relative overflow-hidden group hover:cursor-pointer"
        >
          <img
            className="h-96 w-auto object-cover transition-opacity duration-300 group-hover:opacity-80"
            src={post.media || '/user_avatar.jpg'}
            alt={`Post by user`}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <p className="flex flex-col items-center"><Heart />{post.likes}</p>
            <p className="flex flex-col items-center"><MessageCircleMore />{post.commentsCount}</p>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

PostGrid.propTypes = {
    posts: PropTypes.array,
}

export default PostGrid;