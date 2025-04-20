import { useEffect, useState } from "react";
import { useSearchStore } from "../store/useSearchStore";

const MediaGrid = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fetchMediaGrid } = useSearchStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetchMediaGrid();
        setPosts(res);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts()
  }, []);
  
  return (
    <div className="md:w-8/12 h-full hidden md:flex justify-center">
      <div className="w-full lg:w-10/12 items-center justify-center bg-base-100/50 overflow-y-scroll no-scrollbar px-4 py-8">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-1 auto-rows-[192px]">
          {loading &&
            Array.from({ length: 30 }).map((_, index) => {
              const isBig = index % 7 === 0;
              return (
                <div
                  key={index}
                  className={`skeleton ${isBig ? "lg:col-span-2 lg:row-span-2" : ""}`}
                />
              );
            })}

          {!loading &&
            posts.map((post, index) => {
              const isBig = index % 7 === 0;
              return (
                <img
                  key={post.postId}
                  src={post.media || "/noImg.png"}
                  alt="Post"
                  className={`${
                    isBig ? "col-span-2 row-span-2" : ""
                  } object-cover w-full h-full hover:object-contain`}
                />
              );
            })}

          {error && (
            <p className="col-span-full text-center mt-4">
              Server is busy, Grid will load shortly
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGrid;
