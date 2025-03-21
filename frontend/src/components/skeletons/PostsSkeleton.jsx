
const PostsSkeleton = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 p-2 gap-2">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="skeleton h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 rounded-md"
        ></div>
      ))}
    </div>
  )
}

export default PostsSkeleton